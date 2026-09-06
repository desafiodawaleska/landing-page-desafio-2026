# Arte original em PNG

Os PNGs que estavam em `public/assets/` e foram substituidos pelos `.webp`
equivalentes. A troca cortou 5,16 MB (81%) do peso da pagina.

Ficam aqui, fora de `public/`, porque tudo que esta em `public/` e copiado
para o deploy — mante-los la significaria subir 6 MB que nenhum navegador
baixa. Continuam versionados: sao a fonte para regerar os WebP se a
qualidade precisar de ajuste.

Para regerar (o projeto usa `sharp` sem instalar como dependencia fixa, o
mesmo padrao de `tools/`):

```bash
npm i --no-save sharp
node -e "require('sharp')('arte-original/assets/luz.png').webp({quality:90,effort:6}).toFile('public/assets/luz.webp')"
```
