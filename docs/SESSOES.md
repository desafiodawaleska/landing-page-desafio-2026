# Histórico de sessões

Registro do que foi decidido em cada sessão e por quê. O `CONTEXTO.md` diz
como as coisas *são*; este arquivo diz como chegaram lá, incluindo os
caminhos errados — para ninguém refazê-los.

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
