//*************************************** BOT FEITO POR PERPETVA ⚡ ********************************************//


const { isCapturablePokemon, getPokemonName, getPokedex, saveCapturedPokemon, checkIfPokemonCaptured, getRandomPokemonId } = require('./modulos/poke_functions.js');
const server_poke = require('./modulos/server.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
var mime = require('mime-types');
const axios = require('axios');
const moment = require('moment-timezone');
const ytdl = require('ytdl-core'); 
const ffmpeg = require('fluent-ffmpeg');  
const express = require('express');
//-----------------------------------------------------------------------------------------------------
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
		args: ['--no-sandbox'],
	}
});

let lastSpawnedPokemonName = '';
let messageCounter = 0;
let captureEnabled = true;

chaveApiClima = "SUA_CHAVE_API_OPENWEATHER_AQUI";
chaveApiCotacao = "SUA_CHAVE_API_EXCHANGERATEAPI_AQUI";
chaveApiNoticias = "SUA_CHAVE_API_NEWSAPI_AQUI";

client.on('loading_screen', (percent, message) => { console.log('A dolores está carregando...!', percent, message) });
client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
client.on('ready', () => { console.log('No ar Richao!'); });

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

///////////////////////// FUNÇÕES //////////////////////////////
client.on('message', async msg => {
  messageCounter++
  const chat = await msg.getChat();
  const command = msg.body.toLowerCase();

  // console.log('MENSAGEM RECEBIDA:', msg); DESCOMENTE PARA RECEBER AS MENSAGENS NO CONSOLE

  if (command === '!menu') {
    msg.react('🇧🇷')
    msg.reply('Oi muito prazer! 😎 Eu sou a Dolores! \nAbaixo comandos para ajuda 😇\n\n--------------------\n!figurinha\n!grupoinfo\n!mencione\n!clima\n!gato\n!caraoucoroa\n!horario\nbaixar (link YouTube)\n!todos\n!cotacao\n!poke (ID ou nome)\n!noticias');

    // \n!todos => função quebrada.

  } else if (command === '!grupoinfo') {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply(`
                *Destalhes do Grupo*
                Nome: ${chat.name}
                Descrição: ${chat.description}
                Criado em: ${chat.createdAt.toString()}
                Criado por: ${chat.owner.user}
                Numero de participantes: ${chat.participants.length}
            `);
    } else {
      msg.reply('Esse comando só pode usar em grupo, desculpe!');
    }

  } else if (command === '!mencione') {
    const contato = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Olá! @${contato.number}!`, {
      mentions: [contato]
    });

  } else if (command === '!gato') {
    function randomNumber(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    const links = ['https://i.pinimg.com/564x/93/05/59/93055971c6fc772c5b4e03460aee2d6b.jpg', 'https://i.pinimg.com/564x/dd/8d/91/dd8d91eedf41b635010e2bf7d4e7886f.jpg', 'https://i.pinimg.com/564x/06/52/5d/06525d0c709543934ec1f8cb8e53dccb.jpg', 'https://i.pinimg.com/564x/57/2c/c5/572cc5f020d07245f1a3bc257f662989.jpg', 'https://i.pinimg.com/564x/c4/72/c5/c472c5638ce7ee6d55f1074d9db15a72.jpg', 'https://i.pinimg.com/564x/60/fd/ec/60fdecf49558e63a0e7b28be20276da7.jpg', 'https://i.pinimg.com/564x/5c/bf/fc/5cbffc39e0b57a8fd1c8a954b47856a1.jpg', 'https://i.pinimg.com/564x/f5/88/ba/f588ba1a9c0b4a0c1bcf7c35e50e87d3.jpg', 'https://i.pinimg.com/564x/e8/17/e0/e817e045d7a4cf0fa73f5a7bbb413149.jpg', 'https://i.pinimg.com/564x/3d/a9/94/3da99471e4128bc72c3b04665e5b7db7.jpg', 'https://i.pinimg.com/564x/ed/f0/eb/edf0eb0366034fb09ba6588b2f6561c1.jpg', 'https://i.pinimg.com/564x/98/5a/68/985a686f3290808b4da63041972cf27b.jpg', 'https://i.pinimg.com/564x/07/6e/ea/076eeaa0e5c5894f5ceee9fc2d90dc59.jpg', 'https://i.pinimg.com/564x/b6/65/f5/b665f5b823810bf05d78661b3ff5a2b3.jpg', 'https://i.pinimg.com/564x/bc/83/43/bc834349003b5e63370018385fb3a95f.jpg'];
    const media = await MessageMedia.fromUrl(links[randomNumber(0, (links.length - 1))]);
    msg.reply(media)

  } else if (command === '!caraoucoroa') {
    function randomNumber(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    const links = ['https://sorteador.com.br/assets/images/utils/flip-a-coin/head.png', 'https://sorteador.com.br/assets/images/utils/flip-a-coin/tail.png'];
    const media = await MessageMedia.fromUrl(links[randomNumber(0, (links.length - 1))]);
    msg.reply('..._Girando a Moeda_...')
    const atraso = 2000
    setTimeout(() => {
      client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
    }, atraso);


    const chat = await msg.getChat();
    chat.clearState();

  } else if (msg.hasMedia && command === '!figurinha') {
    msg.downloadMedia().then(media => {
      if (media) {
        const mediaPath = './donwloaded-media/';
        if (!fs.existsSync(mediaPath)) {
          fs.mkdirSync(mediaPath)
        }
        const extension = mime.extension(media.mimetype)
        const filename = new Date().getTime();
        const fullFileName = mediaPath + filename + '.' + extension
        // Salvar o nome do arquivo richao
        try {
          fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
          console.log('File Downloaded Successfully', fullFileName);
          console.log(fullFileName);
          MessageMedia.fromFilePath(filePath = fullFileName)
          client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Stickers" })
          fs.unlinkSync(fullFileName)
          console.log(`file deleted Sucefully`)

        } catch (err) {
          console.log('Failed to save the file', err)
          console.log(`File deleted Successfully`)
        }
      }
    })

  } else if (command.includes('gato')) {
    msg.react('🐈');
  } else if (command.includes('gata')) {
    msg.react('🐈‍⬛');
  } else if (command.includes('gatinha')) {
    msg.react('🐈‍⬛');
  } else if (command.includes('gatinho')) {
    msg.react('🐈');

  } else if (command === '!clima') {
    const apiKey = chaveApiClima;
    const cidade1 = "Sao Paulo";

    // URL da API do OpenWeatherMap
    const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${cidade1}&lang=pt_br&units=metric&appid=${apiKey}`;

    // Fazendo a requisição para a API do OpenWeatherMap
    axios.get(apiUrl1)
      .then(response => {
        const climaAtual = response.data.weather[0].description;
        const temperaturaAtual = response.data.main.temp;
        if (temperaturaAtual >= 20) {
          msg.reply(`Clima atual em ${cidade1}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C\nVai curtir o calor meu netinho! 😎`);
          msg.react('🥵')
        } else {
          msg.reply(`Clima atual em ${cidade1}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C\nTa frio demais meu netinho! 🥶`);
          msg.react('🥶')
        }
      })
      .catch(error => {
        console.error("Erro ao obter informações de clima:", error.response.data.message);
      });

  } else if (command === '!horario') {
    function obterHorarios() {
      const lugares = [
        { nome: 'Nova York', fuso: 'America/New_York' },
        { nome: 'Londres', fuso: 'Europe/London' },
        { nome: 'Tóquio', fuso: 'Asia/Tokyo' },
        { nome: 'Polo Sul', fuso: 'Antarctica/South_Pole' },
        { nome: 'Sidney', fuso: 'Australia/Sydney' },
        { nome: 'Egito', fuso: 'Egypt' },
        { nome: 'Moscow', fuso: 'Europe/Moscow' },
        { nome: 'Paris', fuso: 'Europe/Paris' },
        { nome: 'Jamaica', fuso: 'Jamaica' },
        { nome: 'Singapura', fuso: 'Singapore' }
      ];

      const horarios = lugares.map((lugar) => {
        const horaAtual = moment().tz(lugar.fuso).format('HH:mm');
        return `${lugar.nome}: ${horaAtual}`;
      });

      return horarios.join('\n');
    }
    const horarios1 = obterHorarios();
    msg.reply(horarios1)

  } else if (command.startsWith('!baixar ')) {
    const youtubeUrl = msg.body.split(' ')[1];

    if (youtubeUrl.startsWith('https://www.youtube.com')) {
       
    const baixarEConverterParaMP3 = (url) => {
      const videoStream = ytdl(url, { filter: 'audioonly' });

      const caminhoArquivo = ('./downloaded-audio/audio.mp3')

      ffmpeg()
        .input(videoStream)
        .audioCodec('libmp3lame')
        .audioBitrate(320)
        .toFormat('mp3')
        .on('end', () => {
          console.log('Conversão concluída com sucesso!');
        })
        .on('error', (err) => {
          console.error('Erro durante a conversão:', err);
        })
        .pipe(fs.createWriteStream(caminhoArquivo)); // Salvar o arquivo MP3
    };

    baixarEConverterParaMP3(youtubeUrl);
    msg.reply('..._Estou baixando sua música_...')

    setTimeout(envia, 10000)
    
    function envia() {
      const caminhoArquivo = './downloaded-audio/audio.mp3';
      if (fs.existsSync(caminhoArquivo)) {
        const enviaAudio = MessageMedia.fromFilePath('./downloaded-audio/audio.mp3');

        client.sendMessage(msg.from, enviaAudio);

        fs.unlinkSync(caminhoArquivo);
        console.log('Arquivo excluído com sucesso.');
      } else {
        console.log('O arquivo não existe.');
      }
    }

  } else {
    msg.reply('Insira um link do YouTube, por favor ')
  }

// ---
// ---
// ---
  // } else if (command === '!todos') {
  //   const chat = await msg.getChat();

  //   let text = "";
  //   let mentions = [];

  //   for (let participant of chat.participants) {
  //     const contact = await client.getContactById(participant.id._serialized);

  //     mentions.push(contact);
  //     text += `@${participant.id.user} `;
  //   }

  //   await chat.sendMessage(text, { mentions });

  } else if (command === '!cotacao') {
    try {
      const exchangeRateApiKey = chaveApiCotacao;

      const response = await axios.get(`https://open.er-api.com/v6/latest/USD`, {
        headers: {
          'apikey': exchangeRateApiKey,
        },
      });
      const response1 = await axios.get(`https://open.er-api.com/v6/latest/EUR`, {
        headers: {
          'apikey': exchangeRateApiKey,
        },
      });
      const response2 = await axios.get(`https://open.er-api.com/v6/latest/JPY`, {
        headers: {
          'apikey': exchangeRateApiKey,
        },
      });
      const response3 = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
        },
      });

      const realRate = response.data.rates.BRL.toFixed(2);
      const realRate1 = response1.data.rates.BRL.toFixed(2);
      const realRate2 = response2.data.rates.BRL.toFixed(2);
      const realRate3 = response3.data.bitcoin.usd;
      const replyMessage = `Cotação do Dólar _(USD)_ em relação ao Real _(BRL)_ : ${realRate}\nCotação do Euro _(EUR)_ em relação ao Real _(BRL)_ : ${realRate1}\nCotação do Iene _(JPY)_ em relação ao Real _(BRL)_ : ${realRate2}\nCotação do Bitcoin _(BTC)_ em relação ao Dólar _(USD)_ : ${realRate3}`;

      await client.sendMessage(msg.from, replyMessage);

    } catch (error) {
      console.error('Erro:', error.message);
      console.error(error.stack);
    }




  } else if (command.startsWith('!poke ')) {
    const pokemonName = msg.body.split(' ')[1];
    if (pokemonName) {
      try {
        const response = await axios.get(`http://localhost:3000/pokemon/${pokemonName}`);
        const pokemonData = response.data;

        try {
          // const imagePath = `./img/pokemon_${pokemonData.id}.png`;
          const imageResponse = await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`, { responseType: 'arraybuffer' });

          const imagemPokemonUrl = await MessageMedia.fromUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`)
          
          const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
          const descriptionArray = speciesResponse.data.flavor_text_entries.filter(entry => entry.language.name === 'en');
          const description = descriptionArray.length > 0 ? descriptionArray[0].flavor_text : 'Descrição não disponível.';

          //const translatedDescription = await translateText(description, 'pt', systranApiKey); faz uma tradução que funcione richao, pfvv

          // fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

          // const imagemPokemon = MessageMedia.fromFilePath(imagePath);

          msg.reply(`Nome: ${pokemonData.name}\nID: ${pokemonData.id}\nTipo(s): ${pokemonData.types.join(', ')}\nDescrição: ${description}`);

          client.sendMessage(msg.from, imagemPokemonUrl, { sendMediaAsSticker: true });
          console.log(`Figurinha enviada para ${msg.from}: Nome: ${pokemonData.name}`);

          // Deletar a imagem |\|\|\|\|\|\|
          // fs.unlinkSync(imagePath);

        } catch (imageError) {
          console.error('Erro ao obter a imagem do Pokémon:', imageError);
          msg.reply(`Nome: ${pokemonData.name}\nID: ${pokemonData.id}\nTipo(s): ${pokemonData.types.join(', ')}\nErro ao obter a imagem do Pokémon.`);
        }

      } catch (error) {
        console.error(error);
        msg.reply('Erro ao obter dados do Pokémon.');
      }
    } else {
      msg.reply('Por favor, forneça o nome do Pokémon após !poke.');
    }

  } else if (msg.from && messageCounter === 20) {
    captureEnabled = true;

    const randomPokemonId = getRandomPokemonId();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemonId}.png`;

    const imageUrlPassada = await MessageMedia.fromUrl(imageUrl)

    try {
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      // Salvar a imagem localmente
      // const imagePath = `./img/pokemon_${randomPokemonId}.png`;
      // fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

      // const media = MessageMedia.fromFilePath(imagePath);
      await chat.sendMessage(imageUrlPassada, { sendMediaAsSticker: true });
      console.log(`Pokemon spawnado com o ID: ${randomPokemonId}`);

      // Definir o nome do último Pokémon spawnado
      lastSpawnedPokemonName = await getPokemonName(randomPokemonId);

      // Remover o arquivo após o envio
      // fs.unlinkSync(imagePath);
    } catch (error) {
      console.error('Erro ao pegar a imagem do pokemon:', error);
      await chat.sendMessage('Erro enquanto pegava a imagem do pokemon.');
    }
    messageCounter = 0;

  } else if (command.startsWith('!pegar') && captureEnabled) {

    const parsedCommand = command.split(' ');
    if (parsedCommand.length < 2) {
      await chat.sendMessage('Você precisa especificar o nome do Pokémon que deseja capturar.');
      return;
    }

    const pokemonNameToCapture = parsedCommand.slice(1).join(' ');
    const userId = (await msg.getContact()).id._serialized;
    const groupId = (await msg.getChat()).id._serialized;

    if (isCapturablePokemon(pokemonNameToCapture, lastSpawnedPokemonName)) {
      const isAlreadyCaptured = await checkIfPokemonCaptured(userId, groupId, lastSpawnedPokemonName);

      if (!isAlreadyCaptured) {
        saveCapturedPokemon(userId, groupId, lastSpawnedPokemonName);
        await chat.sendMessage(`Parabéns! Você capturou ${lastSpawnedPokemonName}!`);
        msg.react('🎉')
        captureEnabled = false
      } else {
        await chat.sendMessage(`Você já capturou ${lastSpawnedPokemonName} anteriormente.`);
      }
    } else {
      await chat.sendMessage(`O nome do Pokémon que você tentou capturar não corresponde ao último Pokémon spawnado.`);
    }

  } else if (command === '!pokedex') {
    const userId = (await msg.getContact()).id._serialized;
    const groupId = (await msg.getChat()).id._serialized;

    const userPokedex = await getPokedex(userId, groupId);

    if (userPokedex.length > 0) {
      const pokedexMessage = `Pokémon na sua Pokedex:\n- ${userPokedex.join('\n- ')}`;
      await chat.sendMessage(pokedexMessage);
    } else {
      await chat.sendMessage('Sua Pokedex está vazia. Capture mais Pokémon!');
    }



  } else if (command === '!noticias') {
    try {
      const apiKey = chaveApiNoticias; 
      const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=br&apiKey=${apiKey}`;

      const response = await axios.get(newsApiUrl);
      const articles = response.data.articles;

      if (articles.length > 0) {
        const topNews = articles.map((article) => `*${article.title}*\n${article.url}`).join('\n\n');
        await chat.sendMessage(`📰 Últimas notícias:\n${topNews}`);
      } else {
        await chat.sendMessage('Desculpe, não foi possível recuperar as notícias no momento.');
      }
    } catch (error) {
      console.error('Erro ao obter notícias:', error);
      await chat.sendMessage('Desculpe, ocorreu um erro ao recuperar as notícias.');
    }
  }

});

client.initialize();