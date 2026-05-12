# Tasks: Épico 3 — Autenticação e Perfis (Auth / RBAC)

## Back-end (Node.js/Express)

- [x] **B1: Middleware Real de Autenticação JWT**
  - Remover o `mockAuthMiddleware`.
  - Criar o middleware definitivo usando o `@supabase/supabase-js` para validar o token Bearer recebido em `req.headers.authorization`.
  - Validar e anexar `req.user` (`id` e `role` buscado da tabela `usuarios`).
- [x] **B2: Revisão das Rotas Existentes**
  - Aplicar o novo middleware a todas as rotas em `comunicadosRoutes.ts` e `mensagensRoutes.ts`.
  - Garantir que testes de autorização (RBAC) continuam bloqueando acessos indevidos.

## Front-end (React/Vite)

- [x] **F1: Configurar Cliente Supabase no Front**
  - Criar `src/lib/supabase.ts` e inicializar o `createClient` com variáveis `.env` (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
- [x] **F2: AuthProvider e Context API**
  - Criar um contexto global `AuthContext` para gerenciar se o usuário está logado, quem é, e qual o seu "papel" (Role).
  - Integrar com `supabase.auth.onAuthStateChange`.
- [x] **F3: Tela de Login e Recuperação de Senha**
  - Criar a página `/login` com formulário de E-mail e Senha integrados ao `supabase.auth.signInWithPassword`.
  - Implementar fluxo básico para "Esqueci minha senha" (`resetPasswordForEmail`).
- [x] **F4: Rotas Protegidas e Redirecionamento Dinâmico**
  - Alterar o `App.tsx` para embrulhar o conteúdo nas Protected Routes.
  - O componente `Welcome` (rota base `/`) deve decidir se empurra o usuário para `/login`, `/mural` ou `/painel-gestao` analisando os dados do `AuthContext`.
- [x] **F5: Adaptação das Requisições (Fetch Headers)**
  - Alterar `src/services/api.ts` para capturar a Sessão ativa do Supabase dinamicamente e enviar o JWT real no Header `Authorization: Bearer <TOKEN>` ao invés do cabeçalho mockado de `x-user-id`.
