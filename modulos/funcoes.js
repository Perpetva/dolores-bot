function numeroAleatorio(quantidade, numero) {
    return Math.floor(Math.random() * quantidade) + numero;
}

async function chamaTodos (msg, chat) {
    if (chat.isGroup) {
        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} \n `;
        }

        await chat.sendMessage('*--Marcando todos--*\n' + text, { mentions });

    } else {
        msg.reply("Esse comando só funciona em grupos.");
    }
}

module.exports = { numeroAleatorio, chamaTodos }