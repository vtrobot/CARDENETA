-- Políticas de Segurança (RLS) para o Épico 4: Administração Escolar

-- ==========================================
-- POLÍTICAS PARA A TABELA: turmas
-- ==========================================
-- A coordenação tem acesso total às turmas
CREATE POLICY "Coordenacao_All_Turmas" ON public.turmas
  FOR ALL
  USING (get_user_role(auth.uid()) = 'coordenacao')
  WITH CHECK (get_user_role(auth.uid()) = 'coordenacao');

-- Professores podem apenas visualizar todas as turmas (ou as que dão aula, mas para seleção de filtros, ver todas é útil)
CREATE POLICY "Professores_Select_Turmas" ON public.turmas
  FOR SELECT
  USING (get_user_role(auth.uid()) IN ('professor', 'coordenacao'));


-- ==========================================
-- POLÍTICAS PARA A TABELA: alunos
-- ==========================================
-- A coordenação tem acesso total aos alunos
CREATE POLICY "Coordenacao_All_Alunos" ON public.alunos
  FOR ALL
  USING (get_user_role(auth.uid()) = 'coordenacao')
  WITH CHECK (get_user_role(auth.uid()) = 'coordenacao');


-- ==========================================
-- POLÍTICAS PARA VÍNCULOS
-- ==========================================
-- professores_turmas
CREATE POLICY "Coordenacao_All_Prof_Turmas" ON public.professores_turmas
  FOR ALL
  USING (get_user_role(auth.uid()) = 'coordenacao');

-- responsaveis_alunos
CREATE POLICY "Coordenacao_All_Resp_Alunos" ON public.responsaveis_alunos
  FOR ALL
  USING (get_user_role(auth.uid()) = 'coordenacao');
