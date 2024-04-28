const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/pokemon/:name', async (requerimento, retorno) => {
  try {
    const resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${requerimento.params.name}`);
    const pokemonData = {
      name: resposta.data.name,
      id: resposta.data.id,
      types: resposta.data.types.map(type => type.type.name)
    };
    retorno.json(pokemonData);
  } catch (erro) {
    console.error(erro);
    retorno.status(500).json({ erro: 'Erro ao obter dados do Pokémon.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

