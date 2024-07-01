const axios = require('axios');
const CHAVE_EXCHANGERATE = require('./chaves_api.js');

async function cotacao () {
    try {
        const retornoDolar = await axios.get(`https://open.er-api.com/v6/latest/USD`, {
            headers: {
                'apikey': CHAVE_EXCHANGERATE,
            },
        });

        const retornoEuro = await axios.get(`https://open.er-api.com/v6/latest/EUR`, {
            headers: {
                'apikey': CHAVE_EXCHANGERATE,
            },
        });

        const retornoIene = await axios.get(`https://open.er-api.com/v6/latest/JPY`, {
            headers: {
                'apikey': CHAVE_EXCHANGERATE,
            },
        });

        const retornoBitcoin = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: 'bitcoin',
                vs_currencies: 'usd',
            },
        });

        const dolar = retornoDolar.data.rates.BRL.toFixed(2);
        const euro = retornoEuro.data.rates.BRL.toFixed(2);
        const iene = retornoIene.data.rates.BRL.toFixed(2);
        const bitcoin = retornoBitcoin.data.bitcoin.usd;

        const mensagemResposta = `Um dolár custa hoje R$${dolar} reais\nUm euro custa hoje R$${euro} reais\nUm iene custa hoje R$${iene} reais\nUm bitcoin custa hoje U$${bitcoin} doláres`;

        return mensagemResposta

    } catch (error) {
        console.error('Erro:', error.message);
        return 'Erro ao exibir a cotação';
    }
}

module.exports = { cotacao }