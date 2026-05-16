# Tarefas: Melhorias do Painel de Gestão

## Fase 1: Refatoração e Acessibilidade Base

- [ ] **T1: Criar componentes de aba vazios**
  - Criar diretório `frontend/src/pages/PainelGestaoTabs/`.
  - Criar arquivos base para `ComunicadosTab`, `UsuariosTab`, `TurmasTab` e `AlunosTab`.
  - *Verificação*: Arquivos criados com exportação básica.

- [ ] **T2: Migrar Aba de Comunicados**
  - Mover lógica e JSX de comunicados para `ComunicadosTab.tsx`.
  - Aplicar correções WCAG (Labels e Aria-labels).
  - *Verificação*: Aba funcionando e acessível.

- [ ] **T3: Migrar Aba de Usuários**
  - Mover lógica e JSX de usuários para `UsuariosTab.tsx`.
  - Aplicar correções WCAG.
  - *Verificação*: Aba funcionando e acessível.

- [ ] **T4: Migrar Aba de Turmas**
  - Mover lógica e JSX de turmas para `TurmasTab.tsx`.
  - Aplicar correções WCAG.
  - *Verificação*: Aba funcionando e acessível.

- [ ] **T5: Migrar Aba de Alunos**
  - Mover lógica e JSX de alunos para `AlunosTab.tsx`.
  - Aplicar correções WCAG.
  - *Verificação*: Aba funcionando e acessível.

## Fase 2: Novas Funcionalidades (Aba Alunos)

- [ ] **T6: Implementar Filtro por Turma**
  - Adicionar combobox de turmas.
  - Implementar lógica de filtragem na listagem.
  - *Verificação*: Ao selecionar uma turma, apenas os respectivos alunos aparecem.

- [ ] **T7: Adicionar Ícone de Mensagem**
  - Adicionar botão com ícone de mensagem na tabela de alunos.
  - Adicionar `aria-label="Enviar mensagem ao responsável"`.
  - *Verificação*: Ícone visível e com label de acessibilidade.

## Fase 3: Limpeza Final

- [ ] **T8: Simplificar PainelGestao.tsx**
  - Remover código migrado e importar os novos componentes.
  - *Verificação*: O painel continua funcionando perfeitamente como antes, mas com código limpo.
