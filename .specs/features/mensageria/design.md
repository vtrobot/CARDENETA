# Design: Mensageria Simples

## Arquitetura de Dados

A tabela `mensagens_diretas` no Supabase deve conter:
- `id` (uuid, PK)
- `corpo_texto` (text, limit 500)
- `remetente_id` (uuid, FK usuarios)
- `destinatario_id` (uuid, FK usuarios)
- `aluno_id` (uuid, FK alunos, nullable)
- `data_envio` (timestamp)
- `lida` (boolean, default false)

### Row Level Security (RLS)
```sql
ALTER TABLE mensagens_diretas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias mensagens"
ON mensagens_diretas FOR SELECT
USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);

CREATE POLICY "Usuários podem enviar mensagens"
ON mensagens_diretas FOR INSERT
WITH CHECK (auth.uid() = remetente_id);

CREATE POLICY "Destinatário pode marcar como lida"
ON mensagens_diretas FOR UPDATE
USING (auth.uid() = destinatario_id)
WITH CHECK (auth.uid() = destinatario_id);
```

## Componentes Frontend

### 1. Pagina `Mensagens.tsx` (Já existente)
- Refatorar para garantir que o `currentUserId` seja dinâmico (vindo do contexto de autenticação, não localStorage mock).
- Implementar lógica de "Nova Conversa" caso o `presetDestinatario` não esteja na lista.

### 2. Painel de Gestão -> `AlunosTab.tsx`
- Adicionar handler no botão de mensagem para abrir um modal de seleção de responsável.
- O modal deve listar os responsáveis vinculados ao aluno (buscados via API).
- Ao selecionar, navega para `/mensagens` com o `contato_id` selecionado.

### 3. Barra de Navegação / Header
- Adicionar badge de mensagens não lidas global (opcional para o MVP, mas bom para UX).

## Fluxo de Interação

1. **Escola -> Responsável**:
   - `AlunosTab` -> Clique 💬 -> Modal de Seleção de Responsável -> Navega para `/mensagens` com `presetDestinatario`.
   - `/mensagens` carrega thread ou inicia vazia.

2. **Responsável -> Escola**:
   - Menu `Mensagens` -> Lista de conversas.
   - Botão "Nova Conversa" -> Lista automaticamente os professores das turmas dos filhos vinculados.

## Decisões Tomadas
- **Fluxo de Responsáveis**: Modal de seleção (Opção 1).
- **Visibilidade de Professores**: Restrito aos professores das turmas dos filhos.
