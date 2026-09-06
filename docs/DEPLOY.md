# Publicar: GitHub → Vercel → domínio Registro.br

Ordem importa. Cada etapa depende da anterior estar de pé.

---

## 1. Antes de qualquer coisa: um campo

Sem ele a LP sobe, mas sobe sem converter.

| Onde | Campo | O que acontece se ficar como está |
|---|---|---|
| `src/config.js` | `CHECKOUT_URL` | Os nove CTAs rolam até o preço e param ali — ninguém consegue comprar |

`CHECKOUT_URL` vazio **não quebra** a página: é um estado intermediário
válido para publicar e testar. `VITE_SITE_URL` (`.env`) já está preenchido
com `https://www.desafiodawal.com.br`.

---

## 2. GitHub

**Feito.** O repositório oficial é
[`desafiodawaleska/landing-page-desafio-2026`](https://github.com/desafiodawaleska/landing-page-desafio-2026),
branch `main`, com tudo integrado — CTA corrigido, imagens otimizadas, SEO e
domínio.

Esse repositório é separado do repositório pessoal onde o projeto foi
desenvolvido (`eusouandrew/Desafio-30-dias`), que continua existindo como
histórico de trabalho mas não é mais para onde apontar o deploy.

Para atualizações futuras, o fluxo é o padrão: branch → PR ou push direto em
`main` → a Vercel publica sozinha a partir dela.

---

## 3. Vercel

O `vercel.json` já traz tudo configurado: framework, comando de build, pasta
de saída, cache e cabeçalhos de segurança. Não precisa mexer no painel além
de ligar o repositório.

Projeto ainda não existe: **Add New → Project → importar
`desafiodawaleska/landing-page-desafio-2026`**. As opções de build vêm do
`vercel.json`; deixe como a Vercel detectar.

Confira em **Settings → Git** que a Production Branch é `main`.

---

## 4. Domínio no Registro.br

`desafiodawal.com.br` foi comprado no Registro.br, não na GoDaddy — a
gestão de DNS de um `.com.br` fica sempre lá, mesmo que o registrador
mostrado em algum lugar seja outro.

### 4.1 Na Vercel

**Settings → Domains → Add**. Some o domínio raiz (`desafiodawal.com.br`) e
também o `www` (`www.desafiodawal.com.br`, que é o valor de `VITE_SITE_URL`
hoje). A Vercel mostra os registros que ela quer — use os que **ela**
exibir; os abaixo são os valores padrão dela hoje.

Marque **`www.desafiodawal.com.br` como o domínio principal** (é o que está
no `.env`) — a Vercel redireciona a raiz para ele sozinha.

### 4.2 No Registro.br

Login em [registro.br](https://registro.br) → **Meus domínios** →
`desafiodawal.com.br` → aba **DNS**.

O domínio nasceu no modo **"DNS Simples"** (nameservers automáticos
`a.auto.dns.br` / `b.auto.dns.br`, que também assinam o DNSSEC sozinhos).
Esse modo não deixa adicionar registro `A`/`CNAME` direto — é por isso que
existe o botão para migrar ao **"nível avançado"**. A migração é interna do
Registro.br (troca de `auto.dns.br` para os nameservers próprios de zona
avançada deles) e por relato leva **cerca de 2 horas** para ativar. Não mexe
no domínio em outros registradores nem exige recriar o DNSSEC — ele é
preservado pela própria migração.

> **Não confundir com "Alterar Servidores DNS".** Essa é outra tela, que
> delega o DNS inteiro para um terceiro (por exemplo, os nameservers da
> própria Vercel, `ns1.vercel-dns.com` / `ns2.vercel-dns.com`). Funcionaria,
> mas exigiria recriar manualmente qualquer registro que não seja o do site
> (e-mail, TXT de verificação etc.) do zero na Vercel, e quebra o DNSSEC
> atual se não for coordenado. Para este domínio, ficar na infraestrutura do
> próprio Registro.br (nível avançado) é o caminho mais simples e seguro.

Depois que o nível avançado ativar, a tela vira o editor de zona. Adicione:

| Tipo | Nome | Dados/Valor | TTL |
|---|---|---|---|
| `A` | (deixar em branco, ou `@`) | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com.` | 3600 |

Cuidados específicos do Registro.br:

- O campo de nome para o registro raiz costuma ficar **vazio** na interface
  deles (não `@` como na maioria dos provedores) — o próprio painel indica
  qual convenção usar.
- **O valor do CNAME precisa terminar com ponto** (`cname.vercel-dns.com.`)
  — é a notação de FQDN que o editor de zona do Registro.br exige; sem o
  ponto final ele às vezes concatena o domínio de novo no final.
- Registro.br **não deixa outro registro convivendo com um CNAME no mesmo
  nome** (regra do DNS, não peculiaridade deles) — se já existir algo em
  `www`, apague antes de criar o CNAME.
- O DNSSEC segue ativo e funcionando com esses registros — a migração para o
  nível avançado é quem cuida disso, nada a fazer aqui.

### 4.3 Esperar

Some a espera da migração para o nível avançado (~2h, ver 4.2) com a
propagação do DNS em si, que leva de alguns minutos a algumas horas — no
Registro.br, às vezes até 24h, por causa do TTL antigo em cache nos
resolvedores. A Vercel emite o certificado HTTPS sozinha assim que o DNS
resolver — não há nada a fazer além de esperar o painel sair de "Invalid
Configuration" para "Valid".

Para conferir sem depender do cache do navegador:

```bash
dig +short desafiodawal.com.br
dig +short www.desafiodawal.com.br
```

### 4.4 Depois que o domínio responder

`VITE_SITE_URL` já está com `https://www.desafiodawal.com.br` (feito e
publicado). Falta só:

1. Confirmar em **Settings → Domains** que `www.desafiodawal.com.br` é o
   domínio principal — tem que ser o mesmo que está no `VITE_SITE_URL`,
   senão o canonical aponta para o que redireciona.
2. Testar o card de compartilhamento no
   [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   — é ele que o WhatsApp usa de cache.

---

## 5. Checklist final

- [x] `VITE_SITE_URL` com o domínio real (`www.desafiodawal.com.br`)
- [x] Repositório oficial no ar (`desafiodawaleska/landing-page-desafio-2026`, branch `main`)
- [x] Projeto criado na Vercel, importando o repositório oficial
- [x] Domínio adicionado na Vercel
- [ ] `CHECKOUT_URL` preenchido e testado clicando nos três CTAs (hero, vídeo, oferta)
- [ ] Nível avançado do DNS ativo no Registro.br e registros `A`/`CNAME` criados
- [ ] Domínio raiz e `www` respondendo em HTTPS
- [ ] Card de compartilhamento aparecendo no WhatsApp
- [ ] LP aberta no celular de verdade, não só no emulador
