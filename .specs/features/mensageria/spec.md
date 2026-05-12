# Especificação: Épico 2 — Mensageria Simples

## 1. Escopo e Objetivos
A Mensageria Simples introduz um canal direto e seguro de conversação entre a Família e a Escola. 
Diferente dos comunicados (que são broadcasts para a turma), as mensagens são bidirecionais (1:1).

**Objetivos:**
- Permitir que responsáveis entrem em contato direto com os professores das turmas de seus dependentes ou com a coordenação.
- Permitir que as respostas sejam encadeadas em "Threads", facilitando a leitura do histórico.
- Permitir iniciar uma conversa a partir de um comunicado específico (tirar dúvida sobre um aviso).

## 2. Requisitos Associados (PRD)
- **US03:** Envio de Mensagem Direta
- **RF09:** Responsável inicia conversa com Professor/Coordenação (Destinatário, Mensagem máx. 500 caracteres).
- **RF10:** Responder a comunicado mantendo histórico (Thread via `id_comunicado_origem`).

## 3. Casos de Uso e Comportamento (BDD)

### Cenário 1: Enviar Nova Mensagem (US03 / RF09)
**Dado** que o usuário está logado como "Responsável"
**Quando** acessa a funcionalidade "Nova Mensagem"
**Então** o sistema exibe um select contendo apenas os professores vinculados aos seus filhos, além da "Coordenação".
**E** ao enviar o texto (limite de 500 caracteres), o sistema grava a mensagem na tabela `mensagens_diretas`.

### Cenário 2: Tirar dúvida sobre um Comunicado (RF10)
**Dado** que o usuário está lendo um comunicado no Mural
**Quando** clica no botão "Tirar Dúvida" (Responder)
**Então** o sistema abre a interface de mensagem já vinculando automaticamente o `id_comunicado_origem` e definindo o autor do comunicado como `id_destinatario`.

### Cenário 3: Leitura e Resposta (Caixa de Entrada)
**Dado** que o usuário logado possui mensagens recebidas
**Quando** ele acessa a aba "Mensagens"
**Então** ele visualiza as mensagens ordenadas pelas mais recentes.
**Quando** ele clica para responder
**O sistema** grava a nova mensagem associando o `id_mensagem_resposta` à mensagem anterior, gerando o encadeamento (Thread).

## 4. Endpoints da API (Backend)

- `GET /api/mensagens`: Lista as threads/conversas do usuário autenticado (onde ele é remetente ou destinatário).
- `GET /api/mensagens/:id/thread`: Traz todas as mensagens pertencentes a uma mesma conversa.
- `POST /api/mensagens`: Envia nova mensagem. Payload: `{ corpo_texto, id_destinatario, id_comunicado_origem (opcional), id_mensagem_resposta (opcional) }`. 
  - Regra: API deve truncar ou rejeitar textos > 500 caracteres.
- `PUT /api/mensagens/:id/lida`: Marca a mensagem como visualizada pelo destinatário.

## 5. UI/UX (Frontend)
- **Tela de Mensagens (`/mensagens`)**: Layout no estilo "Caixa de Entrada" (Inbox), com lista de contatos à esquerda e chat/histórico da thread à direita.
- **Botão no Mural**: Adicionar botão secundário "Tirar Dúvida" ao lado do botão "Confirmar Ciência" no modal de detalhe do comunicado.
- **Validação de Formulário**: Indicador de caracteres em tempo real (ex: "340 / 500") no campo de input.

## 6. Restrições e Segurança (RLS)
- A tabela `mensagens_diretas` deve garantir que **apenas** o remetente ou o destinatário possam ler as mensagens. (Exceção: Coordenadores podem auditar mensagens? O PRD não especifica auditoria de mensagens privadas no MVP, então restringiremos estritamente a remetente/destinatário).
