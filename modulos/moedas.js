const { MessageMedia } = require('whatsapp-web.js');
const { numeroAleatorio } = require('./funcoes');

const linksMoedas = ['https://sorteador.com.br/assets/images/utils/flip-a-coin/head.png', 'https://sorteador.com.br/assets/images/utils/flip-a-coin/tail.png'];

async function chamaMoeda (msg, chat, client) {
    try {
        const media = await MessageMedia.fromUrl(linksMoedas[numeroAleatorio(linksMoedas.length, 0)]);
        chat.sendStateTyping();
        client.sendMessage(msg.from, '..._Girando a Moeda_...');

        const atraso = 3000
        setTimeout(() => {
            client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
            chat.clearState();
        }, atraso);

    } catch (erro) {
        console.log('Não foi possivel mandar a moeda', erro)
        client.sendMessage(msg.from, 'Mão foi possivel girar a moeda');
    }
}

module.exports = { chamaMoeda }