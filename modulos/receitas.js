const { numeroAleatorio } = require('./funcoes.js')

const receitas = [
    "Sopa de Legumes:\nIngredientes:\n- 2 batatas\n- 2 cenouras\n- 1 abobrinha\n- 1 litro de caldo de legumes\n- Sal e pimenta a gosto\n\nModo de Preparo:\n1. Corte todos os legumes em cubos.\n2. Em uma panela, adicione o caldo de legumes e os legumes cortados.\n3. Cozinhe até que os legumes estejam macios.\n4. Tempere com sal e pimenta.\n5. Sirva quente.",
    
    "Salada de Frutas:\nIngredientes:\n- 1 maçã\n- 1 banana\n- 1 laranja\n- 1 mamão\n- Suco de 1 limão\n- Mel a gosto\n\nModo de Preparo:\n1. Corte todas as frutas em cubos.\n2. Misture em uma tigela.\n3. Regue com o suco de limão e mel.\n4. Sirva fresca.",

    "Arroz de Forno:\nIngredientes:\n- 2 xícaras de arroz cozido\n- 200g de queijo mussarela\n- 200g de presunto\n- 1 lata de molho de tomate\n- Orégano a gosto\n\nModo de Preparo:\n1. Em um refratário, espalhe uma camada de arroz.\n2. Adicione uma camada de presunto e queijo.\n3. Cubra com o molho de tomate e polvilhe orégano.\n4. Repita as camadas até acabar os ingredientes.\n5. Leve ao forno pré-aquecido a 200°C por 20 minutos.",

    "Mousse de Maracujá:\nIngredientes:\n- 1 lata de leite condensado\n- 1 lata de creme de leite\n- 1/2 xícara de suco de maracujá concentrado\n\nModo de Preparo:\n1. No liquidificador, bata o leite condensado, o creme de leite e o suco de maracujá.\n2. Despeje em taças e leve à geladeira por 2 horas.\n3. Sirva gelado.",

    "Frango Xadrez:\nIngredientes:\n- 500g de peito de frango em cubos\n- 1 pimentão verde\n- 1 pimentão vermelho\n- 1 cebola\n- 2 colheres de sopa de óleo\n- 2 colheres de sopa de molho de soja\n\nModo de Preparo:\n1. Em uma panela, aqueça o óleo e refogue a cebola.\n2. Adicione o frango e cozinhe até dourar.\n3. Junte os pimentões e o molho de soja.\n4. Cozinhe por mais 5 minutos.\n5. Sirva com arroz branco.",

    "Pudim de Leite:\nIngredientes:\n- 1 lata de leite condensado\n- 2 medidas da lata de leite\n- 3 ovos\n- 1 xícara de açúcar para a calda\n\nModo de Preparo:\n1. Bata no liquidificador o leite condensado, o leite e os ovos.\n2. Derreta o açúcar em uma forma com furo no meio.\n3. Despeje a mistura na forma.\n4. Asse em banho-maria a 180°C por 1 hora e 30 minutos.\n5. Deixe esfriar e desenforme.",

    "Torta de Limão:\nIngredientes:\n- 1 pacote de biscoito de maisena\n- 100g de manteiga\n- 1 lata de leite condensado\n- Suco de 4 limões\n- Raspas de limão para decorar\n\nModo de Preparo:\n1. Triture o biscoito e misture com a manteiga até formar uma massa.\n2. Forre o fundo de uma forma de aro removível.\n3. No liquidificador, bata o leite condensado e o suco de limão.\n4. Despeje sobre a massa.\n5. Leve à geladeira por 2 horas.\n6. Decore com raspas de limão antes de servir.",

    "Brigadeiro:\nIngredientes:\n- 1 lata de leite condensado\n- 1 colher de sopa de manteiga\n- 7 colheres de sopa de chocolate em pó\n- Chocolate granulado para enrolar\n\nModo de Preparo:\n1. Em uma panela, misture o leite condensado, a manteiga e o chocolate em pó.\n2. Cozinhe em fogo baixo, mexendo sempre, até desgrudar do fundo da panela.\n3. Deixe esfriar, faça bolinhas e passe no chocolate granulado.",

    "Quiche de Queijo:\nIngredientes:\n- 1 xícara de farinha de trigo\n- 1/2 xícara de manteiga\n- 1/2 colher de chá de sal\n- 3 ovos\n- 1 xícara de creme de leite\n- 1 xícara de queijo ralado\n- Sal e pimenta a gosto\n\nModo de Preparo:\n1. Misture a farinha, a manteiga e o sal até formar uma massa.\n2. Forre uma forma de torta e leve ao forno pré-aquecido a 180°C por 10 minutos.\n3. Bata os ovos, o creme de leite e o queijo. Tempere com sal e pimenta.\n4. Despeje sobre a massa e asse por mais 30 minutos.",

    "Creme de Abóbora:\nIngredientes:\n- 500g de abóbora\n- 1 cebola\n- 2 dentes de alho\n- 1 litro de caldo de legumes\n- Sal e pimenta a gosto\n- Creme de leite para servir\n\nModo de Preparo:\n1. Cozinhe a abóbora, a cebola e o alho no caldo de legumes até que a abóbora esteja macia.\n2. Bata tudo no liquidificador até formar um creme.\n3. Tempere com sal e pimenta.\n4. Sirva com um pouco de creme de leite por cima."
];

async function receitaAleatoria (msg){
    const i = numeroAleatorio(receitas.length, 0);
    const envia = `Olha só uma receita bem gostosa! 😋\n${receitas[i]}`
    msg.reply(envia)
};

module.exports = { receitaAleatoria }