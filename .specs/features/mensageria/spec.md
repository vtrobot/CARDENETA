# Spec: Troca de Mensagens (Mensageria Simples)

Funcionalidade de comunicação direta e privada entre a escola (professores/coordenação) e os responsáveis pelos alunos.

## Requisitos de Negócio (Busines Rules)

- **RN01 (Privacidade)**: Mensagens são privadas entre o remetente e o destinatário.
- **RN02 (Contexto)**: Mensagens enviadas pela escola devem estar associadas a um aluno (opcional no banco, mas recomendado no fluxo).
- **RN03 (Integridade)**: Mensagens não podem ser editadas ou excluídas após o envio (para fins de auditoria).
- **RN04 (Limitação)**: Máximo de 500 caracteres por mensagem.

## Requisitos Funcionais (User Stories)

- **RF01 (Listagem de Conversas)**: O usuário deve visualizar uma lista de conversas ativas, ordenadas pela mais recente.
- **RF02 (Histórico de Mensagens)**: Ao selecionar uma conversa, o usuário deve ver o histórico completo (thread).
- **RF03 (Envio de Mensagem)**: O usuário deve poder enviar mensagens de texto simples.
- **RF04 (Indicação de Leitura)**: O remetente deve saber se a mensagem foi lida (check duplo).
- **RF05 (Atalho via Aluno)**: No painel de gestão, ao clicar no ícone de mensagem de um aluno, deve abrir um modal para selecionar qual responsável contatar (caso haja mais de um). Após a seleção, o professor/coordenador é levado à tela de mensagens.
- **RF06 (Contatos do Responsável)**: O responsável só pode iniciar conversas com professores vinculados à turma de seus filhos.
- **RF07 (Notificação Visual)**: O usuário deve ver um contador de mensagens não lidas no menu ou lista de conversas.

## Requisitos Técnicos

- **RT01 (Backend)**: Endpoints REST para CRUD de mensagens (já parcialmente implementados).
- **RT02 (Segurança)**: RLS (Row Level Security) no Supabase para garantir que apenas remetente/destinatário acessem as mensagens.
- **RT03 (Frontend)**: Uso de TanStack Query para gerenciamento de estado e pooling (ou WebSockets no futuro).

## Critérios de Aceite

1. O responsável consegue responder a uma mensagem enviada pela escola.
2. O coordenador consegue iniciar uma conversa com um responsável a partir da aba de Alunos.
3. Mensagens lidas são marcadas visualmente como tal.
4. O contador de caracteres impede o envio de textos > 500 chars.
