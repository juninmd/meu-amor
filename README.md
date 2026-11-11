# Meu Amor · Céu de Nós Dois

Site estático para Antonio & Daniela: um céu noturno vivo (canvas) com contadores, fotos, linha do tempo, playground de jogos, lista de sonhos e carta. Publicado no GitHub Pages direto da raiz, sem build.

## Estrutura

| Caminho | Papel |
| --- | --- |
| `index.html` | Marcação de todas as seções e sheets |
| `css/base.css` | Tokens (tema noite/amanhecer), dock, música, atmosfera |
| `css/sections.css` | Hero, momentos, jornada, sonhos, carta |
| `css/playground.css` | Bento grid e jogos |
| `js/config.js` | Datas, textos, fotos, perguntas: edite aqui o conteúdo |
| `js/main.js` | Inicializa cada módulo de forma isolada |
| `js/sky.js`, `timers.js`, `gallery.js`, `hero.js`, `dreams.js`, `letter.js`, `nav.js`, `dialogs.js` | Uma responsabilidade por arquivo |
| `js/games/*.js` | Memória, raspadinha, quiz, calculadora, motivos/cápsula/garrafa/surpresa |

## Rodar localmente

Os scripts são ES modules, então use um servidor (não `file://`):

```bash
python3 -m http.server 8000
```

## Testes

```bash
npm install
npm test   # Vitest + jsdom, cobertura mínima de 80%
```
