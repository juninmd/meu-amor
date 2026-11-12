# Meu Amor · Céu de Nós Dois

**Um site estático e pessoal para Antonio & Daniela: céu noturno em canvas, contadores do relacionamento, pilha de fotos, linha do tempo, mini-jogos, lista de sonhos e uma carta.**

Não há framework, bundler nem banco de dados. É HTML, CSS e JavaScript ES modules servidos como estão; o conteúdo inteiro (datas, textos, fotos, perguntas) vive em `js/config.js`. O deploy é feito pelo GitHub Pages a cada push na `master`.

## O que tem no site

| Seção | O que faz |
| --- | --- |
| **Início** | Contador de dias desde 28/07/2022, contagem de casados desde 29/11/2025, aniversário de bodas com anel de progresso e o botão que “acende” o céu. |
| **Momentos** | Pilha de 9 fotos com arraste, setas, teclado, tira de miniaturas e lightbox em tela cheia. |
| **Jornada** | Linha do tempo do casal e um mapa estilizado com pins clicáveis (“O início”, “Primeiro beijo”, “Futuro lar”). |
| **Brincar** | Jogo da memória, raspadinha, quiz, calculadora do amor, motivos, cápsula do tempo, mensagem na garrafa e surpresa. |
| **Sonhos** | Lista com progresso, inclusão de novos sonhos e persistência no navegador. |
| **Carta** | Envelope que abre, carta com botão de infinito e gatilhos secretos (Konami e toques). |
| **Atmosfera** | Tema noite/amanhecer, céu com estrelas e constelações em canvas, dock de navegação e player de música. |

O site respeita `prefers-reduced-motion`: com movimento reduzido, o confete e parte das animações não disparam.

## Estrutura

```text
index.html            marcação de todas as seções e diálogos
css/
  base.css            tokens, tema, dock, música, atmosfera
  sections.css        hero, momentos, jornada, sonhos, carta
  playground.css      bento grid e jogos
js/
  config.js           fonte única de datas, textos, fotos e perguntas
  main.js             inicializa cada módulo
  sky.js              céu em canvas
  timers.js           contadores e bodas
  gallery.js          pilha de fotos e lightbox
  hero.js             abertura, mapa e pins
  dreams.js           lista de sonhos
  letter.js           carta, envelope e segredos
  nav.js              tema, música, dock e inclinação
  dialogs.js          abertura/fechamento dos diálogos
  utils.js            helpers ($, store, shuffle, confete)
  games/
    memory.js         jogo da memória
    scratch.js        raspadinha em canvas
    quiz.js           quiz
    calc.js           calculadora
    extras.js         cápsula, garrafa, motivos e surpresa
tests/
  app.test.js         integração com jsdom sobre o index.html real
  logic.test.js       funções puras
  setup.js            stubs de canvas, matchMedia e IntersectionObserver
.github/
  workflows/pages.yml deploy no GitHub Pages
  scripts/build-site.sh monta o diretório _site
```

Cada módulo expõe sua própria função de inicialização (`initTimers`, `initGallery`, `createSky`…), chamada por `main.js`; nenhum arquivo conhece o estado interno dos outros. Os jogos compartilham apenas `js/utils.js` e `js/config.js`.

## Editar o conteúdo

Tudo que é pessoal está em `js/config.js`. O arquivo é a “fonte única da verdade” justamente para que mudar texto não exija tocar em lógica.

| Export | Para quê |
| --- | --- |
| `REL` | Início do relacionamento (usado no contador de dias e nos batimentos). |
| `WED` | Data do casamento; antes dela o site mostra contagem regressiva, depois “casados há”. |
| `CAPSULE` | Data em que a cápsula do tempo pode ser aberta. |
| `GREETING` | Texto digitado na abertura. |
| `MUSIC_AUTOPLAY` | Parâmetro acrescentado ao embed do YouTube quando a música é iniciada. |
| `BODAS` | Nomes das bodas por ano (1 a 50). |
| `PHOTOS` | Nomes dos arquivos de foto; a legenda e a hora saem do nome. |
| `REASONS`, `BOTTLE`, `PRIZES`, `DREAMS`, `QUIZ`, `PINS` | Textos dos motivos, da garrafa, dos prêmios, dos sonhos, das perguntas e dos pins. |

> [!NOTE]
> `new Date(ano, mês, dia)` usa **mês de 0 a 11** em JavaScript. Em `new Date(2022, 6, 28)`, `6` é julho.

### Trocar ou acrescentar fotos

1. Coloque o arquivo na raiz do repositório.
2. Adicione o nome exato ao array `PHOTOS` em `js/config.js`.

A legenda é derivada do nome no padrão `photo_AAAA-MM-DD_HH-MM.jpg` (ou qualquer nome que contenha esse trecho): o site extrai dia, mês, ano e hora. Nomes fora do padrão quebram a geração da legenda, então renomeie antes de adicionar. As imagens atuais são JPGs de 2023 e estão versionadas na raiz.

Para mudar o título da aba, edite `<title>` em `index.html`. Para mudar as cores, os tokens ficam no topo de `css/base.css` (`--rose`, `--gold`, superfícies do tema escuro e do amanhecer).

## Rodar localmente

Como os scripts são ES modules, abrir `index.html` por `file://` costuma falhar por CORS. Sirva a pasta por HTTP:

```bash
python -m http.server 8000
# http://localhost:8000
```

Não há `npm install` obrigatório para ver o site: as dependências de `package.json` são só de teste. Para o player de música, o iframe do YouTube precisa de rede.

## Publicação no GitHub Pages

O workflow `Deploy to GitHub Pages` roda em todo push na `master` (e por `workflow_dispatch`):

1. Faz checkout e instala Node 22.
2. Roda `npm ci && npm test` se existir `package-lock.json`.
3. Executa `.github/scripts/build-site.sh _site`.
4. Publica `_site` com `actions/configure-pages`, `upload-pages-artifact` e `deploy-pages`.

O script de montagem copia apenas o que o navegador precisa: arquivos `.html`, `.css`, `.js`, `.jpg`, `.png`, `.svg`, `.webp` e `.ico` da raiz (exceto `vitest.config.js`), mais as pastas `css/` e `js/`. Testes, `package.json`, `README` e configurações ficam de fora. Ele também cria `.nojekyll` para o Pages não processar o site com Jekyll.

No repositório, a fonte do Pages precisa estar em **Settings → Pages → GitHub Actions**. Não existe etapa de build: o que está versionado é o que vai ao ar.

## Privacidade e conteúdo pessoal

- **As fotos são pessoais e estão em um repositório público.** Qualquer pessoa com a URL do repositório ou do site consegue baixá-las. Se isso não for desejado, o caminho é remover os arquivos, trocar o site para um repositório privado (com outro meio de publicação) e limpar o histórico do Git — apagar em um commit novo não remove as cópias antigas.
- **Nada é enviado para servidor próprio.** Não há backend, formulário, login, analytics ou cookies de rastreamento.
- **O navegador guarda apenas preferências locais:** tema (`theme`), sonhos (`dreams` e `bucket1`…`bucket5`) e o estado de alguns segredos. Os dados ficam no `localStorage` daquele navegador; limpar os dados do site os apaga. Se o armazenamento estiver bloqueado, o site continua funcionando sem persistir.
- **Rede externa:** o player incorpora `youtube-nocookie.com` quando a música é aberta, e o confete vem do CDN jsDelivr (`canvas-confetti`). Esses dois serviços veem o IP do visitante; o restante do site é local.

## Testes

```bash
npm install
npm test        # vitest run --coverage
```

A configuração em `vitest.config.js` usa `jsdom`, carrega `tests/setup.js` e exige **80%** de linhas, funções, branches e statements em `js/**/*.js`.

- `tests/app.test.js` monta o `<body>` do `index.html` real, importa `js/main.js` e exercita contadores, digitação do greeting, céu, galeria, lightbox, pins, memória, raspadinha, quiz, calculadora, sonhos e carta. Usa timers falsos e uma data fixa.
- `tests/logic.test.js` cobre funções puras: diferenças de calendário, bodas, batimentos, curvas do céu, embaralhamento, armazenamento, escape de HTML, cápsula e cálculo.
- `tests/setup.js` substitui canvas, `matchMedia`, `IntersectionObserver` e `requestAnimationFrame`, que o jsdom não implementa.

O workflow de Pages roda esses testes antes de publicar. Os workflows `Validate`, `SAST`, `Security Scan` e `Release Drafter` também existem no repositório.

## Limitações

- **Sem build e sem minificação.** O site é entregue como está; qualquer mudança em `js/config.js` vai ao ar no próximo push.
- **Datas e textos são código.** Não há CMS nem painel; editar conteúdo é editar `config.js` e recarregar.
- **Fotos sem otimização.** Não há geração de miniaturas, `srcset` ou compressão no deploy; o peso das imagens é o peso dos arquivos versionados.
- **Dependências externas:** YouTube para a música e jsDelivr para o confete. Sem rede, esses dois recursos não funcionam (o resto do site funciona).
- **Áudio não automático.** Navegadores bloqueiam autoplay; a música só começa após o clique no botão.
- **Estado por navegador.** Sonhos e tema não sincronizam entre dispositivos.
- **Um casal, um site.** Os nomes, datas e textos são fixos no HTML/config; não é um gerador de sites para terceiros.

## Licença

Não há arquivo de licença. O código não tem licença de uso declarada e as fotos, textos e nomes são conteúdo pessoal de Antonio e Daniela — não reutilize sem autorização.
