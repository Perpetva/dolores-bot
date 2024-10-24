
![Logo](https://i.pinimg.com/control/564x/57/de/d7/57ded7dfe9cb5129fea9ded9b42b1d44.jpg)


# Dolores-BOT 🔮

Este é meu bot do WhatsApp criado com uma biblioteca chamada [whatsApp-web.js](https://github.com/pedroslopez/whatsapp-web.js) de [pedroslopez](https://github.com/pedroslopez), que usa o Puppeteer para executar uma instância real do WhatsApp Web em um navegador headless.

#### Detalhes

Dolores é criação especial, desenvolvida para trazer entretenimento no WhatsApp com várias funcionalidades incríveis. Um dos destaques é o sistema de spawns de pokémons em grupos, que podem ser capturados e adicionados à sua Pokédex!

No entanto, com novos projetos em andamento, Dolores provavelmente não receberá mais atualizações. Apesar disso, ela continuará sendo uma experiência divertida para aqueles que a utilizam!
## Funcionalidades

Todos os comandos começam com `!` e são case-insensitive, funciona em qualquer chat que o bot esteja.

#### Comandos 👇


| Comando   | Descrição                           |
| :---------- | :---------------------------------- |
| `!figurinha` | Transforma foto em figurinha. |
| `!clima` | Clima atual de São Paulo. |
| `!cartaz` | Filmes em cartaz no cinema. |
| `!todos` | Marca todos em um grupo. |
| `!gato` | Foto aleatória de um gato. |
| `!cachorro` | Foto aleatória de um cachorro. |
| `!caraoucoroa` | Gira uma moeda para cair em cara ou coroa. |
| `!chance <texto>` | Calcula a chance de algo acontecer. |
| `!listar megas` | Lista de pokémons mega pra ver com o !poke. |
| `!insignia` | Qual tipo de pokémon você mais tem. |
| `!horario` | O horário em alguns lugares do mundo. |
| `!anime-frase` | Frase aleatória de um anime. |
| `!anime-fato` | Curiosidades sobre animes. |
| `!conselho` | Envia um conselho. |
| `!covid ` | Exibe dados atualizados sobre o Covid-19. |
| `!cotacao` | Cotação de algumas moedas. |
| `!pin <palavra ou texto>` | Manda uma imagem do pinterest. |
| `!traduz <texto>` | Traduz o texto enviado. |
| `!eununca` | Brincadeira do eu nunca. |
| `!traduzir` | Traduz a imagem marcada. |
| `!poke <ID ou nome>` | Envia informações sobre um pokémon. |
| `!noticia` | Uma noticia atual. |
| `!receita` | Receita alearória. |
| `!rank` | Top 3 com mais pokemons do grupo. |

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`CHAVE_OPENWEATHER`

`CHAVE_EXCHANGERATE`

`CHAVE_NEWSAPI` 

`CHAVE_TMDB`

`DATABASE_URL_POSTGRESQL`

`MEU_TELEFONE` 

`LISTA_GRUPOS`

`CHAVE_RAPID_API` 

`CHAVE_WAIFU`

_use o comando /cod_group para receber o código do grupo no telefone definido em `MEU_TELEFONE` e adicionar o código a variavel `LISTA_GRUPOS` para começar a spawnar os pokémons_.


## Uso

#### Rodando localmente

Para usar primeiro clone o reposiorio usando:

```bash
  git clone https://github.com/perpetva/dolores-bot.git
```

Entre no diretório do projeto

```bash
  cd dolores-bot
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run start
```

Após isso crie as variaveis listadas acima no seu .env. Para usar a RapidApi você precisa estar inscrito nas APIs abaixo:

`Recipe-Book` -> [Link](https://rapidapi.com/technicalsolverm/api/recipe-book2)

`Unofficial Pinterest API` -> [Link](https://rapidapi.com/asyncsolutions-asyncsolutions-default/api/unofficial-pinterest-api)

`COVID-19 data` -> [Link](https://rapidapi.com/Gramzivi/api/covid-19-data)

`Deep Translate` -> [Link](https://rapidapi.com/gatzuma/api/deep-translate1)

Todas tem planos gratuitos porém caso ultrapasse o limite do plano, os requests serão bloqueados e fundos poderão ser cobrados da sua conta.

Com o ambiente configurado inicie o BOT com:

```bash
  npm start
```
A autenticação do BOT é feita por QRCODE, então logo após iniciar o BOT, um QRCODE aparecerá no terminal, conecte-se como se fosse conectar ao Whatsapp web normalmente e pronto, o BOT está funcionando no número que você escaneou o QRCODE!


## Agradecimentos 😊

Muito obrigado por clonar este repositório e explorar o projeto Dolores! 🎉
Espero que você se divirta e aproveite todas as funcionalidades que ela oferece. Foi uma jornada incrível desenvolver este bot, e fico feliz em compartilhar isso com você!

Thank you!