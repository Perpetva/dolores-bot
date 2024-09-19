const { MessageMedia } = require('whatsapp-web.js');

async function mandaAudio (path, msg, client, emogi) {
    const mensagem = await MessageMedia.fromFilePath(path);
    client.sendMessage(msg.from, mensagem, { sendAudioAsVoice: true });
    msg.react(emogi);
}

async function mandaBoaNoite (msg, client) {
    mandaAudio('./saudacoes_audios/boa_noite.mp3', msg, client, '🌛')
}

async function mandaBoatarde(msg, client) {
    mandaAudio('./saudacoes_audios/boa_tarde.mp3', msg, client, '🌀')
}

async function mandaBomDia (msg, client) {
    mandaAudio('./saudacoes_audios/bom_dia.mp3', msg, client, '☀')
}

module.exports = { mandaBoaNoite, mandaAudio, mandaBomDia, mandaBoatarde }