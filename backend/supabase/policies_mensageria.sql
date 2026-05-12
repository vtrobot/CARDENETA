-- Políticas de Segurança (RLS) para o Épico 2: Mensageria Simples

-- ==========================================
-- POLÍTICAS PARA A TABELA: mensagens_diretas
-- ==========================================

-- Usuários só podem visualizar mensagens se forem o remetente ou o destinatário
CREATE POLICY "Select_Mensagens_Proprias" ON public.mensagens_diretas
  FOR SELECT
  USING (
    remetente_id = auth.uid() OR destinatario_id = auth.uid()
  );

-- Usuários só podem inserir mensagens se eles forem definidos como o remetente
CREATE POLICY "Insert_Mensagens_Proprias" ON public.mensagens_diretas
  FOR INSERT
  WITH CHECK (
    remetente_id = auth.uid()
  );

-- Usuários só podem atualizar a mensagem (ex: marcar como lida) se forem o destinatário
CREATE POLICY "Update_Mensagens_Destinatario" ON public.mensagens_diretas
  FOR UPDATE
  USING (
    destinatario_id = auth.uid()
  )
  WITH CHECK (
    destinatario_id = auth.uid()
  );

-- Ninguém pode deletar mensagens no MVP
CREATE POLICY "No_Delete_Mensagens" ON public.mensagens_diretas
  FOR DELETE
  USING ( false );
