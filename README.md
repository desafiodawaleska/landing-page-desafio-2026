# Desafio da Waleska — 30 dias

Landing page de campanha. React + Vite, deploy na Vercel a partir da `main`.

## Rodar localmente

Precisa de Node 20.19 ou mais novo (a `.nvmrc` fixa a 22, que é a que a
Vercel usa no build).

```bash
npm ci
npm run dev
```

Sobe em `http://localhost:5173`. Para o build de produção, `npm run build`.

> Trocando de máquina (Windows ↔ macOS): apague `node_modules` antes do
> `npm ci`. O `esbuild` e o `sharp` trazem binário compilado por
> sistema/arquitetura, e a pasta copiada de outra máquina não roda.

## Domínio

O domínio público fica em **uma linha só**, `VITE_SITE_URL` no `.env`. Dele
saem o `canonical`, as tags Open Graph/Twitter e o JSON-LD do `index.html`,
mais o `robots.txt` e o `sitemap.xml`, gerados no build.

Enquanto o valor for `https://SEU-DOMINIO.com.br`, a LP funciona normalmente
— só os metadados de compartilhamento é que apontam para um domínio que não
existe. Trocar antes de divulgar o link.

## Destino do CTA

Os nove botões da página leem `CHECKOUT_URL` de `src/config.js`. Com o campo
vazio, todos rolam até a seção Oferta (âncora `#inscricao`). Preencher com a
URL do checkout liga os nove de uma vez.

## Publicar

O passo a passo de GitHub, Vercel e DNS na GoDaddy está em
**[docs/DEPLOY.md](docs/DEPLOY.md)**, incluindo as pegadinhas da GoDaddy
(o registro `A` de estacionamento e o "Forwarding") que quebram o domínio
de formas difíceis de diagnosticar.

## Antes de mexer no código

Leia **[docs/CONTEXTO.md](docs/CONTEXTO.md)**. Ele registra as decisões já
tomadas e o motivo de cada uma — várias parecem estranhas fora de contexto
e existem para resolver um problema específico. Desfazer por engano custa
caro.

O **[docs/SESSOES.md](docs/SESSOES.md)** tem o histórico: o que foi tentado,
o que o cliente rejeitou e quais caminhos deram errado. Vale a leitura antes
de propor uma abordagem "nova" que já foi descartada.

Os protótipos em `design/` são a fonte da verdade do visual. São arquivos
`.dc.html` exportados do Claude Design; abrem no navegador, mas as imagens
que eles referenciam não acompanham o export — para ver a arte, use o
projeto rodando.

## Ferramentas de medição

Vários valores no CSS não foram escolhidos a olho — saíram de medição sobre
os PNGs originais. Os scripts em `tools/` reproduzem essas contas, para não
virarem números mágicos:

```bash
npm i --no-save sharp
node tools/medir-assets.mjs        # célula do grid, traço da moldura, opacidade dos fundos
node tools/ajustar-gradiente.mjs   # deriva o radial-gradient da seção Benefícios
```

`sharp` fica fora do `package.json` de propósito: só serve para a análise e
pesaria no install de quem só quer buildar o site.

## Ponto de atenção

Este projeto **não é layout fluido**. É um canvas de largura fixa (1440px
no desktop, 390px no mobile) escalado por `transform`, porque a arte depende
de sobreposições precisas. Antes de trocar posicionamento absoluto por
flex/grid, leia o CONTEXTO — provavelmente vai quebrar a composição.

Em 1440px de janela, todas as contas de responsividade devolvem os valores
originais do design. É o teste rápido para saber se uma mudança quebrou
algo: se a página em 1440 saiu do lugar, saiu.
