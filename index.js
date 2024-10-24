const { Client, LocalAuth } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');
const express = require('express');

const comandos = require('./comandos');
const { spawnaPokemon, checaSeAbilitado, pokemonFugiu, chamaPokemon, enviaPokedex, getRank, getInsignia, pegaPokemon } = require('./modulos/pokemon_funcoes.js');
const { enviaChance, chamaTodos } = require('./modulos/funcoes.js');
const { chamaPin } = require('./modulos/pinterest.js');
const { traduz } = require('./modulos/traducao.js');

const qtdeSpawn = 270;
let contadorMensagens = qtdeSpawn - 20;

process.on('unhandledRejection', (erro) => {
    if (erro.message.includes("Erro de reação")) {
        console.log("Erro de reação tratado: ", erro.message);
    } else {
        console.log("Outro erro: ", erro);
    }
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox',
            "--disable-accelerated-2d-canvas",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-breakpad",
            "--disable-cache",
            "--disable-component-extensions-with-background-pages",
            "--disable-crash-reporter",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-hang-monitor",
            "--disable-ipc-flooding-protection",
            "--disable-mojo-local-storage",
            "--disable-notifications",
            "--disable-popup-blocking",
            "--disable-print-preview",
            "--disable-prompt-on-repost",
            "--disable-renderer-backgrounding",
            "--disable-software-rasterizer",
            "--ignore-certificate-errors",
            "--log-level=3",
            "--no-default-browser-check",
            "--no-first-run",
            "--no-sandbox",
            "--no-zygote",
            "--renderer-process-limit=100",
            "--enable-gpu-rasterization",
            "--enable-zero-copy",
        ]
    }
});

const app = express();
const PORT = 4000;

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

client.on('message', async msg => {
    contadorMensagens++;
    const chat = await msg.getChat();
    const comando = msg.body.toLowerCase();

    if (comandos[comando]) {
        await comandos[comando](msg, client, chat);

    } else if (comando.startsWith('!poke') && comando != '!pokedex') {
        chamaPokemon(msg, client);

    } else if (comando === '!pokedex') {
        enviaPokedex(msg, chat);

    } else if (comando.startsWith('!pegar') && checaSeAbilitado()) {
        pegaPokemon(msg, chat, comando);

    } else if (comando.startsWith('!pegar') && checaSeAbilitado() == false) {
        msg.reply('Não há nenhum pokémon para capturar.');

    } else if (comando.startsWith('!pin')) {
        chamaPin(msg, client);

    } else if (comando.startsWith('!todos')) {
        chamaTodos(msg, chat);

    } else if (comando.startsWith('!traduz') && comando != '!traduzir') {
        traduz(msg);

    } else if (comando.startsWith('!chance')) {
        enviaChance(msg);

    } else if (msg.from && contadorMensagens >= qtdeSpawn) {
        contadorMensagens = 0;
        spawnaPokemon(client, chat);

    } else if (checaSeAbilitado() && contadorMensagens >= qtdeSpawn - 40) {
        pokemonFugiu(client);
    }

    else if (comando === '!insignia') {
        getInsignia(msg, chat, client);
    }

    else if (comando === '!rank') {
        getRank(chat, msg);
    }

    else {
        if (!chat.isGroup) {
            const mensagem = 'Olá!\nCaso queira saber alguma função, digite !menu.';
            msg.reply(mensagem);
        }
    }
});

client.initialize();