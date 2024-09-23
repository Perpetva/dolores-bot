const { Client, LocalAuth } = require('whatsapp-web.js');

/* 
//const { MongoStore } = require('wwebjs-mongo');
//const mongoose = require('mongoose');
*/

const { chamaMenu } = require('./modulos/menu.js');
const { chamaTodos, enviaChance, listarMegas } = require('./modulos/funcoes.js');
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
const { mandaCovid } = require('./modulos/covid.js');
const { mandaFraseAnime, mandaFatoAnime } = require('./modulos/anime.js');
const { chamaPin } = require('./modulos/pinterest.js');
const { traduz, traduzir } = require('./modulos/traducao.js');
const { mandaConselho } = require('./modulos/conselho.js')
// const { mandaBoaNoite, mandaBoatarde, mandaBomDia } = require('./modulos/saudacoes.js');
const { chamaPokemon, enviaPokedex, spawnaPokemon, pegaPokemon, checaSeAbilitado, getRank, pokemonFugiu, getInsignia } = require('./modulos/pokemon_funcoes.js');

const qrcode = require('qrcode-terminal');
const express = require('express');

const qtdeSpawn = 270;
let contadorMensagens = 265//qtdeSpawn / 2;
const chamados = ['.bot', '/bot', '/menu', '.menu', 'bot'];

process.on('unhandledRejection', (error) => {
    if (error.message && error.message.includes("Reaction send error")) {
        console.error("Erro de reação tratado:", error.message);
    } else {
        console.error("Erro não tratado:", error);
    }
});

/*
const MONGO_DB_URI = process.env.MONGODB_URI;

Conexão com o MongoDB
 mongoose.connect(MONGO_DB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
     const client = new Client({
         puppeteer: {
            headless: true,
            args:
                ['--no-sandbox'],
         },
         authStrategy: new RemoteAuth({
                store: store,
                backupSyncIntervalMs: 300000,
         })
     });
*/

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

client.once('ready', () => {
    console.log('Pronto!');
    client.clearMessagesCache();
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('remote_session_saved', () => {
    console.log('Sessão Salva');
});

client.on('message', async msg => {
    contadorMensagens++;

    const chat = await msg.getChat();
    const comando = msg.body.toLowerCase();

    //console.log('MENSAGEM RECEBIDA:', msg);


    if (comando === '!menu') {
        chamaMenu(msg, client);
        chat.clearMessages();
    }

    else if (comando === '!gato') {
        chamaGato(msg);
    }

    else if (comando === '!cachorro') {
        chamaCachorro(msg);
    }

    else if (comando === '!caraoucoroa') {
        chamaMoeda(msg, chat, client);
    }

    else if (!msg.hasMedia && comando === '!figurinha') {
        msg.reply('Por favor, envie um foto junto com o comando !figurinha, para que eu transforme sua foto em figurinha.');
    }

    else if (msg.hasMedia && comando === '!figurinha') {
        enviaFigurinha(msg, client);
    }

    else if (comando === '!clima') {
        chamaClima(msg, client);
        chat.clearMessages();
    }

    else if (comando === '!horario') {
        obterHorarios(msg);
    }

    else if (comando === '!todos') {
        chamaTodos(msg, chat);
        chat.clearMessages();
    }

    else if (comando === '!cotacao') {
        cotacao(msg);
    }

    else if (comando.startsWith('!poke') && comando != '!pokedex') {
        chamaPokemon(msg, client);

    }

    else if (msg.from && contadorMensagens >= qtdeSpawn) {
        contadorMensagens = 0;
        spawnaPokemon(client, chat);
    }

    else if (comando.startsWith('!pegar') && checaSeAbilitado()) {
        pegaPokemon(msg, chat, comando);
    }

    else if (comando.startsWith('!pegar') && checaSeAbilitado() == false) {
        msg.reply('Não há nenhum pokémon para capturar.');
    }

    else if (checaSeAbilitado() && contadorMensagens >= qtdeSpawn - 40) {
        pokemonFugiu(client);
    }

    else if (comando === '!pokedex') {
        enviaPokedex(msg, chat);
    }

    else if (comando.startsWith('!pin')) {
        chamaPin(msg, client)
    }

    else if (comando.startsWith('!traduz') && comando != '!traduzir') {
        traduz(msg);
    }

    else if (comando === '!traduzir') {
        traduzir(msg);
    }

    else if (comando === '!noticias') {
        chamaNoticias(msg, client);
    }

    else if (comando === '!cartaz') {
        chamaFilme(msg);
    }

    else if (comando === '!receita') {
        receitaAleatoria(msg);
    }
    /*
        else if (comando.includes('boa noite')) {
            mandaBoaNoite(msg, client);
        }
    
        else if (comando.includes('boa tarde')) {
            mandaBoatarde(msg, client);
        }
    
        else if (comando.includes('bom dia')) {
            mandaBomDia(msg, client);
        }
    */
    else if (comando === '!rank') {
        getRank(chat, msg);
    }

    else if (comando.startsWith('!chance')) {
        enviaChance(msg);
        chat.clearMessages();
    }

    else if (comando === '!listar megas') {
        listarMegas(msg);
    }

    else if (comando === '!insignia') {
        getInsignia(msg, chat, client);
    }

    else if (chamados.includes(comando)) {
//        msg.reply('Para ver os comandos digite !menu.');
        chat.clearMessages();
    }

    else if (comando === '/cod_group') {
        client.sendMessage(`${process.env.MEU_TELEFONE}@c.us`, `Requisição para, pokemon: ${msg.from}`);
    }

    else if (comando === '!anime-frase') {
        mandaFraseAnime(msg)
    }

    else if (comando === '!anime-fato') {
        mandaFatoAnime(msg)
    }

    else if (comando === '!conselho') {
        mandaConselho(msg)
    }

    else if (comando === '!covid') {
        mandaCovid(msg);
    }

    else {
        if (!chat.isGroup) {
            const mensagem = 'Olá!\nCaso queria saber alguma função digite !menu.'
            client.sendMessage(msg.from, mensagem);
        }
    }
});

client.initialize();