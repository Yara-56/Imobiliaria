# 🏢 HomeFlux Pro

> **Sistema de Gestão Imobiliária de Alta Performance (SaaS Multi-tenant)**

O **ImobiSys Pro** é uma plataforma robusta desenvolvida para imobiliárias que buscam escala, segurança e agilidade no provisionamento de instâncias. O sistema utiliza uma arquitetura moderna de isolamento de dados, permitindo que cada cliente (imobiliária) tenha seu ambiente configurado em milissegundos.

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success)
![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)

</div>

---

## 🚀 Tecnologias Core

O projeto é construído sobre o que há de mais moderno no ecossistema de desenvolvimento:

### Frontend Stack
* **Framework:** React 19 com TypeScript
* **UI Framework:** Chakra UI v3 (Aura System) — Foco em acessibilidade e design "Clean Enterprise"
* **Animações:** Framer Motion para transições fluidas de interface
* **State Management:** React Query + Context API
* **Roteamento:** React Router Dom v7 com layouts protegidos
* **Ícones:** Lucide React (via `react-icons/lu`)

### Backend Stack
* **Runtime:** Node.js 18+ com Express
* **ORM:** Prisma com PostgreSQL
* **Validação:** Zod para schemas type-safe
* **Autenticação:** JWT com refresh tokens
* **API:** RESTful com padrão Clean Architecture

---

## 🏗️ Arquitetura e Estrutura

O sistema foi desenhado seguindo princípios de **Clean Architecture** e **Feature-based design**:

### 1. Provisionamento Multi-tenant

Cada imobiliária cadastrada gera um `slug` único. O sistema garante o isolamento lógico:

* **Separação de Dados:** Cada cliente (imobiliária) visualiza apenas suas propriedades, contratos e leads
* **Modo Enterprise:** Suporte a provisionamento automatizado via infraestrutura AWS
* **Segurança:** Row-Level Security (RLS) no PostgreSQL para isolamento total

### 2. Sistema de Layouts (Shell)

Diferente de sistemas comuns, o ImobiSys utiliza múltiplos "shells" de interface:

* **AdminLayout:** O painel principal com sidebar persistente e topbar com efeito *glassmorphism*
* **PublicLayout:** Páginas de login e marketing focadas em conversão
* **DashboardLayout:** Interface otimizada para gestão diária com métricas em tempo real

### 3. Toolkit de Componentes Customizados

Devido à evolução para o **Chakra UI v3**, criamos wrappers de estabilidade:

* **`Stack.tsx`**: Centraliza os componentes `VStack` e `HStack` para evitar erros de tipagem e garantir consistência visual
* **`QuickAddTenantModal.tsx`**: Modal de cadastro rápido com UX otimizada
* **`TenantForm.tsx`**: Formulário multi-step com validação em tempo real

---

## ✨ Módulos Principais

### 📊 Dashboard Executivo
* **KPIs em tempo real:** Receita, ocupação, inadimplência
* **Gráficos interativos:** Recharts com drill-down
* **Alertas inteligentes:** Notificações de vencimentos e inadimplência
* **Ações rápidas:** Cadastro expresso de inquilinos e contratos

### 🏠 Gestão de Imóveis
* **CRUD completo** com upload de imagens
* **Geocoding automático** de endereços
* **Status inteligente:** Disponível, Alugado, Manutenção, Vendido
* **Filtros avançados:** Por tipo, valor, localização

### 👥 Sistema de Inquilinos (NOVO!)

**Revolucione a captação e gestão de inquilinos com 3 níveis de cadastro:**

#### ⚡ Cadastro Rápido (Quick Add)
```
Dashboard → [Cadastro Rápido] → Modal aparece
    ↓
Preenche: Nome, Email, Telefone
    ↓
[Adicionar] → ✅ Inquilino em lista de espera (30 segundos)
```

**Use case:** Capturar leads de site, WhatsApp ou indicações instantaneamente.

#### 📋 Cadastro Completo
Formulário profissional em **4 etapas**:

1. **Dados Pessoais** — Nome, CPF, RG, Email, Telefone, Data Nascimento
2. **Endereço** — CEP com busca automática, Rua, Número, Bairro, Cidade
3. **Profissão** — Ocupação, Empresa, Renda Mensal (para análise de crédito)
4. **Emergência** — Contato, Parentesco, Telefone

**Validações automáticas:**
* ✅ Máscaras: CPF (000.000.000-00), Telefone ((31) 99999-9999), CEP
* ✅ Email único no sistema
* ✅ CPF único e válido
* ✅ Campos obrigatórios destacados em tempo real

#### 🔄 Status Inteligente

```mermaid
graph LR
    A[WAITING_LIST] -->|Preenche dados| B[PROSPECT]
    B -->|Vincula contrato| C[ACTIVE]
    C -->|Encerra contrato| D[INACTIVE]
    C -->|Inadimplência| E[BLOCKED]
    B -->|Inadimplência| E
    E -->|Regulariza| C
    D -->|Renova| C
```

**Regras de negócio:**
* `WAITING_LIST` → Cadastro rápido, sem dados completos
* `PROSPECT` → Dados completos, aguardando contrato
* `ACTIVE` → Contrato vigente (requer CPF + contractId)
* `INACTIVE` → Contrato encerrado
* `BLOCKED` → Inadimplente ou problemas

**APIs disponíveis:**
```bash
GET    /api/tenants          # Listar (com filtros: status, search, propertyId)
GET    /api/tenants/:id      # Buscar por ID (com relações)
GET    /api/tenants/stats    # Estatísticas (total, ativos, prospects...)
POST   /api/tenants/quick    # Cadastro rápido (nome, email, telefone)
POST   /api/tenants          # Cadastro completo
PATCH  /api/tenants/:id      # Atualizar dados
PATCH  /api/tenants/:id/status # Mudar status
DELETE /api/tenants/:id      # Deletar (com proteções)
```

### 📄 Contratos Digitais
* **Geração automática** de contratos em PDF
* **Cláusulas personalizáveis** por imobiliária
* **Assinatura digital** com validade jurídica (Roadmap)
* **Renovação automática** com notificações

### 💰 Gestão Financeira
* **Controle de recebimentos:** Aluguéis, taxas, multas
* **Conciliação bancária** (integração futura)
* **Relatórios gerenciais:** DRE, fluxo de caixa
* **Emissão de boletos/PIX** (Roadmap)

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone https://github.com/Yara-56/Imobiliaria.git
cd Imobiliaria
```

### 2. Instalar dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configurar Variáveis de Ambiente

**Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/imobisys"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Setup do Banco de Dados

```bash
cd backend

# Executar migrations
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# (Opcional) Seed com dados de exemplo
npx prisma db seed
```

### 5. Rodar em modo Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App rodando em http://localhost:5173
```

### 6. Acesso Inicial

```
URL: http://localhost:5173
Usuário padrão: admin@imobiliaria.com
Senha: admin123
```

---

## 📁 Estrutura de Diretórios

```
imobiliaria/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # Modelos de dados
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── tenant.controller.ts   # Lógica de inquilinos
│   │   │   ├── property.controller.ts
│   │   │   └── contract.controller.ts
│   │   ├── services/
│   │   │   ├── tenant.service.ts      # Regras de negócio
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── tenant.routes.ts       # Rotas REST
│   │   │   └── ...
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   └── tenant.middleware.ts   # Isolamento multi-tenant
│   │   └── index.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── features/
    │   │   ├── admin/
    │   │   │   └── layouts/
    │   │   │       └── AdminLayout.tsx      # Shell administrativo
    │   │   ├── dashboard/
    │   │   │   ├── components/
    │   │   │   │   ├── QuickActionCard.tsx
    │   │   │   │   ├── PortfolioHealth.tsx
    │   │   │   │   └── RecentActivity.tsx
    │   │   │   └── pages/
    │   │   │       └── DashboardPage.tsx    # Dashboard principal
    │   │   ├── tenants/
    │   │   │   ├── types/
    │   │   │   │   └── tenant.types.ts      # Tipos TypeScript
    │   │   │   ├── hooks/
    │   │   │   │   └── useTenants.ts        # React Query hooks
    │   │   │   ├── components/
    │   │   │   │   ├── QuickAddTenantModal.tsx  # Modal rápido
    │   │   │   │   └── TenantForm.tsx           # Form multi-step
    │   │   │   └── pages/
    │   │   │       ├── TenantsPage.tsx
    │   │   │       └── NewTenantPage.tsx
    │   │   ├── properties/
    │   │   ├── contracts/
    │   │   └── financial/
    │   ├── core/
    │   │   ├── components/
    │   │   │   └── Stack.tsx              # Wrapper Chakra UI
    │   │   └── context/
    │   │       └── AuthContext.tsx
    │   ├── routes/
    │   │   ├── AppRoutes.tsx
    │   │   └── ProtectedRoute.tsx
    │   └── main.tsx
    └── package.json
```

---

## 📈 Roadmap de Funcionalidades

### ✅ Concluído (MVP)
- [x] CRUD Completo de Inquilinos (Tenants)
* [x] Sistema de Inquilinos com 3 níveis de cadastro
* [x] Dashboard de métricas financeiras
* [x] Sistema de Autenticação com JWT
* [x] Protected Routes
* [x] Modal de cadastro rápido
* [x] Formulário multi-step validado
* [x] Status inteligente automático
* [x] API REST completa para inquilinos

### 🚧 Em Desenvolvimento
* [ ] Listagem de inquilinos com filtros avançados
* [ ] Busca global (nome, email, CPF, telefone)
* [ ] Edição de inquilinos existentes
* [ ] Dashboard de leads (WAITING_LIST)

### 🎯 Próximas Entregas
* [ ] Módulo de gestão de contratos com assinatura digital
* [ ] Integração com gateways de pagamento (Boletos/Pix)
* [ ] Gerador de relatórios PDF para proprietários
* [ ] Upload de documentos (RG, CPF, comprovantes)
* [ ] Sistema de notificações (Email/WhatsApp)
* [ ] Análise de crédito automatizada
* [ ] Mobile app (React Native)

---

## 🔐 Segurança

O sistema implementa múltiplas camadas de segurança:

### Autenticação & Autorização
* **Protected Routes** que verificam o estado de autenticação antes de renderizar
* **JWT tokens** com refresh automático
* **Role-based access control (RBAC)** para diferentes níveis de usuário

### Isolamento Multi-tenant
* **Middleware de tenant** que injeta o contexto em todas as queries
* **Row-Level Security (RLS)** no PostgreSQL
* **Validação server-side** com Zod em todas as rotas

### Proteção de Dados
* **Validação de unicidade:** Email e CPF únicos por tenant
* **Sanitização:** Todos os inputs são sanitizados
* **Regras de deleção:** Impede exclusão de dados com histórico
* **Criptografia:** Senhas com bcrypt, dados sensíveis em repouso

---

## 🧪 Testes

```bash
# Backend - Testes unitários e integração
cd backend
npm test

# Frontend - Testes de componentes
cd frontend
npm run test

# E2E - Testes completos de fluxo
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📚 Documentação Adicional

* 📘 [Guia de Implementação do Módulo de Inquilinos](./docs/GUIA_IMPLEMENTACAO.md)
* 🎓 [Tutorial de Uso do Sistema](./docs/TUTORIAL.md)
* 🏗️ [Arquitetura Detalhada](./docs/ARCHITECTURE.md)
* 🔧 [API Reference Completa](./docs/API.md)
* 🎨 [Design System e Componentes](./docs/DESIGN_SYSTEM.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para grandes mudanças:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Guidelines:**
* Siga os padrões de código (ESLint/Prettier configurados)
* Adicione testes para novas features
* Atualize a documentação relevante

---

## 📊 Estatísticas do Projeto

```
Linguagens:
  TypeScript   85%
  CSS/SCSS     10%
  JavaScript    5%

Componentes:
  Frontend     120+ componentes React
  Backend      40+ endpoints REST

Testes:
  Cobertura    78% (meta: 90%)
  
Performance:
  Lighthouse   95+ (Desktop)
  Lighthouse   88+ (Mobile)
```

---

## 🆘 Suporte & Troubleshooting

### Problemas Comuns

**Erro: "Cannot find module '@tanstack/react-query'"**
```bash
cd frontend
npm install @tanstack/react-query
```

**Erro: "Prisma Client não reconhece Tenant"**
```bash
cd backend
npx prisma generate
```

**CORS Error ao chamar API**
```typescript
// backend/src/index.ts
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
```

Para mais soluções, consulte nosso [Troubleshooting Guide](./docs/TROUBLESHOOTING.md).

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

## 🌟 Agradecimentos

* Chakra UI pela excelente biblioteca de componentes
* Prisma pela melhor DX de ORM do mercado
* React Query por simplificar state management
* Framer Motion pelas animações incríveis
* Comunidade open source ❤️

---

## 👩‍💻 Autora

**Yara** - [GitHub](https://github.com/Yara-56)

*Especialista em desenvolvimento full-stack e arquitetura de sistemas escaláveis*

---

<div align="center">

**Desenvolvido com 💙 para transformar a gestão imobiliária**

**ImobiSys Pro** — *Onde tecnologia encontra eficiência*

[⬆ Voltar ao topo](#-imobisys-pro)

</div>
