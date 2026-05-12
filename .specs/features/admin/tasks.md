# Tasks: Épico 4 — Administração e Turmas

## Back-end (Node.js/Express)

- [x] **B1: Policies (RLS) Administrativas**
  - Escrever script SQL (`policies_admin.sql`) garantindo acesso total de escrita em `turmas`, `alunos` e tabelas de junção apenas para usuários com perfil `coordenacao`.
- [x] **B2: Rotas e Controller de Turmas e Alunos**
  - Criar `adminController.ts`.
  - Implementar GET/POST `/api/admin/turmas`.
  - Implementar GET/POST `/api/admin/alunos`.
  - Proteger as rotas usando o middleware `requireRole(['coordenacao'])`.
- [x] **B3: Rotas de Usuários e Vínculos**
  - Implementar GET `/api/admin/usuarios?papel=X` para popular listas de seleção no front-end.
  - Implementar POST `/api/admin/vinculos/professor-turma` e POST `/api/admin/vinculos/responsavel-aluno`.

## Front-end (React/Vite)

- [x] **F1: Estrutura de Abas no Painel de Gestão**
  - Refatorar `/painel-gestao` para usar um sistema de "Tabs" (Abas).
  - Ocultar a "Aba de Administração" caso `role !== 'coordenacao'`.
- [x] **F2: API Services**
  - Adicionar as funções de chamada (`fetchTurmasAdmin`, `createTurma`, `fetchUsuariosByRole`, `criarVinculo`, etc.) no arquivo `api.ts`.
- [x] **F3: Tela de Gestão de Turmas**
  - Interface com tabela listando turmas e botão para criar "Nova Turma" (Modal simples).
- [x] **F4: Tela/Modal de Vínculos**
  - Interface para permitir selecionar um Professor e vinculá-lo a uma Turma.
  - Interface para cadastrar Aluno e vincular a um Responsável.
