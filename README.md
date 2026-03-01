 🏢 ImobiSys Pro

> **Sistema de Gestão Imobiliária de Alta Performance (SaaS Multi-tenant)**

O **ImobiSys Pro** é uma plataforma robusta desenvolvida para imobiliárias que buscam escala, segurança e agilidade no provisionamento de instâncias. O sistema utiliza uma arquitetura moderna de isolamento de dados, permitindo que cada cliente (imobiliária) tenha seu ambiente configurado em milissegundos.

---

## 🚀 Tecnologias Core

O projeto é construído sobre o que há de mais moderno no ecossistema de desenvolvimento:

* **Frontend:** React 19 com TypeScript.
* **UI Framework:** Chakra UI v3 (Aura System) — Foco em acessibilidade e design "Clean Enterprise".
* **Animações:** Framer Motion para transições fluidas de interface.
* **Roteamento:** React Router Dom v7 com layouts protegidos.
* **Gerenciamento de Estado:** Hooks customizados e Context API para autenticação.
* **Ícones:** Lucide React (via `react-icons/lu`).

---

## 🏗️ Arquitetura e Estrutura

O sistema foi desenhado seguindo princípios de **Clean Architecture** e **Feature-based design**:

### 1. Provisionamento Multi-tenant

Cada imobiliária cadastrada gera um `slug` único. O sistema garante o isolamento lógico:

* **Separação de Dados:** Cada locatário visualiza apenas suas propriedades, contratos e leads.
* **Modo Enterprise:** Suporte a provisionamento automatizado via infraestrutura AWS.

### 2. Sistema de Layouts (Shell)

Diferente de sistemas comuns, o ImobiSys utiliza múltiplos "shells" de interface:

* **AdminLayout:** O painel principal com sidebar persistente e topbar com efeito *glassmorphism*.
* **PublicLayout:** Páginas de login e marketing focadas em conversão.

### 3. Toolkit de Componentes Customizados

Devido à evolução para o **Chakra UI v3**, criamos wrappers de estabilidade:

* **`Stack.tsx`**: Centraliza os componentes `VStack` e `HStack` para evitar erros de tipagem e garantir consistência visual.

---

## 🛠️ Como Executar o Projeto

1. **Clonar o repositório:**
```bash
git clone https://github.com/seu-usuario/imobisys-pro.git

```


2. **Instalar dependências:**
```bash
npm install

```


3. **Configurar Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz seguindo o modelo `.env.example`.
4. **Rodar em modo Desenvolvimento:**
```bash
npm run dev

```

---

## 📈 Roadmap de Funcionalidades

* [x] CRUD Completo de Locatários (Tenants).
* [x] Dashboard de métricas financeiras.
* [x] Sistema de Autenticação com bypass de desenvolvimento.
* [ ] Módulo de gestão de contratos com assinatura digital.
* [ ] Integração com gateways de pagamento (Boletos/Pix).
* [ ] Gerador de relatórios PDF para proprietários.

---

## 🔐 Segurança

O sistema implementa **Protected Routes** que verificam o estado de autenticação antes de renderizar qualquer componente sensível, garantindo que usuários não autorizados nunca acessem o "Core" administrativo.

---

**Desenvolvido por Yara — 2026**
