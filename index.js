//*************************************** BOT FEITO POR PERPETVA ⚡ ********************************************//
const { Client, RemoteAuth, MessageMedia, LocalAuth } = require('whatsapp-web.js');

require('./modulos/server.js');

const mensagemMenu = require('./modulos/menu.js');
const linksGato = require('./modulos/gato.js');
const linksCachorro = require('./modulos/cachorro.js');
const linksMoedas = require('./modulos/moedas.js');

const { numeroAleatorio, chamaTodos } = require('./modulos/funcoes.js');
const { obterHorarios } = require('./modulos/horarios.js');
const { chamaFilme } = require('./modulos/filmes.js');
const { cotacao } = require('./modulos/cotacao.js');
const { receitaAleatoria } = require('./modulos/receitas.js');
const { chamaClima } = require('./modulos/clima.js');
const { chamaNoticias } = require('./modulos/noticias.js');
const { enviaFigurinha } = require('./modulos/figurinha.js');

const qrcode = require('qrcode-terminal');
const express = require('express');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const { pokemonCapturavel, getNomePokemon, getPokedex, salvaPokemonCapturado, checaSePokemonCapturado, getIdPokemonAleatorio } = require('./modulos/poke_functions.js');
//-------------------------------------------------------------------

// Autenticação Local
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  }
});
// Fim da autenticação Local 
//-------
// Autenticação Remota
const MONGODB_URI = 'SEU CLUSTER MONGODB AQUI'

mongoose.connect(MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
      puppeteer: {
          headless: true,
          args: ['--no-sandbox'],
      },
      authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000,
      })
  });
});
// Fim da autenticação Remota 

let ultimoPokemonSpawnado = '';
let contadorMensagens = 0;
let capturaAbilitada = true;

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

client.once('ready', () => {
    console.log('Pronto!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('remote_session_saved', () => {
    console.log('Sessão Salva');
});

///////////////////////// FUNÇÕES //////////////////////////////
client.on('message', async msg => {
  contadorMensagens++

  const chat = await msg.getChat();
  const comando = msg.body.toLowerCase();

  // console.log('MENSAGEM RECEBIDA:', msg); DESCOMENTE PARA RECEBER AS MENSAGENS NO CONSOLE

  if (comando === '!menu') {
    msg.react('🇧🇷')
    msg.reply(mensagemMenu);
  }

  else if (comando === '!gato') {
    try {
      const media = await MessageMedia.fromUrl(linksGato[numeroAleatorio(0, (linksGato.length - 1))]);
      msg.reply(media)
    } catch (erro) {
      console.log('Erro ao mandar a foto do gato.', erro);
      msg.reply('Não consegui mandar foto do gato.');
    }  
  }

  else if (comando === '!cachorro') {
    try {
      const media = await MessageMedia.fromUrl(linksCachorro[numeroAleatorio(0, (linksCachorro.length - 1))]);
      msg.reply(media)
    } catch (erro) {
      console.log('Erro ao mandar a foto do cachorro.', erro);
      msg.reply('Não consegui mandar foto do cachorro.');
    }
  }

  else if (comando === '!caraoucoroa') {
    const media = await MessageMedia.fromUrl(linksMoedas[numeroAleatorio(0, (linksMoedas.length - 1))]);
    msg.reply('..._Girando a Moeda_...')
    chat.sendStateTyping()

    const atraso = 2000
    setTimeout(() => {
      client.sendMessage(msg.from, media, { sendMediaAsSticker: true })
    }, atraso);
  }

  else if(!msg.hasMedia && comando === '!figurinha') {
    msg.reply('Por favor, envie um foto junto com o comando !figurinha, para que eu transforme sua foto em figurinha.')
  }

  else if (msg.hasMedia && comando === '!figurinha') {
    enviaFigurinha(msg, client);
  }

  else if (comando === '!clima') {
    chamaClima(msg);
  }

  else if (comando === '!horario') {
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
    chamaTodos (msg, chat);
  }

  else if (comando === '!cotacao') {
    msg.reply(await cotacao());
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
    const meuTelefone = 'SEU NÚMERO DE TELEFONE'

    const idPokemonAleatorio = getIdPokemonAleatorio();
    const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemonAleatorio}.png`;

    const imagemUrlPassada = await MessageMedia.fromUrl(imagemUrl)

    try {
        await chat.sendMessage(imagemUrlPassada, { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" });
        console.log(`Pokemon spawnado com o ID: ${idPokemonAleatorio}`);

        ultimoPokemonSpawnado = await getNomePokemon(idPokemonAleatorio);
        client.sendMessage(`${meuTelefone}@c.us`, ultimoPokemonSpawnado);

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
    chamaNoticias(msg);
  }

  else if (comando === '!cartaz') {
    msg.reply(await chamaFilme());
  }

  else if(comando === '!receita') {
    msg.reply(await receitaAleatoria());
  }

  else {
    if(!chat.isGroup) {
        const mensagem = 'Olá!\nCaso queria saber alguma função digite !menu.'
        client.sendMessage(msg.from, mensagem)
    }
  }
  
});

client.initialize();