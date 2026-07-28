# Inventário da arte-fonte

Catálogo do export por camadas do design — o material bruto de onde saíram
as imagens de `public/assets/`. Serve para responder duas perguntas sem ter
que abrir o design de novo: *de onde veio este asset?* e *o que ainda não
foi aproveitado?*

Levantado em 28/07/2026.

## Onde está

Fora do repositório, em `../arte-fonte/` (irmã da pasta do projeto). São
78 arquivos, 45 MB, organizados por seção.

**A pasta não é versionada.** Se ela sumir dessa máquina, some junto a
única cópia local dos originais em alta — inclusive a foto master de 28 MB.
Vale guardar em outro lugar antes de contar com ela.

## Como este inventário foi feito

Comparação por SHA-256 de cada arquivo da fonte contra cada arquivo de
`public/assets/`. Onde a tabela diz que um asset "já está no repo", é
igualdade byte a byte, não semelhança de nome ou de dimensão.

Resultado: **36 dos 78 arquivos já foram importados**, 42 não.

## Nomenclatura das pastas

| Pasta | O que é |
|---|---|
| `Hero` | Hero no canvas de 1440 |
| `Hero S` | Mesma hero com os fundos **estendidos** para tela larga |
| `S2` | Benefícios |
| `SS2` | Benefícios, **revisão posterior** de `S2` (ver abaixo) |
| `S3` | Trajetória (carrossel antes/depois) |
| `S5` | Oferta |

`Hero S` **não é a versão mobile** — apesar do "S", os assets são maiores,
não menores. O `Foto-Waleska.png` dele é o que virou `hero-foto-wide.png`.
Não há nada em canvas de 390px na arte-fonte; a arte do mobile não existe.

Não há pasta `S4` — coerente com a Seção 4 estar listada como pendência.

---

## O que ainda não foi aproveitado

### Fundos estendidos da hero — `Hero S/`

| Arquivo | Fonte | Equivalente no repo |
|---|---|---|
| `Logo-fundo.png` | **2040×1740** | `logo-fundo.png` 1440×1024 |
| `Luz.png` | **2071×1590** | `luz.png` 1216×660 |

O `CONTEXTO.md` registra, na seção de decisões, que o fundo da hero é o
recorte de 1440 esticado *porque* não havia versão estendida e alargar o
corte revelaria os lóbulos externos do "W".

Esses dois arquivos são a versão estendida. O `Logo-fundo` de 2040×1740 é o
"W" inteiro, com os lóbulos que estavam fora do corte — e 2040 é exatamente
o `DESKTOP_BLEED` do código, o que sugere export feito sob medida para esse
problema.

Trocar não é só apontar para outro arquivo: a decisão de esticar continua
valendo enquanto ninguém aprovar o desenho com os lóbulos à mostra. É uma
mudança de aparência, não de implementação.

### Título em vetor — `Hero/Título.svg`

729×310, 40 KB, **vetor de verdade**: 12 `<path>` e 8 gradientes lineares,
zero raster embutido. Hoje o repo usa `titulo.png` nas mesmas dimensões.

Interessa porque acima de 2040px a escala do canvas passa de 1 e o PNG
começa a borrar. Antes de trocar, conferir se o brilho metalizado que varre
o título continua funcionando sobre SVG.

### Gradiente grande da Benefícios — `SS2/Gradiente.png`

3543×1832, contra 1440×862 do `S2/Gradiente.png` (que é o que está no repo).

Cuidado aqui: o `CONTEXTO.md` diz que esse degradê **foi reescrito em
`radial-gradient` CSS de propósito**, com raios percentuais para acompanhar
a tela, e erro médio de 1,1/255 por canal contra o PNG. O CSS escala sem
limite e não pesa nada. Voltar ao PNG provavelmente é retrocesso — o
arquivo serve mais como referência de conferência do que como substituto.

### Foto master — `S5/C0202178.png`

4000×6000, 27 MB. Nome de arquivo de câmera; é o original de onde saíram os
recortes da Oferta. Qualquer recorte novo da Waleska sai daqui em vez de
ampliar os PNGs pequenos.

Nunca deve entrar em `public/` — 27 MB no bundle.

### Revisão dos ícones da Benefícios — `SS2/`

`SS2` é `S2` revisado. Comparando os homônimos:

| | |
|---|---|
| Idênticos | `Borda`, `Top box`, `Texto - Desafio da Waleska`, `Título`, ícones 2, 4, 5, 6, 7 |
| Diferentes | `Gradiente` (muito maior), **ícone 1**, **ícone 3** |
| Só em `SS2` | os 7 textos de benefício, separados |

**O repo está usando os ícones 1 e 3 da versão antiga.** Mesmas dimensões
(100×100), desenho diferente. Se a revisão foi aprovada, esses dois estão
desatualizados na página — vale confirmar com o cliente qual é a boa.

### Rótulos exatos dos benefícios — `SS2/`

O `S2` traz os textos agrupados em duas tiras (`Textos 1.png`,
`Textos 2.png`). O `SS2` traz um arquivo por item, e o nome do arquivo dá o
texto exato:

1. Consulta com endocrinologista
2. Consulta com nutricionista e plano alimentar individualizado
3. Cardápio, lista de substituição e receitas
4. Treinos para fazer em casa
5. Check-ins semanais e sistema de selos
6. Grupo exclusivo da turma
7. Suporte da equipe durante os 30 dias

### Textos que na página são HTML

Vários PNGs da fonte nunca foram importados porque o texto correspondente é
renderizado em Red Hat Display no navegador: `Hero/Texto-1`, `Texto-2`,
`Texto-botão`, `Botão`, `S2/Título`, `S3/Título`, `S3/Texto - Antes`,
`S5/Texto principal`, `S5/Box branco`, `Top box`,
`Texto - Desafio da Waleska` (1440×85, o marquee).

Isso é intencional — é o que permite o tracking calibrado e a animação de
peso do preço. Os PNGs valem como **gabarito de conferência**: são a medida
de como o texto deveria ficar. A tabela de larguras no `CONTEXTO.md` saiu
desse tipo de comparação.

`S3/Carrossel - Imagens.png` (1440×450) é o layout de referência do
carrossel montado, não um asset de uso.

---

## Assets do repo sem origem na fonte

Quatro arquivos de `public/assets/` não vêm de lá — foram feitos ou
reprocessados durante a implementação:

| Arquivo | O que é |
|---|---|
| `hero-foto-wide.png` | `Hero S/Foto-Waleska.png` recomprimido (959 KB → 266 KB, mesmas dimensões) |
| `s5/foto-cf-ext.png` | 630×603, **maior** que o `S5/Foto Wal CF.png` de 594×543 — foi estendida na mão |
| `s2/icone-6.svg` | Redesenhado como traço (`stroke` de 6,2px), 556 bytes contra 2,4 KB do `Ícone 6.svg` da fonte, que é preenchido |
| `s5/ring-text.svg` | 673×673, o anel giratório — não existe na fonte |

## Mapa completo

Formato: `arquivo da fonte → asset no repo`. "—" é não importado.

### Hero
```
30-Dias.png            217x57      → 30-dias.png
Borda-Laranja-1..4.png 142x143     → borda-1..4.png
Quad-Laranja-1..2.png  142x143     → quad-1..2.png
Foto-Waleska.png       943x1024    → foto-waleska.png
Grid.png               1271x855    → grid.png
Logo-fundo.png         1440x1024   → logo-fundo.png
Luz.png                1216x660    → luz.png
Título.png             729x310     → titulo.png
Título.svg             729x310     → —   (vetor)
Botão.png              424x143     → —   (é HTML)
Texto-1.png            489x38      → —   (é HTML)
Texto-2.png            477x66      → —   (é HTML)
Texto-botão.png        357x19      → —   (é HTML)
```

### Hero S
```
Logo-fundo.png         2040x1740   → —   (fundo estendido)
Luz.png                2071x1590   → —   (luz estendida)
Foto-Waleska.png       1218x1500   → hero-foto-wide.png (recomprimido)
Grid.png               1271x855    → grid.png
Borda/Quad-Laranja     142x143     → borda-*/quad-*
30-Dias, Título, Botão, Texto-1/2/botão  → iguais aos da pasta Hero
```

### S2 / SS2
```
Borda.png              1440x939    → s2/borda.png
Gradiente.png (S2)     1440x862    → s2/gradiente.png
Gradiente.png (SS2)    3543x1832   → —
Ícone 1.png (S2)       100x100     → s2/icone-1.png
Ícone 1.png (SS2)      100x100     → —   (revisão)
Ícone 2.png            100x100     → s2/icone-2.png
Ícone 3.png (S2)       100x100     → s2/icone-3.png
Ícone 3.png (SS2)      100x100     → —   (revisão)
Ícone 4.png            92x92       → s2/icone-4.png
Ícone 5.png            100x100     → s2/icone-5.png
Ícone 6.png            114x116     → —   (repo usa SVG redesenhado)
Ícone 7.png            100x100     → s2/icone-7.png
Título, Top box, Texto - Desafio da Waleska, Textos 1/2  → —  (é HTML)
7 textos de benefício (SS2)                              → —  (é HTML)
```

### S3
```
Antes-1.png            210x430     → s3/antes-1.png, antes-2, antes-3
Depois-1.png           210x430     → s3/depois-1.png, depois-2, depois-3
Broda.png              329x488     → s3/moldura.png   (o nome é typo de "Borda")
Carrossel - Imagens.png 1440x450   → —   (layout de referência)
Título, Texto - Antes              → —   (é HTML)
```

As seis posições do carrossel usam duas imagens repetidas — na fonte só
existe um par. Bate com a pendência "fotos reais do carrossel".

### S5
```
Foto Wal SF.png        653x628     → s5/foto-sf.png
Foto Wal CF.png        594x543     → —   (repo usa versão estendida de 630x603)
C0202178.png           4000x6000   → —   (master da câmera)
Box branco.png         1270x543    → —   (é CSS)
Texto principal.png    541x307     → —   (é HTML)
```

### Raiz
```
Ícone 6.svg            114x116     → —   (repo usa versão redesenhada em traço)
```
