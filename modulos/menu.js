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

    '*!anime-frase*\n'+
    '_-> Frase aleatória de um anime._\n\n'+

    '*!anime-fato*\n'+
    '_-> Curiosidades sobre animes._\n\n'+

    '*!conselho*\n'+
    '_-> Envia um conselho._\n\n'+

    '*!covid*\n'+
    '_-> Exibe dados atualizados sobre o Covid-19._\n\n'+

    '*!cotacao*\n'+
    '_-> Cotação de algumas moedas._\n\n'+

    '*!pin (palavra ou texto)*\n'+
    '_-> Manda uma imagem do pinterest._\n\n'+

    '*!traduz (texto)*\n'+
    '_-> Traduz o texto enviado._\n\n'+

    '*!eununca*\n'+
    '_-> Brincadeira do eu nunca._\n\n'+

    '*!traduzir*\n'+
    '_-> Traduz a imagem marcada._\n\n'+

    '*!poke _(ID ou nome)_*\n'+
    '_-> Envia informações sobre um pokémon._\n\n'+

    '*!noticia*\n'+
    '_-> Uma noticia atual._\n\n'+

    '*!receita*\n'+
    '_-> Receita alearória._\n\n'+

    '*!rank*\n'+
    '_-> Top 3 com mais pokemons do grupo._\n\n'+

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
