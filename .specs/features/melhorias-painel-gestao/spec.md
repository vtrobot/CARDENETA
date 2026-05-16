# Especificação: Melhorias e Refatoração do Painel de Gestão

## Objetivo
Melhorar a acessibilidade, organização de código e funcionalidade do Painel de Gestão, garantindo conformidade com padrões WCAG e facilitando a manutenção futura através da refatoração em componentes menores.

## Requisitos

### 1. Acessibilidade (WCAG)
- **REQ-01**: Todas as associações de Label/Input devem usar o atributo `htmlFor` no Label e `id` correspondente no Input.
- **REQ-02**: Todos os botões de ícone (`btn-icon`) devem possuir o atributo `aria-label` descrevendo sua ação.

### 2. Refatoração de Código
- **REQ-03**: O componente `PainelGestao` deve ser refatorado para separar o conteúdo das abas em arquivos distintos dentro de `frontend/src/pages/PainelGestaoTabs/`:
  - `ComunicadosTab.tsx`
  - `UsuariosTab.tsx`
  - `TurmasTab.tsx`
  - `AlunosTab.tsx`

### 3. Funcionalidades da Aba Alunos
- **REQ-04**: Implementar filtro por turma na listagem de alunos.
  - Deve haver um Combobox (Select) com as turmas disponíveis.
  - Ao selecionar uma turma, a lista de alunos deve ser filtrada para mostrar apenas os vinculados a essa turma.
  - Se "Todas as Turmas" estiver selecionado, mostrar todos.
- **REQ-05**: Adicionar ícone de mensagem para o responsável na lista de alunos.
  - O ícone deve estar localizado à direita do botão de ações atual.
  - Não requer implementação de lógica de envio nesta fase, apenas a presença visual do botão.

## Critérios de Aceite
- Os formulários passam em validadores de acessibilidade simples (Label associado corretamente).
- O código do `PainelGestao.tsx` é reduzido drasticamente, servindo apenas como orquestrador das abas.
- A filtragem de alunos funciona instantaneamente ao mudar o valor do select (filtragem client-side é aceitável se a query trouxer todos, ou atualizar a query se necessário).
- O ícone de mensagem (ex: 💬 ou ícone de envelope) aparece na linha de cada aluno.
