const axios = require('axios');

const apiDeepTranslate = process.env.CHAVE_RAPID_API

async function traduz(texto) {
    const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
            'x-rapidapi-key': apiDeepTranslate,
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            q: texto,
            source: 'en',
            target: 'pt'
        }
    };

    try {
        const response = await axios.request(options);
        const translatedText = response.data.data.translations.translatedText; 
        return translatedText; 
    } catch (error) {
        console.error(error);
        return ' '
    }
}

module.exports = { traduz }
