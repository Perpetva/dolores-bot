const axios = require('axios');

const CHAVE_NEWSAPI = 'SUA CHAVE NEWS API AQUI';
const URL = `https://newsapi.org/v2/top-headlines?country=br&pageSize=5&apiKey=${CHAVE_NEWSAPI}`;

async function chamaNoticias (msg) {
    try {
        let enviar = ''
        const response = await axios.get(URL);
        const artigo = response.data.articles;
        artigo.forEach(function(artigo, contagem) {
            const mensagem = `\nNotícia ${contagem + 1}:\nTítulo: ${artigo.title}\nURL: ${artigo.url}\n-----------------------------------`
            enviar += mensagem
            msg.reply(enviar);
        });
    } catch (erro) {
        console.log('Erro ao buscar as notícias:', erro);
        msg.reply('Não foi possivel mandar as notícias.');
    } 
};
module.exports = { chamaNoticias }