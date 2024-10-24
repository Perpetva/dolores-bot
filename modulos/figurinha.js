const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const mime = require('mime');

async function enviaFigurinha(msg, client) {
    try {
        const arquivo = await msg.downloadMedia();

        const caminhoArquivo = './downloaded-media/';
        const nomeArquivo = 'temp_media';
        const extensao = mime.extension(arquivo.mimetype);
        const nomeInteiroArquivo = `${caminhoArquivo}${nomeArquivo}.${extensao}`;

        if (!fs.existsSync(caminhoArquivo)) {
            fs.mkdirSync(caminhoArquivo);
        }

        fs.writeFileSync(nomeInteiroArquivo, arquivo.data, { encoding: 'base64' });
        console.log('Arquivo baixado com sucesso:', nomeInteiroArquivo);

        client.sendMessage(
            msg.from,
            new MessageMedia(arquivo.mimetype, fs.readFileSync(nomeInteiroArquivo).toString('base64'), nomeArquivo),
            { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" }
        );

        fs.unlinkSync(nomeInteiroArquivo);
        console.log("Arquivo excluído com sucesso:", nomeInteiroArquivo);

    } catch (erro) {
        console.log('Falha ao processar a figurinha:', erro);
        msg.reply('Erro ao processar a figurinha. Tente novamente.');
    }
}

module.exports = { enviaFigurinha };