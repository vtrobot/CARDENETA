# Especificação: Épico 1 — Mural de Comunicados

## 1. Escopo e Objetivos
O Mural de Comunicados é a funcionalidade central para garantir a comunicação oficial e rastreável da escola com a família.
**Objetivos:**
- Substituir a caderneta física.
- Fornecer feed de comunicados para responsáveis com filtro por aluno.
- Garantir rastreabilidade de leituras e "Ciência" para comunicados de Alta urgência.
- Permitir que professores e coordenadores criem, editem e gerenciem os comunicados de suas respectivas turmas.

## 2. Requisitos Associados (PRD)
- **US01:** Leitura e Filtro do Feed
- **US02:** Assinatura de Ciência (Alta Urgência)
- **RF04, RF05, RF06, RF07, RF08**
- **RN01, RN02, RN03**

## 3. Casos de Uso e Comportamento (BDD)

### Cenário 1: Responsável visualizando o Feed (US01)
**Dado** que o usuário está logado com perfil "Responsável"
**Quando** acessa a rota `/mural`
**Então** o sistema exibe os comunicados das turmas dos seus alunos dependentes, ordenados do mais recente para o mais antigo.
**E** exibe visualmente o status de "Lido" ou "Não Lido".

### Cenário 2: Confirmação de Ciência (US02)
**Dado** que existe um comunicado com urgência "ALTA"
**E** o responsável clica para visualizar o detalhe do comunicado
**Então** o status permanece "Pendente"
**E** o sistema exibe obrigatoriamente um botão "Confirmar Ciência"
**Quando** o responsável clica no botão
**Então** o sistema registra a data/hora e marca `ciencia_confirmada = TRUE`.

### Cenário 3: Professor criando Comunicado
**Dado** que o usuário está logado como "Professor"
**Quando** acessa o formulário de criação de comunicados
**Então** ele só pode selecionar as turmas às quais está vinculado.
**Quando** o comunicado é salvo
**Então** é gerado o registro na tabela `comunicados` e os respectivos logs de controle.

## 4. Endpoints da API (Backend)

- `GET /api/comunicados`: Lista comunicados (Filtros: `turma_id`, `aluno_id`, `status`). Retorna de forma paginada.
- `GET /api/comunicados/:id`: Detalhe do comunicado (Registra `status_lido` se for Responsável e urgência não for Alta).
- `POST /api/comunicados`: Cria novo comunicado (Somente Professor/Coordenação). Payload: `{ titulo, corpo_texto, nivel_urgencia, id_turma_destino }`.
- `PUT /api/comunicados/:id`: Edita comunicado.
- `DELETE /api/comunicados/:id`: Exclui comunicado.
- `POST /api/comunicados/:id/ciencia`: Registra `ciencia_confirmada` para o Responsável logado.

## 5. UI/UX (Frontend)
- **Feed (`/mural`)**: Lista em formato de cards. Os cards devem mostrar: Título, Data, Remetente, Urgência (cores semânticas: verde=baixa, amarelo=média, vermelho=alta).
- **Filtros**: Select para filtrar dependente (se o responsável tiver mais de um filho matriculado).
- **Botão de Ciência**: Visível de forma proeminente no modal/página de detalhe, bloqueando o status de leitura até o clique.
- **Painel de Gestão (`/painel-gestao/comunicados`)**: Tabela ou lista administrativa com botões de "Novo", "Editar" e "Excluir".

## 6. Restrições e Segurança (RLS)
- Responsável: `SELECT` na tabela `comunicados` onde a turma pertence aos seus dependentes.
- Professor: `SELECT/INSERT/UPDATE/DELETE` na tabela `comunicados` onde a turma está vinculada a ele na tabela `professores_turmas`.
- Coordenação: Acesso total (todas as turmas).
