const fs = require('fs');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');
const { MessageMedia } = require('whatsapp-web.js');

function enviaFigurinha(msg, client) {
    msg.downloadMedia().then(arquivo => {
        if (arquivo) {
            const caminhoArquivo = './downloaded-media/';

            if (!fs.existsSync(caminhoArquivo)) {
                fs.mkdirSync(caminhoArquivo);
            }

            const extensao = mime.extension(arquivo.mimetype);
            const nomeArquivo = new Date().getTime();
            const nomeInteiroArquivo = `${caminhoArquivo}${nomeArquivo}.${extensao}`;

            // Salvar o arquivo
            try {
                fs.writeFileSync(nomeInteiroArquivo, arquivo.data, { encoding: 'base64' });
                console.log('Arquivo baixado com sucesso', nomeInteiroArquivo);

                const enviarSticker = (filePath) => {
                    MessageMedia.fromFilePath(filePath);
                    client.sendMessage(msg.from, new MessageMedia(arquivo.mimetype, fs.readFileSync(filePath).toString('base64'), nomeArquivo), { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" });
                    fs.unlinkSync(filePath);
                    console.log("Arquivo excluído com sucesso");
                };

                if (arquivo.mimetype.startsWith('video')) {
                    const caminhoConvertido = `${caminhoArquivo}${nomeArquivo}.mp4`;
                    ffmpeg(nomeInteiroArquivo)
                        .output(caminhoConvertido)
                        .on('end', () => {
                            console.log('Vídeo convertido com sucesso');
                            fs.unlinkSync(nomeInteiroArquivo); // Remove o arquivo original após a conversão
                            enviarSticker(caminhoConvertido);
                        })
                        .on('error', (erro) => {
                            console.log('Erro na conversão do vídeo', erro);
                            msg.reply('Erro ao converter o vídeo. Tente novamente.');
                        })
                        .run();
                } else {
                    enviarSticker(nomeInteiroArquivo);
                }
            } catch (erro) {
                console.log('Falha ao salvar o arquivo', erro);
            }
        }
    });
}

module.exports = { enviaFigurinha };
