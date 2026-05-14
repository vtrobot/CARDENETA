# Estado do Projeto

## Decisões (Decisions)
- Utilização de React, Node.js/Express e Supabase.
- Adoção de arquitetura API-first e RBAC para controle de acessos (Responsável, Professor, Coordenação).
- Uso de Row Level Security (RLS) no Supabase para garantir isolamento de dados de responsáveis.

## Bloqueios (Blockers)
- (Nenhum no momento)

## Lições Aprendidas (Lessons)
- (Nenhuma no momento)

## Pendências (Todos)
- [x] Inicializar repositório Git.
- [x] **Épico 1: Mural de Comunicados** (API + Frontend + RLS)
- [x] **Épico 2: Mensageria Simples** (API + Frontend + UI Threads)
- [x] **Épico 3: Autenticação e Perfis** (Supabase Auth + Context API + Protected Routes)
- [x] **Épico 4: Administração e Turmas** (Dashboard Coordenação + Vinculos de Professores)
- [x] **Melhoria: Cadastro de Alunos** (API + Swagger + Grid + Form)

## Próximos Passos Imediatos
- [ ] Configurar Banco de Dados Real no Supabase (Rodar Scripts SQL).
- [ ] Configurar as variáveis `.env` locais com as chaves reais.
- [ ] Rodar testes manuais ou E2E de fluxo completo (Auth -> Admin -> Mural -> Mensagem).
- [ ] Deploy (Vercel para Frontend, e renderização da API se não for Serverless).

## Ideias Adiadas (Deferred Ideas)
- Integrações avançadas e app nativo (movidos para Fases Futuras conforme PRD).
