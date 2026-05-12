# Tasks: Épico 1 — Mural de Comunicados

## Back-end (Node.js/Express)

- [x] **B1: Políticas de Segurança (RLS) no Supabase**
  - Configurar as políticas (Policies) para as tabelas `comunicados` e `leituras_comunicados` conforme perfil (Responsável vs. Professor/Coordenação).
- [x] **B2: Controller/Service GET `/api/comunicados`**
  - Implementar listagem paginada.
  - Implementar query com filtros (`aluno_id`, `status`).
- [x] **B3: Controller/Service GET `/api/comunicados/:id`**
  - Retornar detalhe do comunicado.
  - Ao carregar, se o usuário for "Responsável" e o comunicado for urgência "Baixa" ou "Média", marcar `status_lido = true` na tabela associativa.
- [x] **B4: Controller/Service POST `/api/comunicados/:id/ciencia`**
  - Endpoint específico para confirmar ciência de comunicados de Alta urgência (`ciencia_confirmada = true`).
- [x] **B5: CRUD Completo de Comunicados (POST, PUT, DELETE)**
  - Implementar endpoints de escrita exclusivos para Professor/Coordenação.
  - Validar se Professor tem vínculo com a turma (`turma_id`) informada no Payload.

## Front-end (React/Vite)

- [x] **F1: Configurar React Router**
  - Criar estrutura de rotas protegidas e públicas (`/login`, `/mural`, `/painel-gestao`). (Apesar do Auth ser Épico 3, precisaremos mockar ou adiantar um sistema básico de roteamento).
- [x] **F2: Componente Card de Comunicado**
  - Criar componente UI reutilizável contendo: Título, Autor, Data, Status de Leitura, Tag de Urgência (cores dinâmicas). Atributos `data-testid="comunicado-card"`.
- [x] **F3: Tela do Mural do Responsável (`/mural`)**
  - Implementar a listagem consumindo `GET /api/comunicados` via TanStack Query.
  - Implementar a UI de Filtros (por aluno/status).
- [x] **F4: Tela/Modal de Detalhe e Botão de Ciência**
  - Exibir o conteúdo completo do comunicado.
  - Se urgência ALTA e não confirmado, exibir botão de chamada à ação primária "Confirmar Ciência".
  - Integrar clique do botão com `POST /api/comunicados/:id/ciencia`.
- [x] **F5: Painel de Criação/Edição de Comunicados**
  - Criar formulário (Título, Conteúdo, Nível de Urgência, Turma Destino).
  - Integrar com POST/PUT `/api/comunicados`.
