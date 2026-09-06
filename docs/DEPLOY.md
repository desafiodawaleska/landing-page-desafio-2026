# Publicar: GitHub → Vercel → domínio GoDaddy

Ordem importa. Cada etapa depende da anterior estar de pé.

---

## 1. Antes de qualquer coisa: dois campos

Sem esses dois preenchidos a LP sobe, mas sobe furada.

| Onde | Campo | O que acontece se ficar como está |
|---|---|---|
| `.env` | `VITE_SITE_URL` | Compartilhar o link no WhatsApp puxa imagem e canonical de um domínio que não existe |
| `src/config.js` | `CHECKOUT_URL` | Os nove CTAs rolam até o preço e param ali — ninguém consegue comprar |

`CHECKOUT_URL` vazio **não quebra** a página: é um estado intermediário
válido para publicar e testar. `VITE_SITE_URL` errado atrapalha só o
compartilhamento, não a navegação.

---

## 2. GitHub

O repositório já existe: `eusouandrew/Desafio-30-dias`. O trabalho está na
branch `integracao`, e é ela que tem tudo o que foi feito.

```bash
git push origin integracao
```

Isso publica a branch e faz a Vercel gerar uma **preview** com URL própria,
sem tocar em produção. Confira a preview antes do passo seguinte.

Aprovada, integre:

```bash
git checkout main
git merge integracao
git push origin main
```

> **Atenção — a produção está desatualizada.** A `main` está 17 commits atrás
> da `integracao`. Tudo que veio depois de "Versiona os scripts que derivaram
> os números do CSS" — loading, layout tablet, mobile completo, Vídeo, FAQ,
> carrossel com as fotos reais — nunca chegou ao ar. O merge acima é o que
> corrige isso, e é uma mudança grande de uma vez: vale olhar a preview com
> calma antes.

---

## 3. Vercel

O `vercel.json` já traz tudo configurado: framework, comando de build, pasta
de saída, cache e cabeçalhos de segurança. Não precisa mexer no painel além
de ligar o repositório.

Se o projeto ainda não existir: **Add New → Project → importar o repositório**.
As opções de build vêm do `vercel.json`; deixe como a Vercel detectar.

Confira em **Settings → Git** que a Production Branch é `main`.

> O CONTEXTO.md registra **dois** projetos Vercel apontando para o mesmo
> repositório (`desafio-30-dias` e `desafio-30-dias-zbow`). Os dois publicam
> da `main`, ou seja, cada push sobe duas vezes e só um deles vai receber o
> domínio. Decida qual fica e apague o outro — dois projetos vivos no mesmo
> repo é fonte garantida de confusão sobre "qual link é o certo".

---

## 4. Domínio na GoDaddy

### 4.1 Na Vercel

**Settings → Domains → Add**. Some o domínio raiz (`seudominio.com.br`) e
também o `www`. A Vercel mostra os registros que ela quer — use os que
**ela** exibir; os abaixo são os valores padrão dela hoje.

### 4.2 Na GoDaddy

Em **My Products → DNS → Manage Zones**, no domínio:

| Tipo | Nome | Valor | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | 600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 600 |

Cuidados:

- **Apague o registro `A` de `@` que já existe.** A GoDaddy cria um
  apontando para a página de estacionamento dela. Dois registros `A` no `@`
  fazem o domínio responder alternadamente entre a Vercel e a página de
  "domínio à venda".
- **Apague o `CNAME` de `www`** que aponta para `@`, pelo mesmo motivo.
- **Não use o "Forwarding"/redirecionamento da GoDaddy.** Ele responde com um
  frame ou um 302 que quebra o certificado e o SEO. Redirecionamento de `www`
  para a raiz é a Vercel que faz, sozinha.
- Se o domínio usar os nameservers da GoDaddy (o padrão), é nessa tela mesmo.
  Se alguém já apontou os nameservers para outro lugar, o DNS não está aqui.

### 4.3 Esperar

A propagação leva de alguns minutos a algumas horas. A Vercel emite o
certificado HTTPS sozinha assim que o DNS resolver — não há nada a fazer
além de esperar o painel sair de "Invalid Configuration" para "Valid".

Para conferir sem depender do cache do navegador:

```bash
dig +short seudominio.com.br
```

### 4.4 Depois que o domínio responder

1. Trocar `VITE_SITE_URL` no `.env` pelo domínio real e dar push — os
   metadados de compartilhamento e o `sitemap.xml` só ficam corretos aí.
2. Escolher, em **Settings → Domains**, qual é o domínio principal (com ou
   sem `www`). O outro passa a redirecionar. O escolhido tem que ser o mesmo
   que está no `VITE_SITE_URL`, senão o canonical aponta para o redirecionado.
3. Testar o card de compartilhamento no
   [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   — é ele que o WhatsApp usa de cache.

---

## 5. Checklist final

- [ ] `CHECKOUT_URL` preenchido e testado clicando nos três CTAs (hero, vídeo, oferta)
- [ ] `VITE_SITE_URL` com o domínio real
- [ ] `main` atualizada com a `integracao`
- [ ] Um único projeto Vercel ligado ao repositório
- [ ] Domínio raiz e `www` respondendo em HTTPS
- [ ] Card de compartilhamento aparecendo no WhatsApp
- [ ] LP aberta no celular de verdade, não só no emulador
