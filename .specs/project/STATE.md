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
- [x] **Épico 4: Administração e Turmas** (Dashboard Coordenação + Vínculos de Professores)
- [x] **Melhoria: Cadastro de Alunos** (API + Swagger + Grid + Form)
- [x] **Melhoria: Vínculo Familiar** (API + Swagger + UI para Gestão de Responsáveis)
- [x] **Refatoração e Acessibilidade: Painel de Gestão** (WCAG + Separação de Abas + Filtro Alunos)
- [ ] **Melhoria: Responsividade Móvel** (Adaptação para Celulares e Resoluções Pequenas)

## Próximos Passos Imediatos
- [ ] Implementar **US07: Gestão de Professores** (Listagem e Edição).
- [x] Implementar **US06: Vínculo Familiar** (Vincular alunos a responsáveis - Backend & UI).
- [ ] Implementar Lógica de Mensageria (A partir do ícone adicionado em Alunos).
- [ ] Melhoria: Responsividade e adaptação para dispositivos móveis (Celulares de 360px a 412px de largura).
- [ ] Configurar Banco de Dados Real no Supabase (Rodar Scripts SQL).
- [ ] Rodar testes manuais de fluxo completo.

## Ideias Adiadas (Deferred Ideas)
- Integrações avançadas e app nativo (movidos para Fases Futuras conforme PRD).
