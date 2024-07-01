const axios = require('axios');
const CHAVE_TMDB = require('./chaves_api.js');

async function chamaFilme () {
    const baseUrl = 'https://api.themoviedb.org/3';
    let enviarFilmes = '';
    try {
        const response = await axios.get(`${baseUrl}/movie/now_playing`, {
            params: {
                api_key: CHAVE_TMDB,
                language: 'pt-BR',
                region: 'BR' 
            }
        });
        
        const movies = response.data.results;
        movies.forEach(filme => {
        const mensagem = `Filme: *${filme.title}*\nData de lançamento: ${filme.release_date}\n--------\n`
        enviarFilmes += mensagem; 
        });
        return enviarFilmes

    } catch (erro) {
        console.error('Erro ao buscar filmes em cartaz:', erro);
        return 'Erro ao buscar filmes em cartaz'
    }
}

module.exports = { chamaFilme };