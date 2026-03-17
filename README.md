# Agencia Premium Platform

Plataforma full-stack para uma agencia de trafego pago com site institucional premium, CRM interno, painel administrativo e modulo de IA comercial.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- React Hook Form

## O que ja vem pronto

- arquitetura separada entre marketing e admin
- autenticacao via cookie assinado
- dashboard administrativa
- CRM de leads e clientes
- propostas, tarefas e campanhas com criacao, listagem, exclusao e edicao
- financeiro basico com lancamentos por cliente
- central de mensagens
- modulo de IA com provider desacoplado, fallback mock e provider real configuravel por ambiente
- fila de mensagens com processamento manual no admin
- endpoint seguro para processamento de fila
- webhook para atualizacao de status de entrega
- CMS com edicao das configuracoes principais e publicacao de servicos, depoimentos e FAQs
- upload real local de anexos em `public/uploads`, vinculados a clientes e propostas
- fluxo de conversao de lead para cliente
- portal inicial do cliente com campanhas, mensagens, propostas e proximos passos
- relatorios executivos de conversao, canais e financeiro
- script de processamento de fila para uso via cron/worker
- seeds com dados de exemplo
- modo demo quando o banco nao estiver configurado

## Como rodar

1. Instale dependencias:

```bash
npm install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

3. Gere o client do Prisma:

```bash
npm run db:generate
```

4. Suba o banco e aplique o schema:

```bash
npm run db:push
```

5. Popule com seed:

```bash
npm run db:seed
```

6. Rode em desenvolvimento:

```bash
npm run dev
```

## Credenciais iniciais

- Email: `admin@agencia-premium.com`
- Senha: `Admin123!`
- Portal do cliente de exemplo: `henrique@orionimoveis.com`
- Senha do cliente de exemplo: `Admin123!`

## Rotas principais

- Site: `/`
- Admin: `/admin`
- Portal do cliente: `/portal`
- Healthcheck: `/api/health`
- Readiness: `/api/ready`
- Queue API: `/api/queue/process`
- Upload API: `/api/uploads`
- Message Webhook API: `/api/webhooks/messages`

## Scripts uteis

- `npm run dev`
- `npm run build`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run queue:process`

## Deploy local com Docker

1. Suba os containers:

```bash
docker compose up --build
```

2. Em outro terminal, aplique o schema e seed se quiser popular:

```bash
docker compose exec app npm run db:push
docker compose exec app npm run db:seed
```

3. Acesse:

- App: `http://localhost:3000`
- Postgres: `localhost:5433`

## Observabilidade basica

- `/api/health`: valida se a aplicacao respondeu.
- `/api/ready`: valida se a aplicacao esta pronta e tenta checar o banco.
- `npm run queue:process`: processa mensagens em fila localmente.

## CI

O projeto inclui pipeline em `.github/workflows/ci.yml` para:

- instalar dependencias
- gerar Prisma Client
- rodar build de producao

## Release manual

O projeto inclui `.github/workflows/release.yml` para release manual de `staging` ou `production`.

Segredos esperados no GitHub:

- `DATABASE_URL_STAGING`
- `DATABASE_URL_PRODUCTION`

O workflow:

- gera o Prisma Client
- aplica `prisma migrate deploy`
- builda a imagem Docker
- publica no GHCR com tag do ambiente e tag manual

Se quiser alterar, ajuste `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env`.

## Arquitetura

O blueprint completo da solucao esta em [docs/product-blueprint.md](./docs/product-blueprint.md).

## Variaveis de ambiente

Veja `.env.example` para:

- banco
- auth
- IA
- SMTP
- canais futuros como WhatsApp

## Observacoes

- O modulo de IA funciona em `mock` por padrao, mas ja esta preparado para plugar um provider real.
- O projeto entra em `demo mode` quando `DATABASE_URL` nao estiver definido. Isso permite navegar e validar o produto mesmo antes da infraestrutura estar pronta.
