# Tasks: Configuração Inicial (Setup)

## Tarefas

### T1: Setup Front-end (React + Vite)
**O que**: Inicializar um projeto React utilizando Vite com TypeScript.
**Onde**: `frontend/`
**Depende de**: Nenhuma.
**Critérios de aceite**:
- Pasta `frontend` criada.
- Aplicação React rodando (vite).
- TailwindCSS ou sistema de design configurado (conforme orientações).
- React Query (TanStack Query) instalado e configurado no `main.tsx`.
- Atributos `data-testid` previstos no template base.

### T2: Setup Back-end (Node.js + Express)
**O que**: Inicializar projeto Node.js com TypeScript e Express.
**Onde**: `backend/`
**Depende de**: Nenhuma.
**Critérios de aceite**:
- Pasta `backend` criada com `package.json`.
- TypeScript configurado (`tsconfig.json`).
- Express instalado e configurado com roteamento básico (healthcheck).
- Arquivos `.env` ignorados no `.gitignore`.
- Eslint/Prettier configurados.

### T3: Estruturação do Banco de Dados Inicial (Supabase)
**O que**: Criar o script SQL de inicialização do banco de dados (tabelas base).
**Onde**: `backend/supabase/init.sql` (ou equivalente na pasta db).
**Depende de**: Nenhuma.
**Critérios de aceite**:
- Script `.sql` contemplando criação das tabelas `usuarios`, `turmas`, `alunos`, `comunicados`, `mensagens_diretas`, `notificacoes`, `responsaveis_alunos`, `professores_turmas`, `leituras_comunicados`.
- Definição do schema correspondente a Seção 7.1 e 7.2 do PRD.
