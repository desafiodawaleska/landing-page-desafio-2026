# Desafio da Waleska — 30 dias

Landing page de campanha. React + Vite, deploy na Vercel a partir da `main`.

## Rodar localmente

```bash
npm install
npm run dev
```

Sobe em `http://localhost:5173`. Para o build de produção, `npm run build`.

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

## Ponto de atenção

Este projeto **não é layout fluido**. É um canvas de largura fixa (1440px
no desktop, 390px no mobile) escalado por `transform`, porque a arte depende
de sobreposições precisas. Antes de trocar posicionamento absoluto por
flex/grid, leia o CONTEXTO — provavelmente vai quebrar a composição.

Em 1440px de janela, todas as contas de responsividade devolvem os valores
originais do design. É o teste rápido para saber se uma mudança quebrou
algo: se a página em 1440 saiu do lugar, saiu.
