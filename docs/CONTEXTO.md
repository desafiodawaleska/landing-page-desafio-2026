# Contexto do projeto — Landing "Desafio da Waleska / 30 dias"

Documento de handoff. Leia antes de mexer no código: registra as decisões
já tomadas e o porquê delas, para não serem desfeitas por engano.

Última revisão: 28/07/2026.

## O que é

Landing page de campanha, implementada em React + Vite a partir de
protótipos feitos no Claude Design (claude.ai/design). Os protótipos são a
fonte da verdade do visual e estão em `design/`.

Repositório: `eusouandrew/Desafio-30-dias` · Deploy: Vercel (dois projetos
ligados ao mesmo repo, `desafio-30-dias` e `desafio-30-dias-zbow`; ambos
publicam da `main`).

## Estrutura

```
src/
  App.jsx              escolhe o layout conforme a largura da janela
  ScaledCanvas.jsx     escala um canvas de largura fixa para caber na tela
  styles.css           @font-face + animações compartilhadas
  sections/            desktop, canvas de 1440px
  sections/mobile/     mobile, canvas de 390px
public/assets/         imagens da identidade visual
public/fonts/          Red Hat Display variável (WOFF2)
design/                protótipos .dc.html do Claude Design + transcrições
docs/                  este arquivo e o histórico de sessões
```

## Decisões que têm motivo

**Canvas de largura fixa + `transform: scale()`, não layout fluido.**
O design foi feito em 1440px com posicionamento absoluto, e a arte depende
de sobreposições precisas (grid, luz em `multiply`, quadrados ancorados nas
células do grid). Redigramar com flex/grid quebraria a composição. O
`ScaledCanvas` encolhe o canvas inteiro proporcionalmente.

**Faixas de sangria acompanhando a janela.** Cada seção desktop pinta uma
faixa (`.<secao>__bleed`) que vai de ponta a ponta da tela, centrada no
canvas. Sem ela sobrava o fundo do `body` nas laterais em telas largas.
A largura visível em px de canvas é exposta pelo `ScaledCanvas` na variável
CSS `--vw`. Para converter uma coordenada do canvas para dentro de uma
faixa:

```css
left: calc(<x>px + var(--vw) / 2 - 720px);
```

Em 1440 todas essas contas devolvem os valores originais do design — é o
critério que uso para saber que não quebrei nada.

**Toda faixa precisa da cor de base da seção.** Vários assets são
semitransparentes (`logo-fundo.png` tem alfa ~57/255 nas pontas), então
compõem sobre o que estiver atrás. Enquanto a cor de base ficou na
`<section>`, que tem 1440px, tudo fora dessa largura compunha sobre o
`#160100` do body e desenhava um retângulo visível em canvas 0..1440.
**Se criar uma faixa nova, ponha a cor de base nela, não na section.**

**A escala trava em 1 até a sangria cobrir a janela.** Acima de
`DESKTOP_BLEED` (2040px) ela volta a crescer. Ampliar antes disso borraria
os PNGs à toa.

**Quando amplia, a escala respeita a altura da janela.** Em ultrawide
2560x1080 a hero ficava com 1285px de altura e o CTA caía abaixo do corte.
O limite (`fitHeight`, a altura da hero) nunca reduz a escala abaixo de 1,
então telas médias não mudam.

**O fundo da hero é o recorte de 1440 esticado, não uma versão estendida
do asset.** O `Logo-fundo` é o "W" da marca desfocado; alargar o recorte
revelaria os lóbulos externos dele, arte que sempre esteve fora do corte.
Esticando, a borda da janela mostra sempre o mesmo tom que a borda do
design aprovado. Como o degradê é difuso, o alongamento não se percebe.

**O grid da hero é contido, em 85..1356 do canvas.** Foi testado se
espalhar de ponta a ponta e o cliente rejeitou — limitado lê como margem
intencional. Fica em px de canvas, sem esticar junto com o fundo: a célula
de 141 x 142,5 é estrutural, é nela que os quadrados soltos se encaixam.

**Breakpoint em 768px** (`MOBILE_BREAKPOINT` no `App.jsx`). Abaixo disso
entra o canvas de 390px, que é uma re-diagramação real feita no design, não
o desktop encolhido: a 390px o texto de 20px viraria 5px.

**`clientWidth` + `ResizeObserver`, não `innerWidth` + `resize`.**
`innerWidth` conta a barra de rolagem. E quando a barra aparece ela come
~15px de `clientWidth` **sem disparar `resize`** — a faixa ficava larga
demais e jogava a moldura para fora da tela.

**Fonte variável servida localmente, não Google Fonts.** A animação do preço
(seção Oferta) interpola o peso de 600 a 900 continuamente — pesos estáticos
travariam em degraus. Os WOFF2 em `public/fonts/` têm eixo `wght` 300–900.
`OFL.txt` acompanha por exigência da licença.

**`build.assetsDir = 'build'` no `vite.config.js`.** Separa o bundle
compilado (nome com hash, cacheável para sempre) das imagens em
`public/assets/`, que são substituídas mantendo o mesmo nome. Sem isso não
dá para cachear um sem congelar o outro. O `vercel.json` depende dessa
separação.

**Moldura e degradê da seção Benefícios são CSS, não PNG.** Como PNG de
1440px fixos eles não acompanhavam a tela. A moldura é `border: 20px solid
#ff2801` (medido do PNG original). O degradê é um `radial-gradient` com
elipse no meio de baixo, raios e rampa ajustados numericamente contra o
`gradiente.png` — erro médio de 1,1/255 por canal. Os raios são
percentuais, então o brilho se espalha junto com a tela.

**O anel giratório da Oferta acompanha a foto, não a borda da tela.** É o
cruzamento do texto sobre ela que precisa se manter igual em qualquer
largura. Para isso a composição da Oferta é fluida: o card estica, a foto
fica ancorada na direita com a mesma folga de 68px, o bloco de texto segue
o card e o anel segue a foto.

**Tracking calibrado por medição.** Os textos da hero foram ajustados para
bater com a arte de referência. Medidas conferidas no navegador, com a
fonte real, descontando o letter-spacing que o CSS aplica após o último
caractere:

| Texto | Largura |
|---|---|
| Sem fórmula mágica! | 350px |
| Apenas hábito & constância | 487px |
| O desafio que muda… (3 linhas) | 476px |
| Quero participar | 357px |

Se mexer em `font-size` ou `letter-spacing` na hero, re-meça.

## Trocar as fotos do carrossel

Substituir os arquivos em `public/assets/s3/` mantendo os nomes:
`antes-1.png`, `depois-1.png`, `antes-2.png`, … Proporção ideal 323×448
(retrato ~1:1,39). A ordem é sempre antes → depois. Para mudar a
quantidade de pares, editar a lista `SLIDES` em `Trajetoria.jsx` **e**
`mobile/TrajetoriaMobile.jsx`.

## Animações (as duas versões)

Brilho metalizado varrendo o título e o "30 DIAS"; tremida constante nos
CTAs, com hover invertendo as cores; fade individual dos quadrados soltos
(cada um com duração e delay próprios); marquee infinito; carrossel que
expande o card central, segura 2s e fecha; parallax na foto da Oferta;
peso do preço oscilando entre 600 e 900.

## Como verificar mudanças de responsividade

O que pegou os bugs reais foi medição, não olhar. Duas técnicas:

**Sondagem de bordas.** Para cada seção, `document.elementFromPoint` nas
colunas x=1 e x=largura-2, em cinco alturas. Se alguma devolver `null`,
existe um vão. Confere também `scrollWidth > clientWidth` para scroll
horizontal.

**Geometria de ultrawide em escala reduzida.** O painel de browser do
agente não passa de ~1060px, então não dá para *ver* 2560 diretamente.
Injetar um `<style>` forçando `--vw` e o `transform: scale()` do canvas
interno reproduz a geometria de qualquer monitor num tamanho que cabe no
painel — e com `translateX` dá para inspecionar uma faixa em 1:1. Foi
assim que apareceram a emenda de uma coluna replicada e a irregularidade
das linhas do grid.

Larguras usadas como referência: 1440, 2545, 3425 e 375.

## Pendências

- **Tablet** — não existe. Entre 768 e ~1200 a página é o desktop
  encolhido, sem diagramação própria. Sugestão em aberto: canvas de 834px
  (iPad retrato). Precisa de decisão do cliente.
- **Mobile** — o cliente considerou a versão de 390px fraca e quer refazer.
  É a principal porta de entrada do projeto. Falta decidir se parte do que
  existe ou rediagrama no Claude Design, e quais seções entram.
- **Favicon** — não existe; o navegador pede `/favicon.ico` e recebe 404.
  É o único erro de console. Aguardando o ícone da marca.
- **Seção 4** — prevista entre Trajetória e Oferta, ainda não desenhada.
- **Fotos reais do carrossel** — hoje as 6 posições usam 2 fotos-modelo.
- **`ctaHref`** — aponta para `#inscricao` (`src/App.jsx`), ainda sem
  destino real.

## Fluxo de trabalho

Novas seções nascem no Claude Design, **nas duas larguras** (1440 e 390).
O export do Design entra em `design/`, e daí é implementado no React.

Deploy: a `main` publica em produção automaticamente. O combinado é
trabalhar em branch, conferir a preview que a Vercel gera para ela e só
então integrar na `main`.

Para uma sessão de agente ter acesso de escrita ao repositório, ela precisa
ser iniciada **a partir do repositório** — sessões abertas de outra origem
conseguem ler, mas não dar push.
