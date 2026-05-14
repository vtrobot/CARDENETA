# Reformulação da Administração Escolar

## Problem Statement

A aba atual de Administração Escolar estava focada apenas em turmas. Com a adição de novos recursos como o cadastro de usuários (professores, coordenação, responsáveis) e a futura necessidade de gerenciar alunos, a interface atual precisa ser reorganizada. A solução é subdividir a aba de Administração Escolar em sub-abas dedicadas para cada módulo, facilitando a navegação e escalabilidade do sistema para a Coordenação.

## Goals

- [x] Reorganizar a aba "Administração Escolar" em três sub-abas: Usuários, Turmas e Alunos.
- [x] Migrar a gestão atual de turmas (lista, botão "Nova Turma", botão "Vincular Professor") para a sub-aba "Turmas".
- [x] Listar todos os usuários na sub-aba "Usuários".
- [x] Mover a interface de cadastro de Usuários para um botão "+ Cadastrar Usuário" que abre o formulário na sub-aba "Usuários".
- [x] Preparar a sub-aba "Alunos" contendo apenas o layout base e um botão inativo "Cadastrar Aluno" para implementação futura.

## Out of Scope

| Feature     | Reason         |
| ----------- | -------------- |
| Funcionalidade de Cadastro de Aluno | Como definido no MVP, a aba "Alunos" terá apenas um placeholder/botão inativo. A implementação real será feita num momento posterior. |
| Edição/Exclusão de Usuários | O foco do MVP é apenas o cadastro (POST). Gerenciamento completo virá depois. |

---

## User Stories

### P1: Sub-abas de Navegação na Administração ⭐ MVP

**User Story**: Como Coordenação, quero ver sub-abas (Usuários, Turmas, Alunos) dentro da Administração Escolar, para que eu possa acessar diferentes módulos de gestão separadamente.

**Why P1**: É a estrutura base da reformulação.

**Acceptance Criteria**:
1. WHEN acesso a aba "Administração Escolar" THEN system SHALL exibir botões/links de sub-abas: "Usuários", "Turmas", "Alunos".
2. WHEN clico em "Turmas" THEN system SHALL exibir o conteúdo de Gestão de Turmas.
3. WHEN tento acessar a aba com um perfil que não seja `coordenacao` THEN system SHALL bloquear o acesso (comportamento já existente).

**Independent Test**: Logar como coordenação, ir até Administração Escolar e navegar entre as 3 sub-abas vazias/populadas.

---

### P1: Migração da Gestão de Turmas ⭐ MVP

**User Story**: Como Coordenação, quero que as funcionalidades de turmas já existentes estejam dentro da sub-aba "Turmas", para que eu não perca as ferramentas de vincular professores e criar turmas.

**Why P1**: Funcionalidade já existente não pode ser perdida.

**Acceptance Criteria**:
1. WHEN acesso a sub-aba "Turmas" THEN system SHALL exibir a tabela de turmas cadastradas.
2. WHEN acesso a sub-aba "Turmas" THEN system SHALL exibir os botões "Nova Turma" e "Vincular Professor".
3. WHEN utilizo "Nova Turma" ou "Vincular Professor" THEN system SHALL funcionar como antes, exibindo os respectivos formulários e salvando no banco.

**Independent Test**: Na sub-aba Turmas, criar uma nova turma e vincular um professor com sucesso.

---

### P1: Listagem de Usuários ⭐ MVP

**User Story**: Como Coordenação, quero acessar a sub-aba "Usuários" e visualizar uma lista dos usuários cadastrados (Nome, Email, Papel), para saber quem já tem acesso.

**Why P1**: Visibilidade da base de usuários é essencial.

**Acceptance Criteria**:
1. WHEN acesso a sub-aba "Usuários" THEN system SHALL buscar todos os usuários e exibir em uma tabela.
2. WHEN acesso a sub-aba "Usuários" THEN system SHALL exibir um botão "+ Cadastrar Usuário" no canto superior direito.

**Independent Test**: Acessar a aba e visualizar a listagem com pelo menos os usuários pre-existentes (seeding).

---

### P1: Cadastro de Usuários ⭐ MVP

**User Story**: Como Coordenação, quero poder clicar em "+ Cadastrar Usuário" e cadastrar novos usuários, para que professores e responsáveis tenham acesso.

**Why P1**: É a principal nova feature habilitada pela nova API desenvolvida.

**Acceptance Criteria**:
1. WHEN clico no botão "+ Cadastrar Usuário" THEN system SHALL abrir a interface de cadastro (formulário).
2. WHEN preencho "Nome", "Email", "Senha" e "Papel" (Professor, Responsável, Coordenação) e envio THEN system SHALL chamar a API `POST /api/admin/usuarios`, exibir sucesso, e atualizar a listagem.
3. WHEN a API retornar erro THEN system SHALL exibir alerta amigável do erro.

**Independent Test**: Clicar no botão, preencher o formulário com dados válidos e verificar se o novo usuário aparece na listagem.

---

### P2: Placeholder da aba Alunos

**User Story**: Como Coordenação, quero ver a aba "Alunos" com um botão de cadastro, para que eu saiba onde esse recurso ficará no futuro.

**Why P2**: Prepara o terreno visual para a próxima funcionalidade.

**Acceptance Criteria**:
1. WHEN clico na sub-aba "Alunos" THEN system SHALL exibir uma mensagem ou área de conteúdo com um botão "Cadastrar Aluno" desabilitado ou exibindo "Em breve".

**Independent Test**: Clicar na aba Alunos e visualizar o botão sem ação de sistema real atrelada.

---

## Edge Cases

- WHEN tentar cadastrar usuário com email já existente THEN system SHALL tratar o erro adequadamente (exibir mensagem que o email já está em uso).
- WHEN formulário de usuário for submetido vazio THEN system SHALL realizar validação de front-end (HTML required ou custom alert) impedindo a requisição.

---

## Requirement Traceability

| Requirement ID | Story       | Phase  | Status  |
| -------------- | ----------- | ------ | ------- |
| ADM-01         | P1: Sub-abas| Specify| Verified|
| ADM-02         | P1: Turmas  | Specify| Verified|
| ADM-03         | P1: Usuários| Specify| Verified|
| ADM-04         | P2: Alunos  | Specify| Verified|
| ADM-05         | P1: Lista Us| Specify| Verified|

**Coverage:** 5 total, 5 mapped to tasks, 0 unmapped ⚠️

---

## Success Criteria

- [x] Coordenação consegue navegar de forma independente e fluida entre as áreas de Usuários, Turmas e Alunos.
- [x] A listagem de usuários é exibida corretamente.
- [x] É possível clicar em "+ Cadastrar Usuário", ver o formulário, e cadastrar com sucesso um usuário via UI.
- [x] A gestão de turmas funciona perfeitamente dentro da sua nova sub-aba dedicada.
