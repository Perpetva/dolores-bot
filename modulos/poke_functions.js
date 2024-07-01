// //////////// BANCO DE DADOS LOCAL ////////////////////////
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const db = new sqlite3.Database('pokemon.db'); // Cria o banco de dados SQLite

// Cria a tabela de Pokémon se ainda não existir
db.run('CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, group_id TEXT, name TEXT)');

function getIdPokemonAleatorio() {
    return Math.floor(Math.random() * 1010) + 1; // Pensando que tem 1010 pokemons disponiveis
}

function checaSePokemonCapturado(userId, groupId, nomePokemon) {
    return new Promise((retorno) => {
        db.get('SELECT * FROM pokemon WHERE user_id = ? AND group_id = ? AND name = ?', [userId, groupId, nomePokemon], (erro, linha) => {
            if (erro) {
                console.error('Erro ao verificar captura do Pokémon:', err.message);
                retorno(false);
            } else {
                retorno(!!linha);
            }
        });
    });
}

function salvaPokemonCapturado(userId, groupId, nomePokemon) {
    db.run('INSERT INTO pokemon (user_id, group_id, name) VALUES (?, ?, ?)', [userId, groupId, nomePokemon], (erro) => {
        if (erro) {
            console.error('Erro ao salvar Pokémon capturado:', err.message);
        } else {
            console.log(`Pokémon capturado salvo: ${nomePokemon}`);
        }
    });
}

function getPokedex(userId, groupId) {
    return new Promise((resolve) => {
        db.all('SELECT name FROM pokemon WHERE user_id = ? AND group_id = ?', [userId, groupId], (erro, linhas) => {
            if (erro) {
                console.error('Erro ao obter Pokedex:', erro.message);
                resolve([]);
            } else {
                const pokedex = linhas.map((linhas) => linhas.name);
                resolve(pokedex);
            }
        });
    });
}

function pokemonCapturavel(nomePokemon, ultimoPokemonSpawnado) {
    return nomePokemon.toLowerCase() === ultimoPokemonSpawnado.toLowerCase();
}

async function getNomePokemon(pokemonId) {
    try {
        const resposta = await axios.get(`http://localhost:3000/pokemon/${pokemonId}`);
        return resposta.data.name;
    } catch (erro) {
        console.error('Erro ao obter o nome do Pokémon:', erro);
        return '';
    }
}

//------------------------------------------------------------
//////////////// BANCO DE DADOS EXTERNO //////////////////////
const axios = require('axios');

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Apenas para permitir conexões não seguras para este exemplo. Em produção, use SSL seguro.
  }
});

client.connect();

// Cria a tabela de Pokémon se ainda não existir
client.query(`
  CREATE TABLE IF NOT EXISTS pokemon (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    group_id TEXT,
    name TEXT
  );
`);

async function checaSePokemonCapturado(userId, groupId, nomePokemon) {
  try {
    const resposta = await client.query('SELECT * FROM pokemon WHERE user_id = $1 AND group_id = $2 AND name = $3', [userId, groupId, nomePokemon]);
    return resposta.rows.length > 0;
  } catch (erro) {
    console.error('Erro ao verificar captura do Pokémon:', erro.message);
    return false;
  }
}

async function salvaPokemonCapturado(userId, groupId, nomePokemon) {
  try {
    await client.query('INSERT INTO pokemon (user_id, group_id, name) VALUES ($1, $2, $3)', [userId, groupId, nomePokemon]);
    console.log(`Pokémon capturado salvo: ${nomePokemon}`);
  } catch (erro) {
    console.error('Erro ao salvar Pokémon capturado:', erro.message);
  }
}

async function getPokedex(userId, groupId) {
  try {
    const resposta = await client.query('SELECT name FROM pokemon WHERE user_id = $1 AND group_id = $2', [userId, groupId]);
    return resposta.rows.map(row => row.name);
  } catch (erro) {
    console.error('Erro ao obter Pokedex:', erro.message);
    return [];
  }
}


function pokemonCapturavel(nomePokemon, ultimoPokemonSpawnado) {
  return nomePokemon.toLowerCase() === ultimoPokemonSpawnado.toLowerCase();
}

async function getNomePokemon(pokemonId) {
  try {
    const resposta = await axios.get(`http://localhost:3000/pokemon/${pokemonId}`);
    return resposta.data.name;
  } catch (erro) {
    console.error('Erro ao obter o nome do Pokémon:', erro);
    return '';
  }
}

function getIdPokemonAleatorio() {
  return Math.floor(Math.random() * 1025) + 1; // Pensando que tem 1025 pokemons disponiveis
}

module.exports = {
  pokemonCapturavel,
  getNomePokemon,
  getPokedex,
  salvaPokemonCapturado,
  checaSePokemonCapturado,
  getIdPokemonAleatorio
}