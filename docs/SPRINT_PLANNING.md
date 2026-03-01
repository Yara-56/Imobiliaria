# Planejamento das Sprints - Gestor Imobiliário

## Visão Geral do Planejamento
- **Equipe:** 3 pessoas
- **Duração da Sprint:** Quinzenal
- **Estratégia:** Abordagem por camadas, focando primeiro no desenvolvimento completo do Back-end para um conjunto de funcionalidades, seguido pelo Front-end.

---

## Roadmap de Sprints

### **Sprint 1: Construção do Back-end (Core)**
- **Período:** 01/10/2025 – 14/10/2025
- **Objetivo da Sprint:** Construir a fundação da API, incluindo segurança e o cadastro das entidades principais (Inquilinos e Imóveis).
- **Histórias Planejadas:**
  - **US001:** Autenticação no sistema com e-mail e senha.
  - **US002:** Cadastrar um novo inquilino.
  - **US003:** Cadastrar um novo imóvel.
  - **US004:** Visualizar uma lista de todos os inquilinos.
  - **US005:** Visualizar uma lista de todos os imóveis.

---

### **Sprint 2: Construção do Front-end (Base)**
- **Período:** 15/10/2025 – 27/10/2025
- **Objetivo da Sprint:** Criar a interface de usuário para consumir a API base, permitindo o login e a visualização e cadastro das entidades principais.
- **Histórias Planejadas:**
  - *(Frontend correspondente à US001)*: Tela de Login que consome a API de autenticação.
  - *(Frontend correspondente à US002/US004)*: Interface para cadastrar e listar inquilinos.
  - *(Frontend correspondente à US003/US005)*: Interface para cadastrar e listar imóveis.

---

### **Sprint 3: Construção do Back-end (Lógica de Negócio)**
- **Período:** 28/10/2025 – 10/11/2025
- **Objetivo da Sprint:** Desenvolver a lógica de negócio central do sistema, focando em contratos e pagamentos.
- **Histórias Planejadas:**
  - **US006:** Cadastrar um novo contrato, vinculando inquilino e imóvel.
  - **US007:** Visualizar uma lista de todos os contratos ativos.
  - **US008:** Registrar o pagamento de um aluguel.
  - **US009:** Gerar um recibo em PDF após um pagamento.

---

### **Sprint 4: Construção do Front-end (Fluxos de Negócio)**
- **Período:** 11/11/2025 – 24/11/2025
- **Objetivo da Sprint:** Criar a interface de usuário para gerenciar os fluxos de contrato e pagamento.
- **Histórias Planejadas:**
  - *(Frontend correspondente à US006/US007)*: Interface para criar e listar contratos.
  - *(Frontend correspondente à US008/US009)*: Interface para registrar pagamentos e baixar os recibos gerados.
