//*************************************** BOT FEITO POR PERPETVA ⚡ ********************************************//
const { pokemonCapturavel, getNomePokemon, getPokedex, salvaPokemonCapturado, checaSePokemonCapturado, getIdPokemonAleatorio } = require('./modulos/poke_functions.js')
const server_poke = require('./modulos/server.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
var mime = require('mime-types');
const axios = require('axios');
const moment = require('moment-timezone');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const { Client, LocalAuth, MessageMedia, RemoteAuth } = require('whatsapp-web.js');
const { BitlyClient } = require('bitly');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
//-----------------------------------------------------------------------------------------------------

// Autenticação Local
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  }
});

let ultimoPokemonSpawnado = '';
let contadorMensagens = 0;
let capturaAbilitada = true;

const chaveApiClima = "SUA_CHAVE_API_OPENWEATHER_AQUI";
const chaveApiCotacao = "SUA_CHAVE_API_EXCHANGERATEAPI_AQUI";
const chaveApiNoticias = "SUA_CHAVE_API_NEWSAPI_AQUI";
const chaveBitLy = "SUA_CHAVE_API_BITLY_AQUI";

client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
client.on('ready', () => { console.log('Bot Funcionando!'); });

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

///////////////////////// FUNÇÕES //////////////////////////////
client.on('message', async msg => {
  contadorMensagens++

  const chat = await msg.getChat();
  const comando = msg.body.toLowerCase();

  // console.log('MENSAGEM RECEBIDA:', msg); DESCOMENTE PARA RECEBER AS MENSAGENS NO CONSOLE

  if (comando === '!menu') {
    msg.react('🇧🇷')
    const mensagemMenu = 'Oi muito prazer! \nAbaixo comandos para ajuda 😇\n\n--------------------\n!figurinha\n!grupoinfo\n!mencione\n!clima\n!todos\n!gato\n!caraoucoroa\n!horario\n!baixar (link YouTube)\n!cotacao\n!poke (ID ou nome)\n--------------------\n\nPeriodicamente mandarei pokemons aleatórios, para pegar digite !pegar <_nome do pokemom_>\n\nPara ver seus pokemons capturados, digite o comando !pokedex'
    msg.reply(mensagemMenu);
  }

  else if (comando === '!grupoinfo') {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply("*Destalhes do Grupo*\nNome: ${chat.name}\nDescrição: ${chat.description}\nCriado em: ${chat.createdAt.toString()}\nCriado por: ${chat.owner.user}\nNumero de participantes: ${chat.participants.length}");
    } else {
      msg.reply('Esse comando só pode usar em grupo, besta!');
    }
  }

  else if (comando === '!mencione') {
    const contato = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Olá! @${contato.number}!`, {
      mentions: [contato]
    });
  }

  else if (comando === '!gato') {
    function randomNumber(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    const links = ['https://i.pinimg.com/564x/93/05/59/93055971c6fc772c5b4e03460aee2d6b.jpg', 'https://i.pinimg.com/564x/dd/8d/91/dd8d91eedf41b635010e2bf7d4e7886f.jpg', 'https://i.pinimg.com/564x/06/52/5d/06525d0c709543934ec1f8cb8e53dccb.jpg', 'https://i.pinimg.com/564x/57/2c/c5/572cc5f020d07245f1a3bc257f662989.jpg', 'https://i.pinimg.com/564x/c4/72/c5/c472c5638ce7ee6d55f1074d9db15a72.jpg', 'https://i.pinimg.com/564x/60/fd/ec/60fdecf49558e63a0e7b28be20276da7.jpg', 'https://i.pinimg.com/564x/5c/bf/fc/5cbffc39e0b57a8fd1c8a954b47856a1.jpg', 'https://i.pinimg.com/564x/f5/88/ba/f588ba1a9c0b4a0c1bcf7c35e50e87d3.jpg', 'https://i.pinimg.com/564x/e8/17/e0/e817e045d7a4cf0fa73f5a7bbb413149.jpg', 'https://i.pinimg.com/564x/3d/a9/94/3da99471e4128bc72c3b04665e5b7db7.jpg', 'https://i.pinimg.com/564x/ed/f0/eb/edf0eb0366034fb09ba6588b2f6561c1.jpg', 'https://i.pinimg.com/564x/98/5a/68/985a686f3290808b4da63041972cf27b.jpg', 'https://i.pinimg.com/564x/07/6e/ea/076eeaa0e5c5894f5ceee9fc2d90dc59.jpg', 'https://i.pinimg.com/564x/b6/65/f5/b665f5b823810bf05d78661b3ff5a2b3.jpg', 'https://i.pinimg.com/564x/bc/83/43/bc834349003b5e63370018385fb3a95f.jpg'];

    const media = await MessageMedia.fromUrl(links[randomNumber(0, (links.length - 1))]);
    msg.reply(media)
  }

  else if (comando === '!cachorro') {
    function randomNumber(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    const links = ["https://i.pinimg.com/564x/32/cd/fc/32cdfcb9b3c93eda889ca8ba7c9cfc10.jpg", "https://i.pinimg.com/564x/39/82/32/398232fe7a3b47853f1b950f52e1bc6d.jpg", "https://i.pinimg.com/564x/cc/38/24/cc3824b6450307a7a03d95234023097a.jpg", "https://i.pinimg.com/564x/62/cd/c5/62cdc56665fd36f1d76477643b9f7995.jpg", "https://i.pinimg.com/736x/9f/d6/c9/9fd6c9f86834b014f3c3592f3b18d27d.jpg", "https://i.pinimg.com/564x/ae/b2/7d/aeb27dd6dc1006e5a91074b2ef0e41c5.jpg", "https://i.pinimg.com/564x/34/13/a6/3413a6285c63f2483bc4fa6fc9827c80.jpg", "https://i.pinimg.com/736x/b2/96/52/b29652e83ad7746a82eebb79dbec6ef9.jpg", "https://i.pinimg.com/564x/7a/6c/50/7a6c50a79c8f9fd63e5f0a1b98dee314.jpg", "https://i.pinimg.com/564x/0e/39/80/0e3980a729b345dd67f9dfa50ed7b038.jpg"];

    const media = await MessageMedia.fromUrl(links[randomNumber(0, (links.length - 1))]);
    msg.reply(media)
  }

  else if (comando === '!caraoucoroa') {
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
    chat.clearState();
  }

  else if (msg.hasMedia && comando === '!figurinha') {
    msg.downloadMedia().then(arquivo => {
      if (arquivo) {
        const caminhoArquivo = './donwloaded-media/';

        if (!fs.existsSync(caminhoArquivo)) {
          fs.mkdirSync(caminhoArquivo)
        }

        const extensao = mime.extension(arquivo.mimetype)
        const nomeArquivo = new Date().getTime();
        const nomeInteiroArquivo = caminhoArquivo + nomeArquivo + '.' + extensao

        // Salvar o nome do arquivo richao
        try {
          fs.writeFileSync(nomeInteiroArquivo, arquivo.data, { encoding: 'base64' });
          console.log('Arquivo baixado com sucesso', nomeInteiroArquivo);
          MessageMedia.fromFilePath(filePath = nomeInteiroArquivo)

          client.sendMessage(msg.from, new MessageMedia(arquivo.mimetype, arquivo.data, nomeArquivo), { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" })

          fs.unlinkSync(nomeInteiroArquivo)
          console.log("Arquivo excluído com sucesso")

        } catch (erro) {
          console.log('Falha ao salvar o arquivo', erro)
        }
      }
    })
  }

  else if (comando === '!clima') {
    const cidade1 = "Sao Paulo";

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade1}&lang=pt_br&units=metric&appid=${chaveApiClima}`;

    // Fazendo a requisição para a API do OpenWeatherMap
    axios.get(apiUrl)
      .then(resposta => {
        const climaAtual = resposta.data.weather[0].description;
        const temperaturaAtual = resposta.data.main.temp;

        if (temperaturaAtual >= 20) {
          msg.reply(`Clima atual em ${cidade1}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C\nVai curtir o calor meu netinho! 😎`);
          msg.react('🥵')

        } else {
          msg.reply(`Clima atual em ${cidade1}: ${climaAtual}. Temperatura: ${temperaturaAtual}°C\nTa frio demaise meu netinho! 🥶`);
          msg.react('🥶')
        }
      })

      .catch(erro => {
        console.error("Erro ao obter informações de clima:", erro.resposta.data.message);
      });
  }

  else if (comando === '!horario') {
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

    msg.reply(obterHorarios())
  }

  else if (comando.startsWith('!baixar ')) {
    const youtubeUrl = msg.body.split(' ')[1];

    if (youtubeUrl.startsWith('https://www.youtube.com')) {

      const baixarEConverterParaMP3 = (url) => {
        const videoStream = ytdl(url, { filter: 'audioonly' });

        const caminhoArquivo = ('./audio.mp3')

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
        const caminhoArquivo = './audio.mp3';
        if (fs.existsSync(caminhoArquivo)) {
          const enviaAudio = MessageMedia.fromFilePath('./audio.mp3');

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
  }

  else if (comando === '!todos') {
    const chat = await msg.getChat();

    let text = '';
    let mentions = [];

    for (let participant of chat.participants) {
      mentions.push(`${participant.id.user}@c.us`);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }

  else if (comando === '!cotacao') {
    try {
      const retornoDolar = await axios.get(`https://open.er-api.com/v6/latest/USD`, {
        headers: {
          'apikey': chaveApiCotacao,
        },
      });

      const retornoEuro = await axios.get(`https://open.er-api.com/v6/latest/EUR`, {
        headers: {
          'apikey': chaveApiCotacao,
        },
      });

      const retornoIene = await axios.get(`https://open.er-api.com/v6/latest/JPY`, {
        headers: {
          'apikey': chaveApiCotacao,
        },
      });

      const retornoBitcoin = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
        },
      });

      const dolar = retornoDolar.data.rates.BRL.toFixed(2);
      const euro = retornoEuro.data.rates.BRL.toFixed(2);
      const iene = retornoIene.data.rates.BRL.toFixed(2);
      const bitcoin = retornoBitcoin.data.bitcoin.usd;

      const mensagemResposta = `Um dolár custa hoje R$${dolar} reais\nUm euro custa hoje R$${euro} reais\nUm iene custa hoje R$${iene} reais\nUm bitcoin custa hoje U$${bitcoin} doláres`;

      await client.sendMessage(msg.from, mensagemResposta);

    } catch (error) {
      console.error('Erro:', error.message);
      console.error(error.stack);
    }
  }

  else if (comando.startsWith('!poke ')) {
    const nomePokemon = msg.body.split(' ')[1];
    if (nomePokemon) {
      try {
        const retorno = await axios.get(`http://localhost:3000/pokemon/${nomePokemon}`);
        const dadosPokemon = retorno.data;

        try {
          const imagemPokemonUrl = await MessageMedia.fromUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dadosPokemon.id}.png`)

          const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${dadosPokemon.id}`);
          const descriptionArray = speciesResponse.data.flavor_text_entries.filter(entry => entry.language.name === 'en');
          const description = descriptionArray.length > 0 ? descriptionArray[0].flavor_text : 'Descrição não disponível.';

          msg.reply(`Nome: ${dadosPokemon.name}\nID: ${dadosPokemon.id}\nTipo(s): ${dadosPokemon.types.join(', ')}\nDescrição: ${description}`);

          client.sendMessage(msg.from, imagemPokemonUrl, { sendMediaAsSticker: true });
          console.log(`Figurinha enviada para ${msg.from}: Nome: ${dadosPokemon.name}`);

        } catch (erroImagem) {
          console.error('Erro ao obter a imagem do Pokémon:', erroImagem);
          msg.reply(`Nome: ${dadosPokemon.name}\nID: ${dadosPokemon.id}\nTipo(s): ${dadosPokemon.types.join(', ')}\nErro ao obter a imagem do Pokémon.`);
        }

      } catch (erro) {
        console.error(erro);
        msg.reply('Erro ao obter dados do Pokémon.');
      }
    } else {
      msg.reply('Por favor, forneça o nome do Pokémon após !poke.');
    }
  }

  else if (msg.from && contadorMensagens >= 20) {
    capturaAbilitada = true;
    contadorMensagens = 0;

    const idPokemonAleatorio = getIdPokemonAleatorio();
    const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemonAleatorio}.png`;

    const imagemUrlPassada = await MessageMedia.fromUrl(imagemUrl)

    try {
      await chat.sendMessage(imagemUrlPassada, { sendMediaAsSticker: true });
      console.log(`Pokemon spawnado com o ID: ${idPokemonAleatorio}`);

      ultimoPokemonSpawnado = await getNomePokemon(idPokemonAleatorio);

    } catch (erro) {
      console.error('Erro ao pegar a imagem do pokemon:', erro);
      await chat.sendMessage('Erro enquanto pegava a imagem do pokemon.');
    }
  }

  else if (comando.startsWith('!pegar') && captureEnabled) {
    const comandoInteiro = comando.split(' ');
    if (comandoInteiro.length < 2) {
      await chat.sendMessage('Você precisa especificar o nome do Pokémon que deseja capturar.');
      return;
    }
    const contato = await msg.getContact();

    const pokemonACapturar = comandoInteiro.slice(1).join(' ');
    const userId = (await msg.getContact()).id._serialized;
    const groupId = (await msg.getChat()).id._serialized;

    if (pokemonCapturavel(pokemonACapturar, ultimoPokemonSpawnado)) {
      const jaCapturado = await checaSePokemonCapturado(userId, groupId, ultimoPokemonSpawnado);

      if (!jaCapturado) {
        salvaPokemonCapturado(userId, groupId, ultimoPokemonSpawnado);
        await chat.sendMessage(`Parabéns, @${contato.number}! Você capturou ${ultimoPokemonSpawnado}!`, { mentions: [contato] });
        msg.react('🎉')
        capturaAbilitada = false
      } else {
        await chat.sendMessage(`Você já capturou ${ultimoPokemonSpawnado} anteriormente.`);
      }
    } else {
      await chat.sendMessage(`O nome do Pokémon que você tentou capturar não corresponde ao último Pokémon spawnado.`);
    }
  }

  else if (comando === '!pokedex') {
    const userId = (await msg.getContact()).id._serialized;
    const groupId = (await msg.getChat()).id._serialized;

    const usuarioPokedex = await getPokedex(userId, groupId);
    const contato = await msg.getContact();

    if (usuarioPokedex.length > 0) {
      await chat.sendMessage(`Oi @${contato.number}!\nPokémon(s) na sua Pokedex:\n- ${usuarioPokedex.join('\n- ')}\n\nVocê tem ${usuarioPokedex.length} Pokemon(s)`, { mentions: [contato] });
    } else {
      await chat.sendMessage('Sua Pokedex está vazia. Capture mais Pokémon!');
    }
  }

  else if (comando === '!noticias') {
    const bitly = new BitlyClient(chaveBitLy);
    try {
      const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=br&apiKey=${chaveApiNoticias}`;

      const retorno = await axios.get(newsApiUrl);
      const artigos = retorno.data.articles.slice(0, 5); // Apenas os 5 primeiros artigos

      if (artigos.length > 0) {
        const noticias = await Promise.all(artigos.map(async (article) => {
          // Encurta o link
          const urlEncurtado = await bitly.shorten(article.url).then((response) => response.link);
          return `*${article.title}*\n${urlEncurtado}`;
        }));

        const topNews = noticias.join('\n\n');
        await chat.sendMessage(`📰 Últimas notícias:\n${topNews}`);
      } else {
        await chat.sendMessage('Desculpe, não foi possível recuperar as notícias no momento.');
      }
    } catch (erro) {
      console.error('Erro ao obter notícias:', erro);
      await chat.sendMessage('Desculpe, ocorreu um erro ao recuperar as notícias.');
    }
  }

});

client.initialize();