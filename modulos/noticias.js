const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const { mandaAudio } = require('./saudacoes.js');
const { numeroAleatorio } = require('./funcoes.js');
const { traduzDescricao } = require('./traducao.js')
require('dotenv').config();

const chaveNews = process.env.CHAVE_NEWSAPI;
const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${chaveNews}`;

async function chamaNoticias (msg, client) {
    const numero = numeroAleatorio(7, 0);

    try {
        const response = await axios.get(URL);
        const artigo = response.data.articles;

        if (!artigo[numero].source.id) {
            msg.reply('Não foi possível mandar a notícia, tente novamente');
            return;
        }

        const titulo = artigo[numero].title;
        const descricao = artigo[numero].description;
        const urlMateria = artigo[numero].url;
        const urlImagem = artigo[numero].urlToImage;
        const conteudo = artigo[numero].content;

        const imagem = await MessageMedia.fromUrl(urlImagem);

        const envia = `*${titulo}*\n\n_${descricao}_\n\n${conteudo}\n\n${urlMateria}`;
        const enviaTraduzido = await traduzDescricao(envia);

        mandaAudio('./saudacoes_audios/noticia.mp3', msg, client, '📰');
        client.sendMessage(msg.from, imagem, { caption: enviaTraduzido });
        
    } catch (erro) {
        console.log('Erro ao buscar as notícias:', erro);
        msg.reply('Não foi possivel mandar as notícias.');
    }
};

module.exports = { chamaNoticias }