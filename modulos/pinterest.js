const { MessageMedia } = require('whatsapp-web.js');
const axios = require("axios");
const puppeteer = require("puppeteer");
const { numeroAleatorio } = require('./funcoes');

const chaveApi = process.env.CHAVE_RAPID_API;

async function chamaPin(msg, client) {
    if (msg.body.split(' ')[0] != '!pin'.toLowerCase()) {
        msg.reply('Você quis dizer !pin?');
        return;
    }

    try {
        const comandoInteiro = msg.body.split(' ').slice(1).join(' ');;

        const options = {
            method: 'GET',
            url: 'https://unofficial-pinterest-api.p.rapidapi.com/pinterest/pins/relevance',
            params: {
                keyword: comandoInteiro,
                num: '5'
            },
            headers: {
                'x-rapidapi-key': chaveApi,
                'x-rapidapi-host': 'unofficial-pinterest-api.p.rapidapi.com'
            }
        }

        const response = await axios.request(options);

        if (!response.data || !response.data.data || response.data.data.length < 3 || !response.data.data[0] || response.data.data[0].id === undefined) {
            msg.reply('Não foi possível mandar a foto, tente novamente com outra palavra.');
            return;
        }
         
        const ids = [response.data.data[0].id, response.data.data[1].id, response.data.data[2].id, response.data.data[3].id, response.data.data[4].id];

        client.sendMessage(msg.from, '_A foto está sendo enviada, aguarde..._');

        const links = ids.map(id => `https://br.pinterest.com/pin/${id}/`);

        const imageUrls = [];

        const browser = await puppeteer.launch();

        for (const link of links) {
            const page = await browser.newPage();

            await page.goto(link, { waitUntil: 'domcontentloaded' });

            try {
                await page.waitForSelector('img', { timeout: 5000 });

                const imageUrl = await page.$eval('img', img => img.src);
                imageUrls.push(imageUrl);
            } catch (erroImagem) {
                console.log(`Erro em pegar a imagem: ${link}:`, erroImagem);
            }

            await page.close();
        }

        const fotoEscolhida = imageUrls[numeroAleatorio(imageUrls.length, 0)];
        const media = await MessageMedia.fromUrl(fotoEscolhida);

        msg.reply(media);
        await browser.close();

    } catch (erro) {
        console.log(erro);
    }
}

module.exports = { chamaPin }