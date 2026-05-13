-- Script para popular o banco de dados com dados de teste (Seeds)

-- Usando os usuários que JÁ EXISTEM no seu banco:
-- '013b1ecd-f817-4732-8304-367c3ba571db' (Diretora Ana - coordenacao)
-- 'fd4ceebd-0175-4e25-8f71-013143cbdfbe' (Professor João - professor)
-- '1d210d1d-6c17-4cff-aa1a-65379dca5b3d' (Pai da Maria - responsavel)

-- 1. Inserir Turmas
INSERT INTO public.turmas (id, nome, ano_letivo, turno) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maternal 1 - A', 2026, 'manha'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jardim 2 - B', 2026, 'tarde');

-- 2. Vincular Professor à Turma (Professor João nas duas turmas)
INSERT INTO public.professores_turmas (professor_id, turma_id) VALUES 
('fd4ceebd-0175-4e25-8f71-013143cbdfbe', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('fd4ceebd-0175-4e25-8f71-013143cbdfbe', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- 3. Inserir Alunos (Maria)
INSERT INTO public.alunos (id, nome, matricula, data_nascimento, turma_id) VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Maria', 'MAT2026001', '2022-05-10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- 4. Vincular Responsável ao Aluno (Pai da Maria vinculado a Maria)
INSERT INTO public.responsaveis_alunos (responsavel_id, aluno_id, grau_parentesco) VALUES 
('1d210d1d-6c17-4cff-aa1a-65379dca5b3d', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pai');

-- 5. Inserir Comunicados (Criados pela Diretora Ana e Professor João)
INSERT INTO public.comunicados (id, titulo, corpo_texto, autor_id, turma_id, nivel_urgencia) VALUES 
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Reunião de Pais e Mestres', 'Caros responsáveis, teremos reunião na próxima sexta-feira às 18h.', '013b1ecd-f817-4732-8304-367c3ba571db', NULL, 'alta'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Festa Junina da Escola', 'Nossa festa será no dia 20. Mandem os alunos caracterizados!', 'fd4ceebd-0175-4e25-8f71-013143cbdfbe', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baixa');

-- 6. Inserir Leituras de Comunicados (Pai da Maria já leu a Reunião)
INSERT INTO public.leituras_comunicados (comunicado_id, responsavel_id, assinatura_digital) VALUES 
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '1d210d1d-6c17-4cff-aa1a-65379dca5b3d', 'Pai da Maria 12345');

-- 7. Inserir Mensagens Diretas (Pai da Maria falando com o Professor João)
INSERT INTO public.mensagens_diretas (remetente_id, destinatario_id, aluno_id, corpo_texto, lida) VALUES 
('1d210d1d-6c17-4cff-aa1a-65379dca5b3d', 'fd4ceebd-0175-4e25-8f71-013143cbdfbe', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bom dia Professor, a Maria não vai hoje pois está gripada.', FALSE),
('fd4ceebd-0175-4e25-8f71-013143cbdfbe', '1d210d1d-6c17-4cff-aa1a-65379dca5b3d', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Obrigado por avisar! Melhoras para ela.', FALSE);

-- 8. Inserir Notificações
INSERT INTO public.notificacoes (usuario_id, titulo, mensagem, tipo, referencia_id) VALUES 
('1d210d1d-6c17-4cff-aa1a-65379dca5b3d', 'Novo Comunicado', 'Você tem um novo comunicado de urgência alta: Reunião de Pais', 'comunicado', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');
