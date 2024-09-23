require('./server.js');
require('dotenv').config();
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const { getNomePokemon, getPokedex, salvaPokemonCapturado, checaSePokemonCapturado } = require('./pokedex_funcoes.js');
const { numeroAleatorio } = require('./funcoes');
const { traduzDescricao } = require('./traducao.js');

let capturaAbilitada = false;
let ultimoPokemonSpawnado = '';
let grupoSelecionado = '';
const cooldowns = {};

async function chamaPokemon(msg, client) {
    const ipoke = msg.body.split(' ')[0];
    if (ipoke != '!poke'.toLowerCase()) {
        msg.reply('Você quis dizer !poke?');
        return;
    }

    const nomePokemon = msg.body.split(' ')[1];

    let dadosPokemon;
    let retornoEspecies;

    if (nomePokemon) {
        try {
            const retorno = await axios.get(`http://localhost:3000/pokemon/${nomePokemon.toLowerCase()}`);
            dadosPokemon = retorno.data;
            retornoEspecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${dadosPokemon.id}`);

        } catch (erro) {
            console.log('Erro em chamar o pokemon.');
            if (erro == axios.AxiosError) {
                msg.reply('Você digitou um ID ou nome do pokémon errado.');
            }
        }

        try {
            let descricaoTraduzida = 'Sem descrição.';
            if (retornoEspecies) {
                const descricaoArray = retornoEspecies.data.flavor_text_entries.filter(entry => entry.language.name === 'en');
                const descricao = descricaoArray.length > 0 ? descricaoArray[0].flavor_text.replace(/\n/g, ' ') : 'Descrição não disponível.';
                descricaoTraduzida = await traduzDescricao(descricao);
            }

            const tiposTraduzidos = traduzTiposDominantes(dadosPokemon.types)
            const imagemPokemonUrl = await MessageMedia.fromUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dadosPokemon.id}.png`)

            const mensagem = `Nome: ${dadosPokemon.name}\nID: ${dadosPokemon.id}\nTipo(s): ${tiposTraduzidos}\nGeração: ${verificaAGeracao(dadosPokemon.id)}\nDescrição: ${descricaoTraduzida}`

            await client.sendMessage(msg.from, mensagem);
            await client.sendMessage(msg.from, imagemPokemonUrl, { sendMediaAsSticker: true });

        } catch (erroImagem) {
            console.log('Erro ao obter a imagem do Pokémon.');
            await client.sendMessage(msg.from, `Erro ao obter a imagem do Pokémon.`);
        }

    } else {
        msg.reply('Por favor, forneça o nome ou ID do Pokémon após !poke.');
    }
}

async function enviaPokedex(msg, chat) {
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

async function spawnaPokemon(client, chat) {
    capturaAbilitada = true;
    const meuTelefone = process.env.MEU_TELEFONE

    const listaGrupos = process.env.LISTA_GRUPOS.split(',');

    const idPokemonAleatorio = await numeroAleatorio(494, 1);
    const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemonAleatorio}.png`;
    const imagemUrlPassada = await MessageMedia.fromUrl(imagemUrl);

    try {
        grupoSelecionado = listaGrupos[numeroAleatorio(listaGrupos.length, 0)]

        await client.sendMessage(grupoSelecionado, imagemUrlPassada, { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" });

        ultimoPokemonSpawnado = await getNomePokemon(idPokemonAleatorio);
        client.sendMessage(`${meuTelefone}@c.us`, ultimoPokemonSpawnado);

    } catch (erro) {
        console.error('Erro ao pegar a imagem do pokemon:', erro);
        await chat.sendMessage('Erro enquanto pegava a imagem do pokemon.');
    }
}

function pokemonFugiu(client) {
    capturaAbilitada = false;
    const mensagem = `💨 O pokémon ${ultimoPokemonSpawnado} fugiu 💨`

    client.sendMessage(grupoSelecionado, mensagem);
}

async function pegaPokemon(msg, chat, comando) {
    const comandoInteiro = comando.split(' ');
    if (comandoInteiro.length < 2) {
        await chat.sendMessage('Você precisa especificar o nome do Pokémon que deseja capturar.');
        return;
    }

    try {
        const contato = await msg.getContact();
        const idUsuario = contato.id._serialized;

        const agora = Date.now();
        const cooldownTempo = 60000;

        if (cooldowns[idUsuario] && agora - cooldowns[idUsuario] < cooldownTempo) {
            const tempoRestante = Math.ceil((cooldownTempo - (agora - cooldowns[idUsuario])) / 1000);
            await chat.sendMessage(`Espere ${tempoRestante} segundos para tentar capturar ${ultimoPokemonSpawnado} novamente.`);
            return;
        }

        const pokemonACapturar = comandoInteiro.slice(1).join(' ');
        const chanceDeCapturar = numeroAleatorio(100, 0);

        if (pokemonACapturar.toLowerCase() === ultimoPokemonSpawnado.toLowerCase()) {
            const jaCapturado = await checaSePokemonCapturado(idUsuario, chat.id._serialized, ultimoPokemonSpawnado);

            if (!jaCapturado) {
                if (chanceDeCapturar <= 50) {
                    msg.reply(`◓ _O Pokémon *${ultimoPokemonSpawnado}* escapou da pokébola_ ◓`);

                    const chanceDeFugir = numeroAleatorio(100, 0);
                    if (chanceDeFugir <= 10) {
                        capturaAbilitada = false;
                        const mensagem = `_💨 O pokémon ${ultimoPokemonSpawnado} fugiu 💨_`;
                        setTimeout(async () => {
                            await chat.sendMessage(mensagem);
                        }, 1000);
                    }

                    cooldowns[idUsuario] = agora;
                    return;
                }

                salvaPokemonCapturado(idUsuario, chat.id._serialized, ultimoPokemonSpawnado);
                await chat.sendMessage(`Parabéns, @${contato.number}! Você capturou ${ultimoPokemonSpawnado}!`, { mentions: [contato] });
                msg.react('🎉');
                capturaAbilitada = false;

                cooldowns[idUsuario] = agora;

            } else {
                msg.reply(`Você já capturou ${ultimoPokemonSpawnado} anteriormente.`);
            }

        } else {
            await chat.sendMessage(`Esse não é o pokémon spawnado`);
        }

    } catch (erro) {
        console.log('erro:', erro);
    }
}

function checaSeAbilitado() {
    return capturaAbilitada
}

function verificaAGeracao(id) {
    if (id <= 151) {
        return 'I'
    } else if (id >= 152 && id <= 251) {
        return 'II'
    } else if (id >= 252 && id <= 386) {
        return 'III'
    } else if (id >= 387 && id <= 494) {
        return 'IV'
    } else if (id >= 495 && id <= 649) {
        return 'V'
    } else if (id >= 650 && id <= 721) {
        return 'VI'
    } else if (id >= 722 && id <= 809) {
        return 'VII'
    } else if (id >= 810 && id <= 905) {
        return 'VIII'
    } else if (id >= 906 && id <= 9999) {
        return 'IX'
    } else if (id >= 10000) {
        return 'Variantes.'
    }
}

async function getRank(chat, msg) {
    if (chat.isGroup) {
        try {
            let rank = [];
            const participantes = chat.participants;

            let texto = '*Top 3 pessoas com mais pokémons no grupo!*\n';

            for (let participante of participantes) {
                const idUsuario = participante.id._serialized;
                const idGrupo = chat.id._serialized;
                const usuarioPokedex = await getPokedex(idUsuario, idGrupo);

                rank.push([participante.id.user, usuarioPokedex.length]);
            }

            const emogis = ['🥇', '🥈', '🥉']

            rank.sort(function (a, b) {
                return b[1] - a[1];
            });

            for (let i = 0; i < 3; i++) {
                const usuario = rank[i];
                texto += `\n${emogis[i]} @${usuario[0]} - ${usuario[1]} Pokémons.`;
            }

            await chat.sendMessage(texto, { mentions: rank.slice(0, 3).map(u => `${u[0]}@c.us`) });
            msg.react('🏆')

        } catch (erro) {
            console.log('Erro getRank:', erro);
            msg.reply('Não foi possível mandar o rank');
        }

    } else {
        msg.reply("Esse comando só funciona em grupos.");
    }
}

function checaInsignia(tipoDominante) {
    const insigniasUrl = {
        "normal": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq8c6-b0aac04a-4bdc-4b35-b980-d3ef884a4e0d.png/v1/fill/w_894,h_894/balance_badge_by_jormxdos_dffq8c6-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcThjNi1iMGFhYzA0YS00YmRjLTRiMzUtYjk4MC1kM2VmODg0YTRlMGQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.-AJ-LhbZ2D6fCGc9yiH91V9DXx8WhVrPfACZy_LmMtE",
        "fire": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq8bq-0f79e22e-81b8-4e35-820f-7fe22a8df9c6.png/v1/fill/w_894,h_894/heat_badge_by_jormxdos_dffq8bq-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcThicS0wZjc5ZTIyZS04MWI4LTRlMzUtODIwZi03ZmUyMmE4ZGY5YzYucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9pvXmXrOONStXiuqZqSSI9SWA09LZRQb5K9AIG4rcDY",
        "water": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftdqy-894e8561-f288-4a28-a80f-d69ad6864929.png/v1/fill/w_894,h_894/sawyer_badge_anime_by_jormxdos_dfftdqy-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGRxeS04OTRlODU2MS1mMjg4LTRhMjgtYTgwZi1kNjlhZDY4NjQ5MjkucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9nP5p1sEZQy2D7w8FR7jfjb5PSAlZLKEuZHHPeLpRY4",
        "grass": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftdny-9954c3de-b93d-468f-850b-67f91772e69c.png/v1/fill/w_1280,h_1280/plant_badge_by_jormxdos_dfftdny-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGRueS05OTU0YzNkZS1iOTNkLTQ2OGYtODUwYi02N2Y5MTc3MmU2OWMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.SzoBTquNxYdl6-tptRmvvRVURdfU8ZEJaxn_YEMQ0y0",
        "flying": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffskui-c20f4e36-9c14-430d-bec9-1047a02e2cee.png/v1/fill/w_894,h_894/jet_badge_by_jormxdos_dffskui-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmc2t1aS1jMjBmNGUzNi05YzE0LTQzMGQtYmVjOS0xMDQ3YTAyZTJjZWUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9YWOGpnQZKtO-thzowJqVzooqR7gk3x9iSJoNeaJz1A",
        "fighting": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftdnm-54adb564-c161-4565-b149-49bc58ee0a6d.png/v1/fill/w_894,h_894/rumble_badge_by_jormxdos_dfftdnm-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGRubS01NGFkYjU2NC1jMTYxLTQ1NjUtYjE0OS00OWJjNThlZTBhNmQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.gVeF3Gb1mUAPHkktZvflcJx_owv0s5Yo4i52dd6sQZ0",
        "poison": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffsktb-1d05182b-20ef-4f51-a3f7-4a8848f6ba80.png/v1/fill/w_894,h_894/toxic_badge_by_jormxdos_dffsktb-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmc2t0Yi0xZDA1MTgyYi0yMGVmLTRmNTEtYTNmNy00YTg4NDhmNmJhODAucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.4FUTRE0e1xejiPsO1_7Ln6Kl4RaBQHW-Qya9EqM4fpw",
        "eletric": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffsktw-fcba551f-2f00-4efc-b3be-8575cedfd88c.png/v1/fill/w_894,h_894/bolt_badge_by_jormxdos_dffsktw-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmc2t0dy1mY2JhNTUxZi0yZjAwLTRlZmMtYjNiZS04NTc1Y2VkZmQ4OGMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.mQ4RaJeT6rIE6E6i-DhkfIHQ7gfdgFLX5y4ICuf7-nY",
        "ground": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffprl8-d984eb25-62ef-439a-aa15-3aab8129ddbc.png/v1/fill/w_894,h_894/earth_badge_by_jormxdos_dffprl8-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcHJsOC1kOTg0ZWIyNS02MmVmLTQzOWEtYWExNS0zYWFiODEyOWRkYmMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.e8te7jeBGYSX02eSDa45rvEYc8y95GRDeGHWmWu1PYg",
        "rock": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffpqjy-208bd991-a8d5-4b6f-b839-6c6501070e1d.png/v1/fill/w_894,h_894/boulder_badge_by_jormxdos_dffpqjy-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcHFqeS0yMDhiZDk5MS1hOGQ1LTRiNmYtYjgzOS02YzY1MDEwNzBlMWQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.-iie2bjFlIfB86oPaaiIm1P3mGbr7KAIGIkpG-fh2gE",
        "psychic": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftdpn-5bc9f8f7-084c-446f-b20f-c6234ec43b57.png/v1/fill/w_894,h_894/psychic_badge_by_jormxdos_dfftdpn-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGRwbi01YmM5ZjhmNy0wODRjLTQ0NmYtYjIwZi1jNjIzNGVjNDNiNTcucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.GExL8KyL-q8GfMbSuqvZJRqrQec0xNSC30q0bnyVBys",
        "ice": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq0j0-c12fb86a-bc7e-4499-95b9-55a1b66069a8.png/v1/fill/w_894,h_894/glacier_badge_by_jormxdos_dffq0j0-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcTBqMC1jMTJmYjg2YS1iYzdlLTQ0OTktOTViOS01NWExYjY2MDY5YTgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ohiAvckMNzVxATY7SSzh_mdSvy6R0B2VerCf1aWOEa0",
        "bug": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq0hf-f7ffc4ec-c1ca-48aa-9af6-73e05ae4ec2a.png/v1/fill/w_894,h_894/hive_badge_by_jormxdos_dffq0hf-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcTBoZi1mN2ZmYzRlYy1jMWNhLTQ4YWEtOWFmNi03M2UwNWFlNGVjMmEucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.4r_p2ZuhKQ_WV0hsOv-Z5H9zARD4sqPzHFuvbu2YRpU",
        "ghost": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffqxfb-d7903900-02f4-48bb-af22-c54022944cb6.png/v1/fill/w_894,h_894/relic_badge_by_jormxdos_dffqxfb-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcXhmYi1kNzkwMzkwMC0wMmY0LTQ4YmItYWYyMi1jNTQwMjI5NDRjYjYucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.92Ri8o4SCQ4XrLAFWG6z-7sNphZ3q5fSLleyS4EsvsU",
        "steel": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq0ip-06398553-4dbb-4e74-8cf7-983d9cd0d254.png/v1/fill/w_894,h_894/mineral_badge_by_jormxdos_dffq0ip-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcTBpcC0wNjM5ODU1My00ZGJiLTRlNzQtOGNmNy05ODNkOWNkMGQyNTQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.yRNeO53zYrg1Vl0082gxKZiPQqy55VHKoRrZOYx1Iyo",
        "dragon": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffq0jc-f1c9adb3-501a-4f94-90df-e3929018bf5b.png/v1/fill/w_894,h_894/rising_badge_by_jormxdos_dffq0jc-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcTBqYy1mMWM5YWRiMy01MDFhLTRmOTQtOTBkZi1lMzkyOTAxOGJmNWIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.R1bpIv_l_C6abWBWay-y8EmUsMN8cyG_Ik5quIg8raY",
        "dark": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9996e7ed-0fb4-4188-8962-034418a5d62d/d31tkpl-2be134c2-ba7f-4364-9704-1b1156396760.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzk5OTZlN2VkLTBmYjQtNDE4OC04OTYyLTAzNDQxOGE1ZDYyZFwvZDMxdGtwbC0yYmUxMzRjMi1iYTdmLTQzNjQtOTcwNC0xYjExNTYzOTY3NjAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.AVWFrJP55gsN35Q46qWJx8Qo5HAhRUySFM3QXTNKJUU",
        "fairy": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfftdp2-c631300f-5966-4557-80e3-8c2f485d913c.png/v1/fill/w_894,h_894/fairy_badge_by_jormxdos_dfftdp2-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdGRwMi1jNjMxMzAwZi01OTY2LTQ1NTctODBlMy04YzJmNDg1ZDkxM2MucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.oR4IrxQ6PVWgvr5zUqlbMq_7ft5YLEPpQxsCC5abSI4"
    }

    switch (tipoDominante) {
        case "normal":
            return insigniasUrl.normal

        case "fire":
            return insigniasUrl.fire

        case "water":
            return insigniasUrl.water

        case "grass":
            return insigniasUrl.grass

        case "flying":
            return insigniasUrl.flying

        case "fighting":
            return insigniasUrl.fighting

        case "poison":
            return insigniasUrl.poison

        case "eletric":
            return insigniasUrl.eletric

        case "ground":
            return insigniasUrl.ground

        case "rock":
            return insigniasUrl.rock

        case "psychic":
            return insigniasUrl.psychic

        case "ice":
            return insigniasUrl.ice

        case "bug":
            return insigniasUrl.bug

        case "ghost":
            return insigniasUrl.ghost

        case "steel":
            return insigniasUrl.steel

        case "dragon":
            return insigniasUrl.dragon

        case "dark":
            return insigniasUrl.dark

        case "fairy":
            return insigniasUrl.fairy

        default:
            return null;
    }
}

function traduzTiposDominantes(tipos) {
    const traducoes = {
        normal: "Normal",
        fire: "Fogo",
        water: "Água",
        grass: "Planta",
        flying: "Voador",
        fighting: "Lutador",
        poison: "Veneno",
        eletric: "Elétrico",
        ground: "Terra",
        rock: "Pedra",
        psychic: "Psíquico",
        ice: "Gelo",
        bug: "Inseto",
        ghost: "Fantasma",
        steel: "Aço",
        dragon: "Dragão",
        dark: "Sombrio",
        fairy: "Fada"
    };

    return tipos.map(tipo => traducoes[tipo] || null).filter(t => t !== null).join(', ');
}

async function getInsignia(msg, chat, client) {
    try {
        const contato = await msg.getContact();
        const idUsuario = contato.id._serialized;
        const idGrupo = chat.id._serialized;
        const usuarioPokedex = await getPokedex(idUsuario, idGrupo);

        if (!usuarioPokedex) {
            await client.sendMessage(msg.from, 'Você não tem uma pokedex.');
            return;
        }

        if (usuarioPokedex.length === 0) {
            await client.sendMessage(msg.from, 'Sua Pokedex está vazia. Capture mais Pokémon!');
            return;
        }

        const tiposContagem = {};

        for (const pokemon of usuarioPokedex) {
            const tipos = await getTiposPokemon(pokemon);

            for (const tipo of tipos) {
                if (tiposContagem[tipo]) {
                    tiposContagem[tipo]++;
                } else {
                    tiposContagem[tipo] = 1;
                }
            }
        }

        let tipoDominante = null;
        let maxQuantidade = 0;

        for (const tipo in tiposContagem) {
            if (tiposContagem[tipo] > maxQuantidade) {
                maxQuantidade = tiposContagem[tipo];
                tipoDominante = tipo;
            }
        }

        const insigniaUrl = checaInsignia(tipoDominante);
        if (!insigniaUrl) {
            await msg.reply('Você não tem insígnia.');
            return;
        }

        if (tipoDominante) {
            const tipoTraduzido = traduzTiposDominantes([tipoDominante]);
            await msg.reply(`O tipo de Pokémon que você mais tem é: *${tipoTraduzido}* com ${maxQuantidade} Pokémon(s)!\n\nE sua insígnia é...`);
            const imagemInsignia = await MessageMedia.fromUrl(insigniaUrl)
            await client.sendMessage(msg.from, imagemInsignia, { sendMediaAsSticker: true, stickerAuthor: "Criado por Dolores", stickerName: "Bot de Perpetva ⚡" })
        }

    } catch (erro) {
        console.error('Erro ao verificar o tipo dominante:', erro);
        await client.sendMessage('Ocorreu um erro ao verificar seu tipo dominante.');
    }
}

async function getTiposPokemon(pokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = await response.json();
        return data.types.map(tipoInfo => tipoInfo.type.name);
    } catch (erro) {
        console.log('erro getTiposPokemon: ', erro);
    }
}

module.exports = { chamaPokemon, enviaPokedex, spawnaPokemon, pegaPokemon, checaSeAbilitado, getRank, pokemonFugiu, getInsignia }