const moment = require('moment-timezone');

function obterHorarios(msg) {

    const lugares = [
        { nome: 'Nova York', fuso: 'America/New_York' },
        { nome: 'Londres', fuso: 'Europe/London' },
        { nome: 'Tóquio', fuso: 'Asia/Tokyo' },
        { nome: 'Polo Sul', fuso: 'Antarctica/South_Pole' },
        { nome: 'Sidney', fuso: 'Australia/Sydney' },
        { nome: 'Egito', fuso: 'Egypt' },
        { nome: 'Moscow', fuso: 'Europe/Moscow' },
        { nome: 'Paris', fuso: 'Europe/Paris' },
        { nome: 'Jamaica', fuso: 'Jamaica' },
        { nome: 'Singapura', fuso: 'Singapore' }
    ];

    const horarios = lugares.map((lugar) => {
        const horaAtual = moment().tz(lugar.fuso).format('HH:mm');
        return `${lugar.nome}: ${horaAtual}`;
    });
    const envia = `Horario atual em varios lugares do mundo! 🕑\n\n${horarios.join('\n')}`

    msg.reply(envia)
}

module.exports = { obterHorarios }