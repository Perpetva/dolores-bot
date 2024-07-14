const { mandaAudio } = require('./saudacoes.js');

function chamaMenu (msg, client) {
    const mensagemMenu = (

    'Oi muito prazer! 😎 Eu sou a Dolores!\n'+
    'Abaixo comandos para ajuda 😇\n\n'+

    '--------------------\n\n'+
    
    '*!figurinha*\n'+
    '_-> Transforma foto em figurinha._\n\n'+

    '*!clima*\n'+
    '_-> Clima atual de São Paulo._\n\n'+

    '*!cartaz*\n'+
    '_-> Filmes em cartaz no cinema._\n\n'+

    '*!todos*\n'+
    '_-> Marca todos em um grupo._\n\n'+

    '*!gato*\n'+
    '_-> Foto aleatória de um gato_\n\n'+

    '*!cachorro*\n'+
    '_-> Foto aleatória de um cachorro_\n\n'+

    '*!caraoucoroa*\n'+
    '_-> Gira uma moeda para cair em cara ou coroa_\n\n'+

    '*!horario*\n'+
    '_-> O horário em alguns lugares do mundo._\n\n'+

    '*!cotacao*\n'+
    '_-> Cotação de algumas moedas._\n\n'+

    '*!poke _(ID ou nome)_*\n'+
    '_-> Cotação de algumas moedas._\n\n'+

    '*!noticias*\n'+
    '_-> 5 noticias atuais._\n\n'+

    '*!receita*\n'+
    '_-> Receita alearória._\n\n'+

    '--------------------\n\n'+

    'Periodicamente mandarei pokemons aleatórios, para pegar digite:\n'+
    '*!pegar <_nome do pokemom_>*\n\n'+


    'Para ver seus pokemons capturados, digite o comando:\n'+
    '*!pokedex*'

    );

    mandaAudio('./saudacoes_audios/menu.mp3', msg, client, '📄');
    client.sendMessage(msg.from, mensagemMenu);
};

module.exports = { chamaMenu }