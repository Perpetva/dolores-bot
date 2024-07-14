const axios = require('axios');

const CHAVE_NEWSAPI = 'SUA CHAVE NEWS API AQUI';
const URL = `https://newsapi.org/v2/top-headlines?country=br&pageSize=5&apiKey=${CHAVE_NEWSAPI}`;

async function chamaNoticias (msg) {
    try {
        let enviarNoticias = ''
        const response = await axios.get(URL);
        const artigo = response.data.articles;
        artigo.forEach(function(artigo, contagem) {
            const mensagem = `Notícia ${contagem + 1}:\nTítulo: ${artigo.title}\n-----------------------------------\n`
            enviarNoticias += mensagem
        });
        msg.reply(enviarNoticias);
    } catch (erro) {
        console.log('Erro ao buscar as notícias:', erro);
        msg.reply('Não foi possivel mandar as notícias.');
    } 
};

module.exports = { chamaNoticias }