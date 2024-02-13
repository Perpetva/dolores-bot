const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const db = new sqlite3.Database('pokemon.db'); // Cria o banco de dados SQLite

// Cria a tabela de Pokémon se ainda não existir
db.run('CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, group_id TEXT, name TEXT)');

function getRandomPokemonId() {
    return Math.floor(Math.random() * 1010) + 1; // Pensando que tem 1010 pokemons disponiveis
}

function checkIfPokemonCaptured(userId, groupId, pokemonName) {
    return new Promise((resolve) => {
        db.get('SELECT * FROM pokemon WHERE user_id = ? AND group_id = ? AND name = ?', [userId, groupId, pokemonName], (err, row) => {
            if (err) {
                console.error('Erro ao verificar captura do Pokémon:', err.message);
                resolve(false);
            } else {
                resolve(!!row);
            }
        });
    });
}

function saveCapturedPokemon(userId, groupId, pokemonName) {
    db.run('INSERT INTO pokemon (user_id, group_id, name) VALUES (?, ?, ?)', [userId, groupId, pokemonName], (err) => {
        if (err) {
            console.error('Erro ao salvar Pokémon capturado:', err.message);
        } else {
            console.log(`Pokémon capturado salvo: ${pokemonName}`);
        }
    });
}

function getPokedex(userId, groupId) {
    return new Promise((resolve) => {
        db.all('SELECT name FROM pokemon WHERE user_id = ? AND group_id = ?', [userId, groupId], (err, rows) => {
            if (err) {
                console.error('Erro ao obter Pokedex:', err.message);
                resolve([]);
            } else {
                const pokedex = rows.map((row) => row.name);
                resolve(pokedex);
            }
        });
    });
}

function isCapturablePokemon(pokemonName, lastSpawnedPokemonName) {
    // Comparar os nomes dos Pokémon de forma insensível a maiúsculas e/ou minúsculas
    return pokemonName.toLowerCase() === lastSpawnedPokemonName.toLowerCase();
}

async function getPokemonName(pokemonId) {
    try {
        const response = await axios.get(`http://localhost:3000/pokemon/${pokemonId}`);
        return response.data.name;
    } catch (error) {
        console.error('Erro ao obter o nome do Pokémon:', error);
        return '';
    }
}

module.exports = {
    isCapturablePokemon,
    getPokemonName,
    getPokedex,
    saveCapturedPokemon,
    checkIfPokemonCaptured,
    getRandomPokemonId
}