const { chamaMenu } = require('./modulos/menu.js');
const { chamaTodos, listarMegas } = require('./modulos/funcoes.js');
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
const { mandaConselho } = require('./modulos/conselho.js');
const { euNunca } = require('./modulos/enquete.js');
const { traduzir } = require('./modulos/traducao.js');

const comandos = {
    '!menu': async (msg, client) => {
        chamaMenu(msg, client);
    },

    '!gato': async (msg) => {
        chamaGato(msg);
    },

    '!cachorro': async (msg) => {
        chamaCachorro(msg);
    },

    '!caraoucoroa': async (msg, client, chat) => {
        chamaMoeda(msg, chat, client);
    },

    '!figurinha': async (msg, client) => {
        if (!msg.hasMedia) {
            msg.reply('Por favor, envie uma foto junto com o comando !figurinha, para que eu transforme sua foto em figurinha.');

        } else {
            enviaFigurinha(msg, client);
        }
    },

    '!clima': async (msg, client) => {
        chamaClima(msg, client);
    },

    '!horario': async (msg) => {
        obterHorarios(msg);
    },

    '!cotacao': async (msg) => {
        cotacao(msg);
    },

    '!eununca': async (msg, client) => {
        euNunca(msg, client);
    },

    '!listar megas': async (msg) => {
        listarMegas(msg)
    },

    '!traduzir': async (msg) => {
        traduzir(msg);
    },

    '!anime-frase': async (msg) => {
        mandaFraseAnime(msg);
    },

    '!anime-fato': async (msg) => {
        mandaFatoAnime(msg);
    },

    '!conselho': async (msg) => {
        mandaConselho(msg);
    },

    '!covid': async (msg) => {
        mandaCovid(msg);
    },

    '!noticia': async (msg, client) => {
        chamaNoticias(msg, client);
    },

    '!cartaz': async (msg) => {
        chamaFilme(msg);
    },

    '!receita': async (msg, client) => {
        receitaAleatoria(msg, client);
    },

    '/cod_group': async (msg, client) => {
        client.sendMessage(`${process.env.MEU_TELEFONE}@c.us`, `Requisição para, pokemon: ${msg.from}`);
    },

};

module.exports = comandos;