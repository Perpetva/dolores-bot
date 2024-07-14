require('./server.js');
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const { getNomePokemon, getPokedex, salvaPokemonCapturado, checaSePokemonCapturado } = require('./pokedex_funcoes.js');
const { numeroAleatorio } = require('./funcoes');

let capturaAbilitada = false;
let ultimoPokemonSpawnado = '';

async function chamaPokemon (msg, client) {
    const nomePokemon = msg.body.split(' ')[1];
    if (nomePokemon) {
        try {
            const retorno = await axios.get(`http://localhost:3000/pokemon/${nomePokemon}`);
            const dadosPokemon = retorno.data;

            try {
                const imagemPokemonUrl = await MessageMedia.fromUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dadosPokemon.id}.png`)
                const mensagem = `Nome: ${dadosPokemon.name}\nID: ${dadosPokemon.id}\nTipo(s): ${dadosPokemon.types.join(', ')}`

                client.sendMessage(msg.from, mensagem);
                client.sendMessage(msg.from, imagemPokemonUrl, { sendMediaAsSticker: true });

            } catch (erroImagem) {
                console.log('Erro ao obter a imagem do Pokémon:', erroImagem);
                msg.reply(`Nome: ${dadosPokemon.name}\nID: ${dadosPokemon.id}\nTipo(s): ${dadosPokemon.types.join(', ')}\nErro ao obter a imagem do Pokémon.`);
            }

        } catch (erro) {
            console.error(erro);
            msg.reply('Erro ao obter dados do Pokémon.');
        }

    } else {
        msg.reply('Por favor, forneça o nome do Pokémon após !poke.');
    }
}

async function enviaPokedex (msg, chat) {
    try {
        const contato = await msg.getContact();

        const idUsuario = (contato).id._serialized;
        const idGrupo = (chat).id._serialized;
        const usuarioPokedex = await getPokedex(idUsuario, idGrupo);

        if (usuarioPokedex.length > 0) {
            await chat.sendMessage(`Oi @${contato.number}!\nPokémon(s) na sua Pokedex:\n- ${usuarioPokedex.join('\n- ')}\n\nVocê tem ${usuarioPokedex.length} Pokemon(s)`, { mentions: [contato] });
        } else {
            await chat.sendMessage('Sua Pokedex está vazia. Capture mais Pokémon!');
        }
    } catch (erro) {
        console.log('Não consegui mandar a pokedex.');
    }
}

async function spawnaPokemon (client, chat) {
    capturaAbilitada = true;
    const meuTelefone = 'SEU TELEFONE'

    const idPokemonAleatorio = numeroAleatorio(1025, 1);
    const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemonAleatorio}.png`;

    const imagemUrlPassada = await MessageMedia.fromUrl(imagemUrl);

    try {
        await chat.sendMessage(imagemUrlPassada, { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" });
        await chat.sendMessage('_Um pokemon foi apareceu!!! Para pegar digite "!pegar <nome do pokemon>"_');

        ultimoPokemonSpawnado = await getNomePokemon(idPokemonAleatorio);
        client.sendMessage(`${meuTelefone}@c.us`, ultimoPokemonSpawnado);

    } catch (erro) {
        console.error('Erro ao pegar a imagem do pokemon:', erro);
        await chat.sendMessage('Erro enquanto pegava a imagem do pokemon.');
    }
}

async function pegaPokemon (msg, chat, comando) {
    const comandoInteiro = comando.split(' ');
    if (comandoInteiro.length < 2) {
        await chat.sendMessage('Você precisa especificar o nome do Pokémon que deseja capturar.');
        return;
    }

    try {
        const contato = await msg.getContact();

        const pokemonACapturar = comandoInteiro.slice(1).join(' ');
        const idUsuario = (contato).id._serialized;
        const idGrupo = (chat).id._serialized;

    if (pokemonACapturar.toLowerCase() === ultimoPokemonSpawnado.toLowerCase()) {
        const jaCapturado = await checaSePokemonCapturado(idUsuario, idGrupo, ultimoPokemonSpawnado);

        if (!jaCapturado) {
            salvaPokemonCapturado(idUsuario, idGrupo, ultimoPokemonSpawnado);
            await chat.sendMessage(`Parabéns, @${contato.number}! Você capturou ${ultimoPokemonSpawnado}!`, { mentions: [contato] });
            msg.react('🎉');
            capturaAbilitada = false
        } else {
            await chat.sendMessage(`Você já capturou ${ultimoPokemonSpawnado} anteriormente.`);
        }
    } else {
        await chat.sendMessage(`O nome do Pokémon que você tentou capturar não corresponde ao último Pokémon spawnado.`);
    }
    } catch (erro) {
        console.log('erro:', erro)
    }
}

function checaSeAbilitado () {
    if (capturaAbilitada) {
        return true
    } else {
        return false
    }
}

module.exports = { chamaPokemon, enviaPokedex, spawnaPokemon, pegaPokemon, checaSeAbilitado }