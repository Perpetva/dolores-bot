const fs = require('fs');
const path = require('path');

function numeroAleatorio(quantidade, numero) {
    return Math.floor(Math.random() * quantidade) + numero;
}

async function chamaTodos (msg, chat) {
    if (chat.isGroup) {
        let text = '';
        let mentions = [];
        const contato = await msg.getContact();

        for (let participant of chat.participants) {
            let participante = participant.id.user;

            if (participant.isAdmin && participante == contato.number) {
                for (let participant of chat.participants) {
                    mentions.push(`${participant.id.user}@c.us`);
                    text += `@${participant.id.user}\n`;
                }

                await chat.sendMessage('*--Marcando todos--*\n' + text, { mentions });
            } 
        }

        if(text == '') {
            msg.reply('Somente adms podem marcar todos em um grupo.')
        }

    } else {
        msg.reply("Esse comando só funciona em grupos.");
    }
}

function enviaChance (msg) {
    const mensagemRecebida = msg.body.toLowerCase();
    const mensagemInteira = mensagemRecebida.split('!')[1]

    const iChance = msg.body.split(' ')[0];
    if (iChance != '!chance'.toLowerCase()){
        msg.reply('Você quis dizer !chance?');
        return;
    }

    if (!mensagemRecebida.split(' ')[1]) {
        msg.reply('Digite algo após !chance');
        return
    }

    const chance = numeroAleatorio(100, 0);

    const mandaChance = `A ${mensagemInteira}\n\né de... ${chance}% ${emogiChama()}`;

    function emogiChama () {
        if (chance <= 100 && chance >= 76) {
            return '🤑'
        } else if (chance <= 75 && chance >= 51) {
            return '😝'
        } else if (chance <= 50 && chance >= 26) {
            return '😬'
        } else {
            return '😵'
        }
    } 

    msg.reply(mandaChance)
}

function listarMegas (msg) {
    const arquivoPath = path.join(__dirname, '..', 'lista-pokemon-comandos.txt');
    
    try {
        const arquivo = fs.readFileSync(arquivoPath, 'utf8');
        msg.reply(`Abaixo a lista de pokémons mega pra ver com o !poke.\n\n${arquivo}`);
    } catch (erro) {
        console.log('Erro ao ler o arquivo:', erro);
    }
}


module.exports = { numeroAleatorio, chamaTodos, enviaChance, listarMegas }