# Especificação: Responsividade em Dispositivos Móveis

## 1. Escopo e Objetivos
Ajustar e aprimorar a interface do usuário para que a aplicação seja totalmente responsiva e utilizável em celulares com telas a partir de 320px de largura física (e especificamente em resoluções comuns como 1080x2340 / 360x780 lógico de 6,4 polegadas).

**Objetivos:**
- Evitar transbordamento horizontal de elementos de cabeçalho, tabelas e modais.
- Adaptar o fluxo de Mensagens para funcionar no modelo de "exibição condicional" em telas de celulares (mostrar apenas lista de contatos ou o chat ativo, nunca ambos simultaneamente).
- Melhorar o conforto visual em telas de toque (touchscreens), com botões de tamanho apropriado e áreas de clique confortáveis.

## 2. Requisitos Associados
- **RF-RESP-01:** O cabeçalho deve ocultar ou abreviar o nome longo da escola em dispositivos com largura de tela inferior a 768px.
- **RF-RESP-02:** A tela de Mensagens deve alternar dinamicamente entre a barra lateral (lista de conversas) e o histórico de chat ativo.
- **RF-RESP-03:** Deve existir um botão visível de "Voltar" no chat de Mensagens em telas móveis para desativar a conversa ativa e retornar à lista.
- **RF-RESP-04:** As tabelas do Painel de Gestão devem possuir rolagem horizontal independente (`overflow-x: auto`), sem distorcer o layout do container pai.

## 3. Casos de Uso e Comportamento (Responsividade)

### Cenário 1: Navegação no Celular (Largura < 768px)
- **Dado** que o usuário acessa o sistema por um celular de 6,4" (ex: 360px de largura lógica).
- **Quando** visualiza o Cabeçalho (`.app-header`).
- **Então** o título do site encolhe e os itens de navegação se organizam de maneira compacta sem quebrar a estrutura.

### Cenário 2: Chat Móvel - Seleção de Contato
- **Dado** que o usuário está na rota `/mensagens` no celular.
- **Quando** não há contato selecionado (`activeContact == null`).
- **Então** apenas a lista de conversas (`.inbox-sidebar`) é exibida cobrindo 100% da largura.
- **Quando** o usuário toca em uma conversa.
- **Então** o chat (`.inbox-chat`) é exibido cobrindo 100% da largura e a barra lateral de contatos é ocultada.
- **E** um botão "Voltar" é exibido no topo esquerdo do chat.

### Cenário 3: Chat Móvel - Retorno à Lista
- **Dado** que o usuário está visualizando uma conversa aberta no celular.
- **Quando** clica no botão "Voltar".
- **Então** o contato ativo é desmarcado (`activeContact = null`).
- **E** a tela exibe novamente a lista de conversas, ocultando o chat.
