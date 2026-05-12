# Tasks: Épico 2 — Mensageria Simples

## Back-end (Node.js/Express)

- [x] **B1: Políticas de Segurança (RLS) no Supabase**
  - Adicionar as policies para `mensagens_diretas` garantindo acesso estrito ao `remetente_id` ou `destinatario_id`.
- [x] **B2: Controller/Service GET `/api/mensagens`**
  - Retornar uma lista de "Conversas" agrupadas (onde o usuário participa).
- [x] **B3: Controller/Service GET `/api/mensagens/:id/thread`**
  - Retornar o histórico sequencial de uma conversa baseada no `id_mensagem_resposta` ou `id_comunicado_origem`.
- [x] **B4: Controller/Service POST `/api/mensagens`**
  - Inserir nova mensagem.
  - Implementar validação: Sanitização XSS básica e bloqueio de `corpo_texto` > 500 caracteres.
- [x] **B5: Rota de Marcar como Lido (`PUT /api/mensagens/:id/lida`)**
  - Atualiza o campo `lida = true` caso o usuário autenticado seja o `destinatario_id`.

## Front-end (React/Vite)

- [x] **F1: Adicionar Rota `/mensagens`**
  - Criar o arquivo `Mensagens.tsx`, incluir no roteador (`App.tsx`) e na Navigation Bar.
- [x] **F2: Layout "Inbox" (Lista de Conversas + Área do Chat)**
  - Construir CSS em grid separando as conversas da área de visualização das respostas.
- [x] **F3: Envio de Nova Mensagem e Respostas**
  - Formulário contendo restrição visual de limite de caracteres (500).
  - Integrar disparo com `POST /api/mensagens` via TanStack Query.
- [x] **F4: Integração com o Mural de Comunicados**
  - Atualizar o `ComunicadoModal` (do Épico 1) para exibir o botão "Dúvidas?".
  - Esse botão deve redirecionar/abrir modal preenchendo automaticamente o `id_destinatario` (autor do comunicado) e `id_comunicado_origem`.
