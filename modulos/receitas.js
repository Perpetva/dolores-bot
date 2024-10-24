const axios = require('axios');
const { numeroAleatorio } = require('./funcoes');
const { MessageMedia } = require('whatsapp-web.js');
const { traduzDescricao } = require('./traducao.js');

const chaveApi = process.env.CHAVE_RAPID_API;

async function pegaLinkReceita() {
    return {
        method: 'GET',
        url: 'https://recipe-book2.p.rapidapi.com/recipes-new',
        headers: {
            'x-rapidapi-key': chaveApi,
            'x-rapidapi-host': 'recipe-book2.p.rapidapi.com'
        }
    }
};

async function informacoesReceita(urlReceita) {
    return {
        method: 'GET',
        url: 'https://recipe-book2.p.rapidapi.com/recipe-details',
        params: {
            path: urlReceita
        },
        headers: {
            'x-rapidapi-key': chaveApi,
            'x-rapidapi-host': 'recipe-book2.p.rapidapi.com'
        }
    }
};

async function receitaAleatoria(msg, client) {

    const numeroSorteado = numeroAleatorio(10, 0);
    client.sendMessage(msg.from, '_...Aguarde..._');

    try {
        const linkReceita = await pegaLinkReceita();
        const responseLinkReceita = await axios.request(linkReceita);
        const urlReceita = responseLinkReceita.data[numeroSorteado].path;

        const infoReceita = await informacoesReceita(urlReceita);
        const responseInfoReceita = await axios.request(infoReceita);

        const urlImagem = responseInfoReceita.data['Imagen de la receta'];
        const tituloDaReceita = responseInfoReceita.data['Titulo de la preparacion'];
        const porcao = responseInfoReceita.data.Raciones;
        const duracao = responseInfoReceita.data.Duracion;
        const ingredientes = responseInfoReceita.data.Ingredientes.join('\n- ');
        const modoDePreparo = responseInfoReceita.data['Pasos de preparacion'].map((modo, i) => `${i} - ${modo}`).join('\n\n');

        const imagem = await MessageMedia.fromUrl(urlImagem);
        const mensagem = `*${tituloDaReceita}*\n\nDuração: ${duracao}\n_${porcao}_\n\n*Ingredientes* 👇\n- ${ingredientes}\n\n*Modo de preparo* 👇\n${modoDePreparo}`;

        const mensagemTraduzida = await traduzDescricao(mensagem, 'es');
        await client.sendMessage(msg.from, imagem, { caption: mensagemTraduzida });

    } catch (erro) {
        console.log('Erro receitas: ', erro);
        msg.reply('Não foi possível enviar a receita.');
    }
}

module.exports = { receitaAleatoria }