const { MessageMedia } = require('whatsapp-web.js');
const { numeroAleatorio } = require('./funcoes')

const linksCachorro = ["https://i.pinimg.com/564x/32/cd/fc/32cdfcb9b3c93eda889ca8ba7c9cfc10.jpg", "https://i.pinimg.com/564x/39/82/32/398232fe7a3b47853f1b950f52e1bc6d.jpg", "https://i.pinimg.com/564x/cc/38/24/cc3824b6450307a7a03d95234023097a.jpg", "https://i.pinimg.com/564x/62/cd/c5/62cdc56665fd36f1d76477643b9f7995.jpg", "https://i.pinimg.com/736x/9f/d6/c9/9fd6c9f86834b014f3c3592f3b18d27d.jpg", "https://i.pinimg.com/564x/ae/b2/7d/aeb27dd6dc1006e5a91074b2ef0e41c5.jpg", "https://i.pinimg.com/564x/34/13/a6/3413a6285c63f2483bc4fa6fc9827c80.jpg", "https://i.pinimg.com/736x/b2/96/52/b29652e83ad7746a82eebb79dbec6ef9.jpg", "https://i.pinimg.com/564x/7a/6c/50/7a6c50a79c8f9fd63e5f0a1b98dee314.jpg", "https://i.pinimg.com/564x/0e/39/80/0e3980a729b345dd67f9dfa50ed7b038.jpg"];

async function chamaCachorro (msg) {
    try {
        const media = await MessageMedia.fromUrl(linksCachorro[numeroAleatorio(linksCachorro.length, 0)]);
        msg.reply(media)
    } catch (erro) {
        console.log('Erro ao mandar a foto do cachorro.', erro);
        msg.reply('Não consegui mandar foto do cachorro.');
    }
}

module.exports = { chamaCachorro }
