# Product Blueprint

## 1. Arquitetura do projeto

O produto foi desenhado como uma plataforma full-stack com duas superficies principais:

- `site publico`: aquisicao, autoridade, conteudo e conversao.
- `admin operacional`: CRM, pipeline, execucao, IA comercial e auditoria.

### Camadas

- `app`: rotas e layouts do Next.js App Router.
- `modules`: regras por dominio (`leads`, `clients`, `ai`, `messages`, `dashboard`, `site-content`).
- `components`: UI reutilizavel e shell das areas publica e administrativa.
- `lib`: infraestrutura compartilhada (`auth`, `prisma`, `env`, `formatters`, `demo-data`).
- `prisma`: schema, seed e evolucao do banco.

### Principios

- separacao entre marketing e backoffice
- tipagem forte de ponta a ponta
- camadas desacopladas para IA e mensageria
- repositorios com fallback para modo demo
- pronto para escalar do MVP para operacao multiusuario

## 2. Estrutura de pastas

```text
.
|-- docs/
|-- prisma/
|-- src/
|   |-- app/
|   |   |-- (marketing)/
|   |   |-- admin/
|   |   |-- login/
|   |   `-- api/ (expansao futura)
|   |-- components/
|   |   |-- admin/
|   |   |-- forms/
|   |   |-- marketing/
|   |   `-- ui/
|   |-- lib/
|   |-- modules/
|   |   |-- ai/
|   |   |-- auth/
|   |   |-- campaigns/
|   |   |-- clients/
|   |   |-- dashboard/
|   |   |-- leads/
|   |   |-- logs/
|   |   |-- messages/
|   |   |-- proposals/
|   |   |-- site-content/
|   |   `-- tasks/
|   `-- middleware.ts
|-- .env.example
`-- README.md
```

## 3. Plano do banco de dados

Entidades principais:

- `User`: autenticacao, ownership, auditoria e papeis.
- `Lead`: entrada comercial, origem, tags, responsavel e historico.
- `Client`: cliente ativo, objetivos, ticket e canais.
- `Proposal`: proposta comercial vinculada a lead ou cliente.
- `Task`: operacao e acompanhamento interno.
- `Campaign`: execucao de midia e metricas basicas.
- `Message`: historico omnichannel.
- `AIRequest`: rastreio da geracao feita pela IA.
- `ActivityLog`: trilha auditavel para toda acao relevante.
- `Service`, `CaseStudy`, `Testimonial`, `FAQ`, `BlogPost`, `SiteSetting`: CMS da frente publica.

## 4. Plano de telas

### Area publica

- `/`: home premium focada em conversao
- `/sobre`: posicionamento, historia e metodo
- `/servicos`: detalhamento da oferta
- `/cases`: resultados e estudos de caso
- `/depoimentos`: prova social
- `/contato`: formulario, email, WhatsApp e CTA
- `/insights`: blog inicial

### Backoffice

- `/login`: autenticacao segura
- `/admin`: dashboard executiva
- `/admin/leads`: CRM de leads
- `/admin/clients`: clientes ativos
- `/admin/proposals`: propostas
- `/admin/tasks`: operacao
- `/admin/campaigns`: campanhas
- `/admin/messages`: central de mensagens
- `/admin/ai`: central IA
- `/admin/site`: CMS basico
- `/admin/logs`: auditoria

## 5. Plano de componentes

### Marketing

- `SiteHeader`, `SiteFooter`
- `HeroSection`
- `MetricStrip`
- `ServiceCard`
- `CaseCard`
- `TestimonialCard`
- `FAQAccordion`
- `LeadCaptureForm`
- `CTASection`

### Admin

- `AdminSidebar`
- `AdminTopbar`
- `StatCard`
- `SectionCard`
- `DataTable`
- `EmptyState`
- `EntityFormCard`
- `ActivityFeed`
- `AIComposer`
- `QuickActionGrid`

### UI base

- `Button`
- `Badge`
- `Card`
- `Input`
- `Textarea`
- `Select`
- `Table`
- `Shell`

## 6. Roadmap tecnico

### Fase 1

- site publico
- captura de leads
- login admin
- dashboard
- leads
- clientes
- central IA com mock ou provider plugavel
- mensagens por email
- logs

### Fase 2

- propostas completas
- tarefas e campanhas com workflows mais avancados
- CMS expandido
- area do cliente

### Fase 3

- automacoes recorrentes
- WhatsApp real
- analytics avancados
- relatios e previsoes

