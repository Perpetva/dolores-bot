const axios = require('axios');
require('dotenv').config();

const chaveTheMovie = process.env.CHAVE_TMDB;

async function chamaFilme (msg) {
    const baseUrl = 'https://api.themoviedb.org/3';
    let enviarFilmes = '';
    try {
        const response = await axios.get(`${baseUrl}/movie/now_playing`, {
            params: {
                api_key: chaveTheMovie,
                language: 'pt-BR',
                region: 'BR' 
            }
        });
        
        const movies = response.data.results;
        movies.forEach(filme => {
        const mensagem = `Filme: *${filme.title}*\nData de lançamento: ${filme.release_date}\n--------\n`
        enviarFilmes += mensagem; 
        });
        const envia = `Filmes em cartaz no cinema! 🍿\n\n${enviarFilmes}`;
        
        msg.reply(envia);

    } catch (erro) {
        console.log('Erro ao buscar filmes em cartaz:', erro);
        msg.reply('Erro ao buscar filmes em cartaz') 
    }
}

module.exports = { chamaFilme };