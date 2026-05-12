-- Políticas de Segurança (RLS) para o Épico 1: Mural de Comunicados

-- Criação de uma function auxiliar para pegar o perfil do usuário logado
CREATE OR REPLACE FUNCTION get_user_role(uid UUID) RETURNS VARCHAR AS $$
  SELECT papel FROM public.usuarios WHERE id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ==========================================
-- POLÍTICAS PARA A TABELA: comunicados
-- ==========================================

-- Coordenadores podem ver, criar, atualizar e deletar TUDO.
CREATE POLICY "Coordenacao_All_Comunicados" ON public.comunicados
  FOR ALL
  USING ( get_user_role(auth.uid()) = 'coordenacao' );

-- Professores podem ler comunicados das turmas onde dão aula
CREATE POLICY "Professor_Select_Comunicados" ON public.comunicados
  FOR SELECT
  USING (
    get_user_role(auth.uid()) = 'professor' AND
    turma_id IN (SELECT turma_id FROM public.professores_turmas WHERE professor_id = auth.uid())
  );

-- Professores podem criar/atualizar/deletar comunicados apenas para turmas onde dão aula
CREATE POLICY "Professor_Write_Comunicados" ON public.comunicados
  FOR ALL
  USING (
    get_user_role(auth.uid()) = 'professor' AND
    autor_id = auth.uid() AND
    turma_id IN (SELECT turma_id FROM public.professores_turmas WHERE professor_id = auth.uid())
  );

-- Responsáveis podem ler comunicados destinados às turmas dos seus filhos
CREATE POLICY "Responsavel_Select_Comunicados" ON public.comunicados
  FOR SELECT
  USING (
    get_user_role(auth.uid()) = 'responsavel' AND
    turma_id IN (
      SELECT a.turma_id 
      FROM public.alunos a 
      INNER JOIN public.responsaveis_alunos ra ON a.id = ra.aluno_id 
      WHERE ra.responsavel_id = auth.uid()
    )
  );


-- ==========================================
-- POLÍTICAS PARA A TABELA: leituras_comunicados
-- ==========================================

-- Professores e Coordenadores podem ler todas as leituras referentes às suas turmas ou gerais.
CREATE POLICY "Staff_Select_Leituras" ON public.leituras_comunicados
  FOR SELECT
  USING ( get_user_role(auth.uid()) IN ('coordenacao', 'professor') );

-- Responsável pode ler apenas seus próprios registros de leitura
CREATE POLICY "Responsavel_Select_Leituras" ON public.leituras_comunicados
  FOR SELECT
  USING ( responsavel_id = auth.uid() );

-- Responsável pode atualizar (confirmar ciência/leitura) apenas seus próprios registros
CREATE POLICY "Responsavel_Update_Leituras" ON public.leituras_comunicados
  FOR UPDATE
  USING ( responsavel_id = auth.uid() )
  WITH CHECK ( responsavel_id = auth.uid() );
