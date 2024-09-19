const { isAxiosError } = require('axios');
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
    '_-> Foto aleatória de um gato._\n\n'+

    '*!cachorro*\n'+
    '_-> Foto aleatória de um cachorro._\n\n'+

    '*!caraoucoroa*\n'+
    '_-> Gira uma moeda para cair em cara ou coroa._\n\n'+

    '*!chance _(texto)_*\n'+
    '_-> Calcula a chance de algo acontecer._\n\n'+

    '*!listar megas*\n'+
    '_-> Lista de pokémons mega pra ver com o !poke._\n\n'+

    '*!insignia*\n'+
    '_-> Qual tipo de pokémon você mais tem?._\n\n'+

    '*!horario*\n'+
    '_-> O horário em alguns lugares do mundo._\n\n'+

    '*!cotacao*\n'+
    '_-> Cotação de algumas moedas._\n\n'+

    '*!poke _(ID ou nome)_*\n'+
    '_-> Envia informações sobre um pokémon._\n\n'+

    '*!noticias*\n'+
    '_-> 5 noticias atuais._\n\n'+

    '*!receita*\n'+
    '_-> Receita alearória._\n\n'+

    '*!rank*\n'+
    '_-> Top 3 com mais pokemons._\n\n'+

    '--------------------\n\n'+

    'Periodicamente mandarei pokemons aleatórios, para pegar digite:\n'+
    '*!pegar <_nome do pokemom_>*\n'+
    '(para habilitar o spawn de pokémons no seu grupo, chame o ADM)\n\n'+
    
    'Para ver seus pokemons capturados, digite o comando:\n'+
    '*!pokedex*'

    );

    mandaAudio('./saudacoes_audios/menu.mp3', msg, client, '📄');
    client.sendMessage(msg.from, mensagemMenu);
};

module.exports = { chamaMenu }


if (isAxiosError()) {
    console.log('erro')
}