# Plano de Implementação: Cadastro de Comunicado

Este plano descreve as etapas para implementar/melhorar o cadastro de comunicados, garantindo que o endpoint esteja robusto e a interface de usuário completa.

## 1. Especificação (Specify)
- **Objetivo**: Permitir que Professores e Coordenadores cadastrem comunicados direcionados a turmas específicas.
- **Payload**: `{ titulo, corpo_texto, nivel_urgencia, id_turma_destino }`.
- **Regras de Negócio**:
  - Somente usuários com papel `professor` ou `coordenacao` podem criar comunicados.
  - Se for `professor`, deve haver vínculo prévio com a `turma_id` informada.
  - `nivel_urgencia` deve ser validado (baixa, media, alta).

## 2. Design
- **Backend**: Utilizar o controlador `comunicadosController.ts`.
- **Frontend**: Adicionar um `Select` no formulário de "Novo Comunicado" no `PainelGestao.tsx` para escolher a turma destino.

## 3. Tarefas (Tasks)

### Backend
- [ ] **T1: Refinar Validações no Controller**
  - Validar presença de todos os campos obrigatórios.
  - Validar valores permitidos para `nivel_urgencia`.
- [ ] **T2: Documentação Swagger**
  - Adicionar anotação `@swagger` para o método `createComunicado`.

### Frontend
- [ ] **T3: Carregar Turmas no PainelGestao**
  - Garantir que o `Select` de turmas seja populado com dados reais da API.
- [ ] **T4: Atualizar Formulário de Cadastro**
  - Incluir o campo `turma_id` no estado e na UI.
  - Garantir que o envio (Mutation) use o ID da turma selecionada.

## 4. Execução (Execute)
- Implementar as tarefas sequencialmente.
- Verificar com testes manuais ou via Swagger.
- Realizar Auditoria de Qualidade Web.
