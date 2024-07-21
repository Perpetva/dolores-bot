const axios = require('axios');
const { mandaAudio } = require('./saudacoes.js');

const CHAVE_NEWSAPI = 'SUA CHAVE NEWS API AQUI';
const URL = `https://newsapi.org/v2/top-headlines?country=br&pageSize=5&apiKey=${CHAVE_NEWSAPI}`;

async function chamaNoticias (msg, client) {
    try {
        let enviarNoticias = ''
        const response = await axios.get(URL);
        const artigo = response.data.articles;
        artigo.forEach(function(artigo, contagem) {
            const mensagem = `\nNotícia ${contagem + 1}:\nTítulo: ${artigo.title}\n-----------------------------------`;
            enviarNoticias += mensagem;
        });
        const envia = `Abaixo noticias do momento! 📰\n${enviarNoticias}`;

        mandaAudio('./saudacoes_audios/noticia.mp3', msg, client, '📰');
        msg.reply(envia);
        
    } catch (erro) {
        console.log('Erro ao buscar as notícias:', erro);
        msg.reply('Não foi possivel mandar as notícias.');
    }
};

module.exports = { chamaNoticias }