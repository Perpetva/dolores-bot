const { Poll } = require('whatsapp-web.js');
const { numeroAleatorio } = require('./funcoes');

const perguntas = [
    "Eu nunca menti para meus pais sobre onde estava.",
    "Eu nunca fiz xixi na piscina.",
    "Eu nunca traí meu parceiro.",
    "Eu nunca roubei algo de uma loja.",
    "Eu nunca beijei alguém do mesmo sexo.",
    "Eu nunca pulei uma cerca para entrar em uma festa.",
    "Eu nunca fui preso.",
    "Eu nunca experimentei drogas ilegais.",
    "Eu nunca fiquei acordado a noite toda.",
    "Eu nunca bebi tanto que vomitei.",
    "Eu nunca menti para meus pais sobre com quem eu estava.",
    "Eu nunca contei um segredo de um amigo para outra pessoa.",
    "Eu nunca joguei jogos de azar com dinheiro real.",
    "Eu nunca fui expulso da escola.",
    "Eu nunca quebrei um osso enquanto estava bêbado.",
    "Eu nunca fui para a cama com alguém que acabara de conhecer.",
    "Eu nunca menti no meu currículo para conseguir um emprego.",
    "Eu nunca acordei em um lugar estranho sem saber como cheguei lá.",
    "Eu nunca causei um acidente de carro.",
    "Eu nunca disse 'eu te amo' apenas para conseguir algo que queria.",
    "Eu nunca fiz xixi na rua enquanto estava bêbado.",
    "Eu nunca passei um dia inteiro assistindo TV.",
    "Eu nunca mandei uma mensagem para o(a) ex depois de um tempo sem se falar.",
    "Eu nunca dei em cima do parceiro(a) de um amigo.",
    "Eu nunca passei a noite inteira em um bar.",
    "Eu nunca fui pego(a) roubando.",
    "Eu nunca fui a um encontro às cegas.",
    "Eu nunca menti sobre minha idade para entrar em um lugar.",
    "Eu nunca fui preso(a) por estar bêbado(a) em público.",
    "Eu nunca beijei alguém para me vingar.",
    "Eu nunca tirei uma foto nua de mim mesmo(a).",
    "Eu nunca usei o nome de outra pessoa para conseguir uma reserva em um restaurante.",
    "Eu nunca contei uma mentira em um tribunal.",
    "Eu nunca tive um relacionamento com alguém só por interesse financeiro.",
    "Eu nunca fingi estar doente para sair de um compromisso.",
    "Eu nunca fui em um encontro com alguém que era comprometido com outra pessoa.",
    "Eu nunca bati em alguém durante uma briga.",
    "Eu nunca fiz uma tatuagem que me arrependi depois.",
    "Eu nunca fui pego(a) fazendo algo ilegal.",
    "Eu nunca traí um amigo.",
    "Eu nunca roubei algo do trabalho.",
    "Eu nunca enviei uma mensagem de texto enquanto dirigia.",
    "Eu nunca usei drogas no trabalho.",
    "Eu nunca beijei alguém enquanto estava em um relacionamento sério.",
    "Eu nunca fui suspenso(a) da escola.",
    "Eu nunca fui a um show sem ingresso.",
    "Eu nunca menti sobre minha identidade na internet.",
    "Eu nunca fiquei com alguém só por pena.",
    "Eu nunca participei de uma briga de rua.",
    "Eu nunca me masturbei no trabalho."
];

async function euNunca(msg, client) {
    try {
        let aleatorio = await numeroAleatorio(perguntas.length, 0);
        const enquete = new Poll(perguntas[aleatorio], ['Eu nunca 🌝', 'Eu já 🌚']);
        client.sendMessage(msg.from, enquete);

    } catch (erro) {
        console.log('Erro na Poll', erro);
        msg.reply('Não foi possível enviar a enquete ;(, tente novamente.');
    }
}

module.exports = { euNunca }