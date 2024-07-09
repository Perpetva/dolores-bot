const axios = require('axios');
const CHAVE_OPENWEATHER = "SUA CHAVE OPENWEAHTER AQUI";

async function chamaClima (msg) {
    try {
    const cidade = "Sao Paulo";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&units=metric&appid=${CHAVE_OPENWEATHER}`;

    const resposta = await axios.get(apiUrl);

    const climaAtual = resposta.data.weather[0].description;
    const temperaturaAtual = resposta.data.main.temp;

    if (temperaturaAtual >= 20) {
        msg.reply(`Clima atual em ${cidade}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C! 😎`);
        msg.react('🥵')

    } else {
        msg.reply(`Clima atual em ${cidade}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C! 🥶`);
        msg.react('🥶')
        }
    }
    catch(erro) {
        console.log("Erro ao obter informações de clima:", erro);
        msg.reply(`Não foi possivel mandar o clima.`);
    }
}

module.exports = { chamaClima }