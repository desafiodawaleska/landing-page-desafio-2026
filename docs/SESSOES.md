# Histórico de sessões

Registro do que foi decidido em cada sessão e por quê. O `CONTEXTO.md` diz
como as coisas *são*; este arquivo diz como chegaram lá, incluindo os
caminhos errados — para ninguém refazê-los.

---

## 28/07/2026 (tarde) — Tela de loading

Branch `loading-intro`. Veio de um handoff do Claude Design
(`Landing page hero 5K9 2K25-handoff.zip`).

### O que o handoff trouxe

Duas coisas, não uma: o arquivo novo do **tablet** e uma **tela de loading**
acrescentada ao desktop. Só o loading foi implementado; o tablet ficou para
depois da decisão de arquitetura (ver Pendências no `CONTEXTO.md`).

Dos 44 assets do zip, 31 já estavam no repo byte a byte — é o mesmo pipeline
que gerou `public/assets/`, então o encaixe é direto. Entrou só
`loading/fundo.png`; o título do loading reusa o `titulo.png` que já existia.

### Dois bugs que a implementação encontrou

**O loading não cobria a página.** Seguindo o protótipo, pus o loader dentro
da `<section class="hero">`. A `.hero` tem `isolation: isolate`, que cria um
contexto de empilhamento — de dentro dela nenhum `z-index` passa por cima das
seções seguintes, e a Benefícios aparecia por baixo. O loader saiu para a raiz
do canvas, depois de todas as seções. É o caso em que **não** copiar a
estrutura do protótipo era o certo.

**O CTA entrava visível.** `.hero__cta` e `.cta` (do `styles.css`) têm a mesma
especificidade e as duas declaram `animation`; a segunda vence na cascata e
apagava o `fade-rise`. Resolvido com `.cta.hero__cta`. Se aparecer de novo em
outro elemento com as duas classes, é isso.

### Erro meu, registrado de propósito

Li o gradiente bege do `loading/fundo.png` como sendo o fundo da hero e
concluí que o loader não estava pintando. Perdi duas rodadas atrás de um bug
de empilhamento que não existia ali — o loader pintava, o que faltava era
cobrir **abaixo** da hero. Bastava ter aberto o PNG antes de teorizar. Mesma
lição das "manchas escuras" da sessão anterior: olhar o asset custa segundos.

### Como conferir a intro

`--ld` multiplica todas as durações e atrasos. Subir para 10 espalha os 3s por
30s, sem mudar proporção nenhuma. Para conferir quadro a quadro, `pause()` +
`currentTime` em `document.getAnimations()` e leitura do `getComputedStyle` —
**não** confie no screenshot com as animações pausadas: opacidade roda no
compositor e a captura sai dessincronizada da linha do tempo.

Conferido: em 1440x1024 o `--ld-x`/`--ld-y` dão 218,5 e 89, os valores fixos
do design; no pouso, o título do loading e o real coincidem com 0px de
diferença nos quatro lados; os 11 elementos da hero saem de 0 e chegam a 1.

### Mudança que pegou carona

O handoff trocou o peso do "O desafio que muda…" de 500 para 600. A largura
da linha foi de 476 para 478px e a tabela do `CONTEXTO.md` foi corrigida.

### Depois: o tablet

Implementado na sequência, fluido como veio no design — a primeira das três
versões que não usa o `ScaledCanvas`.

A decisão que faltava era até onde ele vai. As duas opções tinham custo:
parar em 1024 deixa a faixa de 1024 a ~1440 como desktop encolhido; ir até
~1280 faz o `max-width: 1024px` do design travar e reaparecerem as barras
laterais do `#160100` — justamente o bug da sessão anterior. **O cliente
escolheu parar em 1024**, aceitando o desktop encolhido acima disso.

Duas coisas foram implementadas diferente do protótipo, de propósito:
moldura e degradê da Benefícios em CSS (esticar `borda.png` a 100%x100%
engrossa o traço na horizontal), e `ResizeObserver` em vez de evento de
`resize` para medir o trilho do carrossel.

---

## 28/07/2026 — Responsividade em telas largas

Commits `6eabad7`, `ff4bfe1`, `b3c693d`, `3b4c06b`. Integrados na `main` e
publicados em produção.

### O problema de origem

Em monitor largo apareciam barras escuras nas laterais. Duas causas
empilhadas: o canvas centralizava uma caixa de 1440px e deixava o
`background` do `body` exposto, e toda seção tinha `overflow: hidden` em
1440px, então recortaria qualquer sangria de volta.

Resolvido com as faixas de sangria descritas no `CONTEXTO.md`.

### Ajustes pedidos depois, em ultrawide 2560x1080

1. **CTA fora da tela.** A hero ficava com 1285px de altura. A escala
   passou a respeitar a altura da janela quando amplia.
2. **Grid virando um box no centro.** Ele tinha 1271x855 parado no meio do
   canvas. Testei espalhar de ponta a ponta e **o cliente rejeitou** —
   preferiu contido, que lê como margem intencional. Voltou ao original.
3. **Moldura da Benefícios presa aos 1440.** Virou borda CSS de ponta a
   ponta, e o degradê virou `radial-gradient` ajustado numericamente.
4. **Anel da Oferta deixando de cruzar a foto.** Eu tinha ancorado na
   borda da tela; passou a acompanhar a foto.

### Erros meus, registrados de propósito

**Diagnóstico errado das "manchas escuras".** O cliente reportou áreas
mais escuras nas pontas. Concluí que eram os lóbulos externos do "W" do
`Logo-fundo` sendo revelados pela faixa mais larga, e reescrevi o fundo com
base nisso. Estava errado. Quando finalmente **medi** as descontinuidades
nas camadas de fundo, nenhum salto passava de 0,7/255 — não havia estrutura
nenhuma ali.

A causa real: `logo-fundo.png` é semitransparente e a cor de base creme
estava na `<section>` de 1440px. Fora dela, a transparência caía sobre o
`#160100` do body, desenhando um retângulo em canvas 0..1440. O cliente
vinha apontando isso desde o início — primeiro pelas duas bordas
verticais ("na esquerda e na direita"), depois pela região inteira.

Lição: eu me convenci de uma explicação plausível antes de medir. A
medição levou dois minutos e teria economizado dois commits.

A mudança de não revelar mais arte (esticar o recorte de 1440 em vez de
expor o que estava cortado) ficou de pé por ser mais previsível, mas não
era ela que resolvia o problema relatado.

**Grid em `repeating-linear-gradient`.** Tentei desenhar as linhas em CSS.
Com origem fracionária, ~17 repetições e escala não inteira, as linhas caem
em pixels quebrados e saem com espessuras irregulares — o cliente chamou de
"porca", com razão. Se precisar disso de novo, use o PNG do desenho
original: o anti-aliasing já vem embutido.

### Bug encontrado no caminho

Quando a barra de rolagem aparece, ela come ~15px de `clientWidth` **sem
disparar `resize`**. A faixa ficava larga demais e jogava a moldura 7,5px
para fora da tela de cada lado. Corrigido com `ResizeObserver`.

### Assets

Saíram: `hero-fundo-wide.png`, `hero-luz-wide.png`, `gradiente-wide.png`,
`grid-tile.png` — todos tentativas abandonadas. Entrou:
`hero-foto-wide.png`, que é a foto da hero com mais corpo, necessária para
ela continuar encostada na borda direita em telas largas.

### Onde paramos

Desktop e ultrawide fechados e em produção. O próximo assunto é o
**mobile**, que o cliente considera a principal porta de entrada e quer
refazer. Falta a decisão dele: partir dos 390px que já existem ou
rediagramar no Claude Design.
