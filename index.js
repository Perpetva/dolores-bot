//*************************************** BOT FEITO POR PERPETVA ⚡ ********************************************//
const { Client, RemoteAuth, LocalAuth } = require('whatsapp-web.js');

//require('./modulos/server.js');

const { chamaMenu } = require('./modulos/menu.js');
const { chamaTodos } = require('./modulos/funcoes.js');
const { obterHorarios } = require('./modulos/horarios.js');
const { chamaFilme } = require('./modulos/filmes.js');
const { cotacao } = require('./modulos/cotacao.js');
const { receitaAleatoria } = require('./modulos/receitas.js');
const { chamaClima } = require('./modulos/clima.js');
const { chamaNoticias } = require('./modulos/noticias.js');
const { enviaFigurinha } = require('./modulos/figurinha.js');
const { chamaGato } = require('./modulos/gato.js');
const { chamaCachorro } = require('./modulos/cachorro.js');
const { chamaMoeda } = require('./modulos/moedas.js');
const { mandaBoaNoite, mandaAudio, mandaBoatarde, mandaBomDia } = require('./modulos/saudacoes.js');
const { chamaPokemon, enviaPokedex, spawnaPokemon, pegaPokemon, checaSeAbilitado } = require('./modulos/pokemon_funcoes.js');

const qrcode = require('qrcode-terminal');
const express = require('express');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
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
        args:
        ['--no-sandbox',
            "--disable-setuid-sandbox",
            "--log-level=3",
            "--no-default-browser-check",
            "--disable-site-isolation-trials",
            "--no-experiments",
            "--ignore-gpu-blacklist",
            "--ignore-certificate-errors",
            "--ignore-certificate-errors-spki-list",
            "--enable-gpu",
            "--disable-default-apps",
            "--enable-features=NetworkService",
            "--disable-webgl",
            "--disable-threaded-animation",
            "--disable-threaded-scrolling",
            "--disable-in-process-stack-traces",
            "--disable-histogram-customizer",
            "--disable-gl-extensions",
            "--disable-composited-antialiasing",
            "--disable-canvas-aa",
            "--disable-3d-apis",
            "--disable-accelerated-2d-canvas",
            "--disable-accelerated-jpeg-decoding",
            "--disable-accelerated-mjpeg-decode",
            "--disable-app-list-dismiss-on-blur",
            "--disable-accelerated-video-decode"
        ],
    },
      authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000,
      })
  });
});
// Fim da autenticação Remota 

let contadorMensagens = 0;

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
    chamaMenu(msg, client);
  }

  else if (comando === '!gato') {
    chamaGato(msg);
  }

  else if (comando === '!cachorro') {
    chamaCachorro(msg);
  }

  else if (comando === '!caraoucoroa') {
    chamaMoeda (msg, chat, client); 
  }

  else if(!msg.hasMedia && comando === '!figurinha') {
    msg.reply('Por favor, envie um foto junto com o comando !figurinha, para que eu transforme sua foto em figurinha.')
  }

  else if (msg.hasMedia && comando === '!figurinha') {
    enviaFigurinha(msg, client);
  }

  else if (comando === '!clima') {
    chamaClima(msg, client);
  }

  else if (comando === '!horario') {
    obterHorarios(msg);
  }

  else if (comando === '!todos') {
    chamaTodos(msg, chat);
  }

  else if (comando === '!cotacao') {
    cotacao(msg);
  }

  else if (comando.startsWith('!poke ')) {
    chamaPokemon(msg, client);
  }

  else if (msg.from && contadorMensagens >= 20) {
    contadorMensagens = 0;
    spawnaPokemon(client, chat);
  }

  else if (comando.startsWith('!pegar') && checaSeAbilitado()) {
    pegaPokemon(msg, chat, comando);
  }

  else if (comando.startsWith('!pegar') && checaSeAbilitado() == false) {
    mandaAudio('./modulos/saudacoes_audios/nenhum_pokemon.mp3', msg, client, '🫥');
}

  else if (comando === '!pokedex') {
    enviaPokedex(msg, chat);
  }

  else if (comando === '!noticias') {
    chamaNoticias(msg, client);
  }

  else if (comando === '!cartaz') {
    chamaFilme(msg);
  }

  else if(comando === '!receita') {
    receitaAleatoria(msg);
  }

  else if (comando.includes('boa noite')) {
    mandaBoaNoite(msg, client);
  }

  else if (comando.includes('boa tarde')) {
    mandaBoatarde(msg, client);
  }

  else if (comando.includes('bom dia')) {
    mandaBomDia(msg, client);
  }

  else {
    if(!chat.isGroup) {
        const mensagem = 'Olá!\nCaso queria saber alguma função digite !menu.'
        client.sendMessage(msg.from, mensagem)
    }
  }
  
});

client.initialize();