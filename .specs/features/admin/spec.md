# Especificação: Épico 4 — Administração e Turmas (Gestão Escolar Básica)

## 1. Escopo e Objetivos
Para que o aplicativo tenha utilidade, ele precisa ser populado com os dados da escola. O Épico 4 entrega as ferramentas fundamentais para a **Coordenação** gerenciar a base de dados do sistema, permitindo estruturar as Turmas, matricular Alunos e criar os vínculos vitais (Professor ↔ Turma e Aluno ↔ Responsável).

**Objetivos:**
- Prover um painel administrativo seguro restrito à Coordenação.
- Permitir a criação e listagem de Turmas.
- Permitir a criação de Alunos e vinculá-los às Turmas.
- Criar os relacionamentos de segurança: associar Professores às Turmas (para que possam enviar comunicados) e Responsáveis aos Alunos (para que possam receber as mensagens).

## 2. Requisitos Associados (PRD)
- **US05:** Gestão Escolar. "Como Coordenação, quero cadastrar professores, turmas e responsáveis, para organizar a estrutura da escola."
- **RF04:** (Implícito) A plataforma depende de uma base relacional populada para que o RLS funcione. A Coordenação fará a ponte `professores_turmas` e `responsaveis_alunos`.

## 3. Casos de Uso e Comportamento (BDD)

### Cenário 1: Criar Nova Turma
**Dado** que um usuário "Coordenação" está no Painel de Gestão
**Quando** ele acessa a aba "Turmas" e preenche "Nome da Turma" e "Turno"
**Então** a API salva o registro e passa a listá-lo na grade.

### Cenário 2: Vincular Professor à Turma
**Dado** que uma turma "Pré-escola 1" já existe
**Quando** o Coordenador seleciona a turma e atribui um "Professor" previamente cadastrado (da tabela usuarios)
**Então** o sistema insere o registro na tabela `professores_turmas`
**E** aquele professor ganha automaticamente permissão (via RLS) para postar no mural daquela turma.

### Cenário 3: Proteção de Acesso
**Dado** que um "Professor" acessa o Painel de Gestão
**Quando** ele tenta visualizar a aba "Administração de Turmas"
**Então** o Front-end oculta a aba
**E** se tentar forçar o endpoint `POST /api/admin/turmas`, a API retorna `403 Forbidden` (Requer perfil coordenacao).

## 4. Endpoints da API (Backend)
Será criado um módulo novo `adminController`:
- `GET /api/admin/turmas`: Lista turmas e alunos associados.
- `POST /api/admin/turmas`: Cria turma.
- `GET /api/admin/usuarios`: Lista usuários filtrando por papel (para montar os selects de Professores e Responsáveis).
- `POST /api/admin/alunos`: Cria aluno.
- `POST /api/admin/vinculos`: Cria relações (Professor ↔ Turma, Aluno ↔ Turma, Responsável ↔ Aluno).

## 5. UI/UX (Frontend)
- O atual `/painel-gestao` será transformado em um Dashboard com navegação lateral (Tabs).
- **Tab 1: Comunicados (Existente)** - Disponível para Professores e Coordenação.
- **Tab 2: Turmas e Vínculos (Novo)** - Visível APENAS para Coordenação. Listagens simples (tabelas) e modais para cadastros rápidos de vínculos.

## 6. Restrições e Segurança (RLS)
- Tabelas primárias de cadastro (`turmas`, `alunos`, `professores_turmas`, `responsaveis_alunos`) só aceitam `INSERT`, `UPDATE` ou `DELETE` se o papel do autor for `coordenacao`.
- Leitura (`SELECT`) é liberada para a lógica do backend (Service Role) e para o app conforme o vínculo (Professores veem as turmas onde dão aula).
