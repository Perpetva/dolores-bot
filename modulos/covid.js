const axios = require('axios');

const chaveApiCovid = process.env.CHAVE_RAPID_API

async function mandaCovid(msg) {
    const options = {
        method: 'GET',
        url: 'https://covid-19-data.p.rapidapi.com/totals',
        params: { format: 'json' },
        headers: {
            'x-rapidapi-key': chaveApiCovid,
            'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const resumido = response.data[0];
        const mensagem = `Números globais atualizados sobre Covid-19:\n\nConfirmados: ${resumido.confirmed}\nCasos críticos: ${resumido.critical}\nMortes: ${resumido.deaths}`;
        msg.reply(mensagem);
    } catch (erro) {
        console.log('Erro em mandar dados do covid,', erro);
    }
}

module.exports = { mandaCovid }