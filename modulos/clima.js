const { mandaAudio } = require('./saudacoes.js');
const axios = require('axios');
const CHAVE_OPENWEATHER = "SUA CHAVE OPENWEAHTER AQUI";

async function chamaClima (msg, client) {
    try {
    const cidade = "Sao Paulo";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&units=metric&appid=${CHAVE_OPENWEATHER}`;

    const resposta = await axios.get(apiUrl);

    const climaAtual = resposta.data.weather[0].description;
    const temperaturaAtual = resposta.data.main.temp;
    const sensacaoTermica = resposta.data.main.feels_like;
    const humidade = resposta.data.main.humidity;
    const velocidadeVento = resposta.data.wind.speed

    const mensagem = `Clima atual em ${cidade}: *${climaAtual}*.\nTemperatura: *${temperaturaAtual}°C*.\nSensação Térmica: *${sensacaoTermica}°C*.\nHumidade: *${humidade}%*\nVelocidade do vento: *${velocidadeVento} m/s*`

    if (temperaturaAtual >= 20) {
        mandaAudio('./saudacoes_audios/clima.mp3', msg, client, '😎');
        client.sendMessage(msg.from, mensagem);
        return
    }

    mandaAudio('./saudacoes_audios/clima.mp3', msg, client, '🥶');
    client.sendMessage(msg.from, mensagem);

    } catch(erro) {
        console.log("Erro ao obter informações de clima:", erro);
        msg.reply(`Não foi possivel mandar o clima.`);
    }
}

module.exports = { chamaClima }