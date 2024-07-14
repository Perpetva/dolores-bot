const { MessageMedia } = require('whatsapp-web.js');
const { numeroAleatorio } = require('./funcoes');

const linksGato = ['https://i.pinimg.com/564x/93/05/59/93055971c6fc772c5b4e03460aee2d6b.jpg', 'https://i.pinimg.com/564x/dd/8d/91/dd8d91eedf41b635010e2bf7d4e7886f.jpg', 'https://i.pinimg.com/564x/06/52/5d/06525d0c709543934ec1f8cb8e53dccb.jpg', 'https://i.pinimg.com/564x/57/2c/c5/572cc5f020d07245f1a3bc257f662989.jpg', 'https://i.pinimg.com/564x/c4/72/c5/c472c5638ce7ee6d55f1074d9db15a72.jpg', 'https://i.pinimg.com/564x/60/fd/ec/60fdecf49558e63a0e7b28be20276da7.jpg', 'https://i.pinimg.com/564x/5c/bf/fc/5cbffc39e0b57a8fd1c8a954b47856a1.jpg', 'https://i.pinimg.com/564x/f5/88/ba/f588ba1a9c0b4a0c1bcf7c35e50e87d3.jpg', 'https://i.pinimg.com/564x/e8/17/e0/e817e045d7a4cf0fa73f5a7bbb413149.jpg', 'https://i.pinimg.com/564x/3d/a9/94/3da99471e4128bc72c3b04665e5b7db7.jpg', 'https://i.pinimg.com/564x/ed/f0/eb/edf0eb0366034fb09ba6588b2f6561c1.jpg', 'https://i.pinimg.com/564x/98/5a/68/985a686f3290808b4da63041972cf27b.jpg', 'https://i.pinimg.com/564x/07/6e/ea/076eeaa0e5c5894f5ceee9fc2d90dc59.jpg', 'https://i.pinimg.com/564x/b6/65/f5/b665f5b823810bf05d78661b3ff5a2b3.jpg', 'https://i.pinimg.com/564x/bc/83/43/bc834349003b5e63370018385fb3a95f.jpg', 'https://i.pinimg.com/564x/98/95/9c/98959cbaf564406a664750936d6b5eb0.jpg', 'https://i.pinimg.com/564x/70/1c/47/701c47eb05f78bca0fb51f5d36897ec7.jpg','https://i.pinimg.com/564x/a5/89/be/a589bedd9a78f1bf50c1a8abfcafd9c8.jpg', 'https://i.pinimg.com/736x/5d/87/fa/5d87fa3a55c77c4959fc4f089b70325a.jpg', 'https://i.pinimg.com/564x/f2/9d/57/f29d572098a964bb368d75bef8951b6f.jpg'];

async function chamaGato (msg) {
    try {
        const media = await MessageMedia.fromUrl(linksGato[numeroAleatorio(linksGato.length, 0)]);
        msg.reply(media);
    } catch (erro) {
        console.log('Erro ao mandar a foto do gato.', erro);
        msg.reply('Não consegui mandar foto do gato.');
    }  
}

module.exports = { chamaGato }