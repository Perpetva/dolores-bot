const axios = require('axios');
const { traduzDescricao } = require('./traducao')

async function mandaConselho(msg) {
    try {
        const response = await axios.get('https://api.adviceslip.com/advice')
        const mensagem = response.data.slip.advice
        const mensagemTraduzida = await traduzDescricao(mensagem)

        msg.reply(`Conselho... _${mensagemTraduzida}_`);
    } catch (erro) {
        console.log('Erro no conselho: ', erro);
        msg.reply('Não foi possível mandar o conselho');
    }
}

module.exports = { mandaConselho }