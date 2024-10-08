const Client = require("waifu.it");
const { traduzDescricao } = require('./traducao.js');

const apikey = process.env.CHAVE_WAIFU;
const api = new Client(apikey);

async function mandaFraseAnime(msg) {
    const res = await api.getQuote();
    const requisicao = await traduzDescricao(res.quote, 'en');
    const mensagem = `${requisicao} *~${res.author}.*\n\nAnime: *${res.anime}*`;
    msg.reply(mensagem);
};

async function mandaFatoAnime(msg) {
    const res = await api.getFact();
    const requisicao = await traduzDescricao(res.fact, 'en');
    msg.reply(requisicao);
}

module.exports = { mandaFraseAnime, mandaFatoAnime }
