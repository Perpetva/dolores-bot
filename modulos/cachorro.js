const { MessageMedia } = require('whatsapp-web.js');
const { numeroAleatorio } = require('./funcoes')

const linksCachorro = ["https://i.pinimg.com/564x/32/cd/fc/32cdfcb9b3c93eda889ca8ba7c9cfc10.jpg", "https://i.pinimg.com/564x/39/82/32/398232fe7a3b47853f1b950f52e1bc6d.jpg", "https://i.pinimg.com/564x/cc/38/24/cc3824b6450307a7a03d95234023097a.jpg", "https://i.pinimg.com/564x/62/cd/c5/62cdc56665fd36f1d76477643b9f7995.jpg", "https://i.pinimg.com/736x/9f/d6/c9/9fd6c9f86834b014f3c3592f3b18d27d.jpg", "https://i.pinimg.com/564x/ae/b2/7d/aeb27dd6dc1006e5a91074b2ef0e41c5.jpg", "https://i.pinimg.com/564x/34/13/a6/3413a6285c63f2483bc4fa6fc9827c80.jpg", "https://i.pinimg.com/736x/b2/96/52/b29652e83ad7746a82eebb79dbec6ef9.jpg", "https://i.pinimg.com/564x/7a/6c/50/7a6c50a79c8f9fd63e5f0a1b98dee314.jpg", "https://i.pinimg.com/564x/0e/39/80/0e3980a729b345dd67f9dfa50ed7b038.jpg", "https://i.pinimg.com/control/564x/f6/2d/30/f62d30d9b94289e6f3b62e8c75bb72ae.jpg", "https://i.pinimg.com/control/564x/02/82/23/028223a2c1bfa4433904b6f3afd32686.jpg", "https://i.pinimg.com/564x/d1/2d/b8/d12db8df6cebdd60494b56155d6706ce.jpg", "https://i.pinimg.com/control/564x/53/18/1d/53181d98d7dabc76beb82c38ad64844a.jpg", "https://i.pinimg.com/564x/62/51/50/6251503a02dab53c2b78c2dcf72cba05.jpg", "https://i.pinimg.com/564x/7d/c0/7b/7dc07b43ac4b9a5428e196a919d70157.jpg", "https://i.pinimg.com/control/564x/87/de/71/87de71621cd356a6ccffb9d2773de9ed.jpg", "https://i.pinimg.com/564x/8e/9f/54/8e9f549be8ce47d2703ac68604358e5b.jpg", "https://i.pinimg.com/control/564x/d6/13/5e/d6135e1fe6c772ca389f7505627c2b12.jpg", "https://i.pinimg.com/control/564x/d0/16/10/d01610cd5c2cf5f8d4c07152436bea8e.jpg"];

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
