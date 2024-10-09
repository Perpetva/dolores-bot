const axios = require('axios');

const apiDeepTranslate = process.env.CHAVE_RAPID_API

async function getAPi(texto, lingua) {
    return {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
            'x-rapidapi-key': apiDeepTranslate,
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            q: texto,
            source: lingua,
            target: 'pt'
        }
    };
}

async function traduzDescricao(descricao, lingua) {
    try {
        const options = await getAPi(descricao, lingua);
        const response = await axios.request(options);

        const textoTraduzido = response.data.data.translations.translatedText;
        return textoTraduzido;

    } catch (erro) {
        console.log('Erro no "traduzDescricao"');
        return descricao
    }
}

async function traduz(msg) {
    if (msg.body.split(' ')[0] != '!traduz') {
        msg.reply('Você quis dizer !traduz?');
        return;
    }

    const texto = msg.body.split(' ').slice(1).join(' ');

    try {
        const options = await getAPi(texto);
        const response = await axios.request(options);

        const textoTraduzido = response.data.data.translations.translatedText;
        msg.reply(textoTraduzido);

    } catch (erro) {
        console.log('Erro no "traduz"');
        msg.reply('Não foi possível traduzir')
    }
}

async function traduzir(msg) {
    if (!msg.hasQuotedMsg) {
        msg.reply('Esse comando só funciona com mensagens marcadas.')
        return;
    }

    const mensagemEncaminhada = await msg.getQuotedMessage();
    const texto = mensagemEncaminhada.body

    try {
        const options = await getAPi(texto);
        const response = await axios.request(options);

        const textoTraduzido = response.data.data.translations.translatedText;
        msg.reply(textoTraduzido);

    } catch (erro) {
        console.log('Erro no "traduzir"');
        msg.reply('Não foi possível traduzir')
    }
}

module.exports = { traduz, traduzir, traduzDescricao }
