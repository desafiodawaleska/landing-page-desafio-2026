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
  sections/Loading.jsx tela de abertura (fora da hero — ver seção própria)
  sections/tablet/     tablet, 768–1024, fluido (não usa ScaledCanvas)
  sections/mobile/     mobile, canvas de 390px
public/assets/         imagens da identidade visual
public/fonts/          Red Hat Display variável (WOFF2)
design/                protótipos .dc.html do Claude Design + transcrições
docs/                  este arquivo, o histórico de sessões e o inventário
                       da arte-fonte
```

Fora do repositório, em `../arte-fonte/`, fica o export por camadas do
design — a origem das imagens de `public/assets/`. O `ARTE-FONTE.md` mapeia
o que já foi importado e o que sobrou, e registra que essa pasta **não é
versionada**: é a única cópia local dos originais em alta.

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

**A escala respeita a altura da janela nos dois sentidos.** `fitHeight` é a
altura da hero (1024). A escala nunca deixa a hero passar da altura da tela,
seja encolhendo, seja limitando o quanto ela cresce.

Isso já valia para cima — em ultrawide 2560x1080 a hero ficava com 1285px e o
CTA caía fora. Mas até 28/07 **não valia para baixo**: havia um piso em 1, e
entre 1440 e 2040px de largura a hero ficava travada em 1024px de altura. Como
quase toda janela de desktop é mais larga e mais baixa que a proporção
1440x1024 do design, o CTA caía abaixo da dobra em máquinas comuns — MacBook
13" e 14" incluídos.

O piso agora é `DESKTOP_MIN_SCALE` (0,62), calibrado pela legibilidade: abaixo
disso o texto de 20px da hero cairia de 12,4px. Em janela mais baixa que isso,
a página volta a rolar — é o limite onde encolher custa mais do que vale.

Em 1440x1024 a conta devolve escala 1, então o design de referência não mudou.

Efeito colateral conhecido: encolher a escala aumenta `--vw`, e o grid, que
tem largura fixa em px de canvas, passa a ocupar uma fração menor da tela.
Medido, a perda vai de 0 a 20 pontos percentuais conforme a janela, e o pior
caso (68%) ainda fica bem acima dos ~50% que já rodavam em ultrawide antes da
mudança. Não é regressão — é mais do mesmo que já estava aprovado.

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
| O desafio que muda… (3 linhas) | 478px |
| Quero participar | 357px |

Se mexer em `font-size`, `letter-spacing` **ou `font-weight`** na hero, re-meça.
O peso conta: o handoff de 28/07 trocou o "O desafio que muda…" de 500 para
600 e a linha mais larga passou de 476 para 478px.

Para medir, use um `Range` sobre o nó de texto, não o `getBoundingClientRect`
do elemento — os `span` do kicker são `display: block` dentro de um `<p>` de
620px, então a caixa devolve 620 e não a largura do texto.

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

## Tablet (768–1024) — a exceção à regra do canvas

**É a única das três versões que não usa canvas de largura fixa.** O design
veio fluido: 69 `clamp()`, 54 `vw`, `min-height: 100svh`, flex e grid, contra
236 medidas em px e 55 `position: absolute` do desktop. Não passa pelo
`ScaledCanvas`, não tem faixa de sangria e não usa `--vw`.

Fica em `src/sections/tablet/`, com as classes em `-t` (`.hero-t`,
`.beneficios-t`…), como o mobile usa `-m`.

**Por que para em 1024.** É o `max-width` do container no design. Fechando a
faixa exatamente nele, o limite nunca chega a travar dentro do intervalo — o
layout sempre preenche a janela e não sobra barra lateral do `#160100`. O
custo é a faixa de 1024 a ~1440 continuar como desktop encolhido. Foi escolha
do cliente, entre as duas.

**Os quadrados soltos ficam em % da caixa do grid**, não do canvas. A caixa
tem `aspect-ratio: 1271/855` fixo, então a grade não deforma e os quadrados
continuam caindo nas células — é o que substitui o canvas fixo aqui.

**Moldura e degradê da Benefícios são CSS, como no desktop.** O protótipo
estica `borda.png` e `gradiente.png` a 100%x100%, mas esticar a moldura deixa
o traço mais grosso na horizontal que na vertical. A borda usa
`clamp(11px, 1.39vw, 14px)` — 1,39% é a proporção dos 20px do desktop.

**A tabela de larguras calibradas não vale aqui.** O texto reflui
(`max-width: 22ch`, sem `nowrap`) em vez de ter as quebras na mão, e o CTA se
dimensiona pelo conteúdo em vez de ser uma caixa de 424x143.

A largura do card do carrossel sai de `min(300, max(186, largura * 0.31))`,
medida do próprio trilho com `ResizeObserver`. Tudo que era medida fixa no
desktop virou razão sobre os 329px do card original.

## Tela de loading (só desktop)

Abertura de 3s: o título entra pequeno no centro da janela, estoura, assenta
e nos últimos 8% viaja até a posição exata do título da hero, onde o de
verdade assume. Os elementos da hero entram escalonados atrás, de 1,95s a
2,58s.

**Tudo passa por `--ld`**, que vale 1 com a intro ligada e 0 sem ela. Durações
e atrasos são `calc(<valor> * var(--ld, 1))`, então com 0 a duração vira 0s,
o preenchimento `both` aplica o estado final e a página aparece direto — sem
sobrar nem o deslocamento de 14px do `fade-rise`. É o mesmo mecanismo do prop
`showLoading` do protótipo.

**O componente fica fora da `<section>` da hero**, na raiz do canvas e depois
de todas as seções. A `.hero` tem `isolation: isolate`, que cria um contexto
de empilhamento: de dentro dela, nenhum `z-index` passa por cima das seções
seguintes, e a Benefícios aparecia por baixo do fundo do loading. Foi por isso
que ele saiu de lá.

**O fundo cobre a janela, não o canvas.** Usa `--vw` e `--vh` (esta última
adicionada ao `ScaledCanvas` para isso). Só a altura da hero não bastaria: em
janela alta — 1280x1024, por exemplo — os 1024px de canvas não chegam a
preencher a tela. `position: fixed` não serve como alternativa, porque o
`transform: scale()` do canvas vira bloco de contenção e o `fixed` passaria a
se ancorar nele.

**A intro não roda com `prefers-reduced-motion: reduce`** — são 3s de tela
cheia antes do conteúdo, exatamente o caso que a preferência existe para
evitar. Também não roda no mobile: o design mobile veio sem ela.

A rolagem fica travada durante os 3s (`App.jsx`). Sem isso, rolar no meio da
abertura passa por baixo do fundo, que é ancorado no topo do canvas.

O `--ld` serve de câmera lenta para conferir: subir para 10 espalha a intro
por 30s sem mudar proporção nenhuma.

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

- **Faixa de 1024 a ~1440** — continua sendo o desktop encolhido, sem
  diagramação própria. É a contrapartida aceita ao fechar o tablet em 1024
  (ver abaixo); foi decisão do cliente, não esquecimento.
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
