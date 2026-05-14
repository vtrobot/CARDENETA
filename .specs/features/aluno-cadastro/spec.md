# Especificação: Cadastro de Aluno

## 1. Visão Geral
Esta funcionalidade permite que a coordenação realize o cadastro de alunos no sistema, vinculando-os a uma turma, e visualize a lista de alunos cadastrados em uma grid dentro do Painel de Gestão.

## 2. Histórias de Usuário (Traceability)
| ID | Descrição | Origem |
|---|---|---|
| REQ-ALU-01 | Implementar endpoint POST `/admin/alunos` para cadastro. | Historia 1 |
| REQ-ALU-02 | Implementar endpoint GET `/admin/alunos` para listagem. | Historia 2 |
| REQ-ALU-03 | Disponibilizar endpoints no Swagger. | Historia 1 |
| REQ-ALU-04 | Criar aba "Alunos" na Administração Escolar com grid de visualização. | Historia 2 |
| REQ-ALU-05 | Criar formulário de cadastro de aluno com campos: Nome, Matrícula, Data de Nascimento e Turma. | Historia 3 |
| REQ-ALU-06 | Exibir mensagem de sucesso após o cadastro. | Historia 3 |

## 3. Detalhes Técnicos

### Backend
- **Endpoint POST `/admin/alunos`**:
  - Request Body: `{ nome, matricula, data_nascimento, turma_id }`
  - Validação: Todos os campos são obrigatórios. `matricula` deve ser única.
  - Resposta: 201 (Created) ou 400 (Bad Request).
- **Endpoint GET `/admin/alunos`**:
  - Resposta: Lista de objetos aluno `{ id, nome, matricula, data_nascimento, turma_id, turmas (nome) }`.

### Frontend
- **Grid de Alunos**: Colunas: Nome, Matrícula, Turma, Data de Nascimento.
- **Formulário**: Modal ou seção expansível (seguindo o padrão das Turmas).
- **Feedback**: Usar `alert` (padrão atual do projeto) ou toast para sucesso/erro.

## 4. Escopo Auto-Sized
- **Complexidade**: Média (Backend + Frontend).
- **Fases aplicadas**: Specify, Tasks, Execute.
