# Tasks: Implementação da Mensageria

## Backend & Banco de Dados
- [ ] **T01**: Verificar/Ajustar RLS na tabela `mensagens_diretas`.
- [ ] **T02**: Validar se o endpoint `POST /mensagens` está associando corretamente o `aluno_id` se fornecido.
- [ ] **T03**: Adicionar suporte a filtro de "contatos sugeridos" (ex: professores do meu filho).

## Frontend - Infraestrutura
- [ ] **T04**: Remover mocks de ID de usuário em `Mensagens.tsx` e usar o hook `useAuth`.
- [ ] **T05**: Garantir que o `api.ts` tenha todos os métodos necessários (fetchConversas, fetchThread, enviarMensagem, marcarMensagemLida).

## Frontend - Fluxo Escola -> Responsável
- [ ] **T06**: No `AlunosTab.tsx`, criar o modal `ModalSelecaoResponsavel` que busca e lista os responsáveis do aluno e navega para `/mensagens` ao selecionar.
- [ ] **T07**: Implementar navegação programática para `/mensagens` passando o `responsavel_id` no state.

## Frontend - Fluxo Responsável -> Escola
- [ ] **T08**: Na página de `Mensagens.tsx`, implementar o botão "Nova Conversa" que filtra e lista apenas os professores vinculados às turmas dos filhos do usuário.
- [ ] **T09**: Melhorar o visual das bolhas de mensagem (distinção Clara entre 'eu' e 'eles').

## Polimento & UX
- [ ] **T10**: Implementar contador de mensagens não lidas no menu principal.
- [ ] **T11**: Adicionar feedback visual (loading states e toasts de erro/sucesso).

## Verificação
- [ ] **V01**: Testar envio de mensagem do Professor para o Responsável.
- [ ] **V02**: Testar resposta do Responsável para o Professor.
- [ ] **V03**: Verificar se o contador de mensagens não lidas atualiza corretamente.
