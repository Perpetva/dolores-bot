const express = require('express');
const axios = require('axios');

///////// INICIO DO SERVIDOR PRA PUXAR O HTTPS //////////

const app = express();
const port = 3000;

app.get('/pokemon/:name', async (req, res) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`);
    const pokemonData = {
      name: response.data.name,
      id: response.data.id,
      types: response.data.types.map(type => type.type.name)
    };
    res.json(pokemonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados do Pokémon.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

///////// FIM DO SERVIDOR PRA PUXAR O HTTPS //////////
