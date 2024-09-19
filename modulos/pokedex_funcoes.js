const axios = require('axios');
const { Client } = require('pg');
require('dotenv').config();

// //////////// BANCO DE DADOS LOCAL ////////////////////////
// const sqlite3 = require('sqlite3').verbose();
// const axios = require('axios');
// const db = new sqlite3.Database('pokemon.db'); // Cria o banco de dados SQLite

// // Cria a tabela de Pokémon se ainda não existir
// db.run('CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, group_id TEXT, name TEXT)');

// function checaSePokemonCapturado(userId, groupId, nomePokemon) {
//     return new Promise((retorno) => {
//         db.get('SELECT * FROM pokemon WHERE user_id = ? AND group_id = ? AND name = ?', [userId, groupId, nomePokemon], (erro, linha) => {
//             if (erro) {
//                 console.error('Erro ao verificar captura do Pokémon:', err.message);
//                 retorno(false);
//             } else {
//                 retorno(!!linha);
//             }
//         });
//     });
// }

// function salvaPokemonCapturado(userId, groupId, nomePokemon) {
//     db.run('INSERT INTO pokemon (user_id, group_id, name) VALUES (?, ?, ?)', [userId, groupId, nomePokemon], (erro) => {
//         if (erro) {
//             console.error('Erro ao salvar Pokémon capturado:', err.message);
//         } else {
//             console.log(`Pokémon capturado salvo: ${nomePokemon}`);
//         }
//     });
// }

// function getPokedex(userId, groupId) {
//     return new Promise((resolve) => {
//         db.all('SELECT name FROM pokemon WHERE user_id = ? AND group_id = ?', [userId, groupId], (erro, linhas) => {
//             if (erro) {
//                 console.error('Erro ao obter Pokedex:', erro.message);
//                 resolve([]);
//             } else {
//                 const pokedex = linhas.map((linhas) => linhas.name);
//                 resolve(pokedex);
//             }
//         });
//     });
// }

// async function getNomePokemon(pokemonId) {
//     try {
//         const resposta = await axios.get(`http://localhost:3000/pokemon/${pokemonId}`);
//         return resposta.data.name;
//     } catch (erro) {
//         console.error('Erro ao obter o nome do Pokémon:', erro);
//         return '';
//     }
// }

//------------------------------------------------------------
//////////////// BANCO DE DADOS EXTERNO //////////////////////

const postgresqlDatabase = process.env.DATABASE_URL_POSTGRESQL


const client = new Client({
  connectionString: postgresqlDatabase,
  ssl: {
    rejectUnauthorized: false 
  }
});

client.connect();

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
    console.log('Erro ao verificar captura do Pokémon:', erro);
    return false;
  }
}

async function salvaPokemonCapturado(userId, groupId, nomePokemon) {
  try {
    await client.query('INSERT INTO pokemon (user_id, group_id, name) VALUES ($1, $2, $3)', [userId, groupId, nomePokemon]);
    console.log(`Pokémon capturado salvo: ${nomePokemon}`);
  } catch (erro) {
    console.log('Erro ao salvar Pokémon capturado:', erro);
  }
}

async function getPokedex(userId, groupId) {
  try {
    const resposta = await client.query('SELECT name FROM pokemon WHERE user_id = $1 AND group_id = $2', [userId, groupId]);
    return resposta.rows.map(row => row.name);
  } catch (erro) {
    console.log('Erro ao obter Pokedex:', erro);
    return [];
  }
}

async function getNomePokemon(pokemonId) {
  try {
    const resposta = await axios.get(`http://localhost:3000/pokemon/${pokemonId}`);
    return resposta.data.name;
  } catch (erro) {
    console.log('Erro ao obter o nome do Pokémon:', erro);
    return '';
  }
}

module.exports = {
  getNomePokemon,
  getPokedex,
  salvaPokemonCapturado,
  checaSePokemonCapturado,
}