# Spec: Vínculo de Responsável com Aluno

## Descrição
Este recurso permite que a coordenação escolar gerencie os vínculos entre alunos e seus respectivos responsáveis legais. Um aluno pode ter múltiplos responsáveis (ex: pai e mãe) e um responsável pode estar vinculado a múltiplos alunos (ex: irmãos).

## Requisitos de Negócio (Traceable IDs)
- **REQ-01**: Deve ser possível criar um vínculo entre um usuário (papel: 'responsavel') e um aluno.
- **REQ-02**: Deve ser possível definir o grau de parentesco (ex: Pai, Mãe, Avô) no momento do vínculo.
- **REQ-03**: Deve ser possível editar o grau de parentesco de um vínculo existente.
- **REQ-04**: Deve ser possível remover um vínculo entre responsável e aluno.
- **REQ-05**: Apenas usuários com papel de 'coordenacao' podem gerenciar esses vínculos.
- **REQ-06**: A tela de gestão de alunos deve exibir uma ação para gerenciar os responsáveis de cada aluno.
- **REQ-07**: O usuário deve poder visualizar a lista de responsáveis já vinculados ao aluno selecionado.
- **REQ-08**: A interface deve permitir a seleção de um usuário existente (tipo 'responsavel') para criar um novo vínculo.
- **REQ-09**: A interface deve permitir excluir um vínculo existente com confirmação.


## Endpoints Propostos

### 1. Criar Vínculo
- **URL**: `POST /admin/vinculos/aluno-responsavel`
- **Body**:
  ```json
  {
    "responsavel_id": "UUID",
    "aluno_id": "UUID",
    "grau_parentesco": "string"
  }
  ```
- **Sucesso**: 201 Created

### 2. Editar Vínculo
- **URL**: `PUT /admin/vinculos/aluno-responsavel/:id`
- **Body**:
  ```json
  {
    "grau_parentesco": "string"
  }
  ```
- **Sucesso**: 200 OK

### 3. Deletar Vínculo
- **URL**: `DELETE /admin/vinculos/aluno-responsavel/:id`
- **Sucesso**: 204 No Content

## Interface (Frontend)
### 1. Lista de Alunos
- Adicionar coluna "Responsáveis" ou botão de ação "🔗 Gerenciar Responsáveis" na tabela de alunos no Painel de Gestão.

### 2. Modal de Gerenciamento de Responsáveis
- **Título**: Gerenciar Responsáveis - [Nome do Aluno]
- **Seção de Vínculos Atuais**: Tabela/Lista com [Nome do Responsável], [Grau de Parentesco] e botão de [Remover].
- **Seção de Novo Vínculo**:
  - Select para escolher o Responsável (filtrar usuários com papel 'responsavel').
  - Input/Select para definir Grau de Parentesco.
  - Botão "Vincular".

## Considerações Técnicas
- Utilizar a tabela `responsaveis_alunos`.
- Garantir que `responsavel_id` aponta para um usuário com `papel = 'responsavel'`.
- Validar se o vínculo já existe (UNIQUE constraint no DB).
- Backend: Endpoints já implementados em `adminController.ts`.
- Frontend: Implementar novos métodos no `services/api.ts` e integrar no `PainelGestao.tsx`.
