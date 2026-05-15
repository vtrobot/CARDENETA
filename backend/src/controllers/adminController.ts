import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';

export const getTurmas = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('turmas')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTurma = async (req: Request, res: Response) => {
  const { nome, turno, ano_letivo } = req.body;
  if (!nome || !turno || !ano_letivo) return res.status(400).json({ error: 'Nome, turno e ano_letivo são obrigatórios.' });

  const normalizedTurno = turno.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  try {
    const { data, error } = await supabase
      .from('turmas')
      .insert([{ nome, turno: normalizedTurno, ano_letivo }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message, valueSent: normalizedTurno });
  }
};

export const getUsuariosByPapel = async (req: Request, res: Response) => {
  const { papel } = req.query;

  try {
    let query = supabase
      .from('usuarios')
      .select('id, nome, email, papel')
      .order('nome', { ascending: true });

    if (papel) {
      query = query.eq('papel', papel);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createVinculoProfessorTurma = async (req: Request, res: Response) => {
  const { professor_id, turma_id } = req.body;
  try {
    const { data, error } = await supabase
      .from('professores_turmas')
      .insert([{ professor_id, turma_id }])
      .select();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Vínculo já existe.' });
      throw error;
    }
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha, papel } = req.body;
  
  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({ error: 'Nome, email, senha e papel são obrigatórios.' });
  }

  const papeisPermitidos = ['professor', 'responsavel', 'coordenacao'];
  if (!papeisPermitidos.includes(papel)) {
    return res.status(400).json({ error: 'Papel inválido. Permitidos: professor, responsavel, coordenacao.' });
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, papel }
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Inserção na tabela `usuarios`
    // (Ignoramos erro de violação de chave única (23505) caso um trigger no DB já tenha inserido)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .insert([{ id: userId, nome, email, papel }])
      .select()
      .single();

    if (userError && userError.code !== '23505') {
      throw userError;
    }

    res.status(201).json(userData || { id: userId, nome, email, papel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ALUNOS
export const getAlunos = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('alunos')
      .select(`
        *,
        turmas (
          nome
        )
      `)
      .order('nome', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAluno = async (req: Request, res: Response) => {
  const { nome, matricula, data_nascimento, turma_id } = req.body;

  if (!nome || !matricula || !data_nascimento) {
    return res.status(400).json({ error: 'Nome, matrícula e data de nascimento são obrigatórios.' });
  }

  try {
    const { data, error } = await supabase
      .from('alunos')
      .insert([{ 
        nome, 
        matricula, 
        data_nascimento, 
        turma_id: turma_id || null 
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Matrícula já cadastrada.' });
      throw error;
    }

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// VÍNCULOS RESPONSÁVEL-ALUNO
export const createVinculoAlunoResponsavel = async (req: Request, res: Response) => {
  const { responsavel_id, aluno_id, grau_parentesco } = req.body;

  if (!responsavel_id || !aluno_id || !grau_parentesco) {
    return res.status(400).json({ error: 'responsavel_id, aluno_id e grau_parentesco são obrigatórios.' });
  }

  try {
    // Validar se o usuário é um responsável
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('papel')
      .eq('id', responsavel_id)
      .single();

    if (userError || user?.papel !== 'responsavel') {
      return res.status(400).json({ error: 'O usuário fornecido não possui o papel de responsável.' });
    }

    const { data, error } = await supabase
      .from('responsaveis_alunos')
      .insert([{ responsavel_id, aluno_id, grau_parentesco }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Este vínculo já existe.' });
      throw error;
    }

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVinculoAlunoResponsavel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { grau_parentesco } = req.body;

  if (!grau_parentesco) {
    return res.status(400).json({ error: 'grau_parentesco é obrigatório para atualização.' });
  }

  try {
    const { data, error } = await supabase
      .from('responsaveis_alunos')
      .update({ grau_parentesco })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVinculoAlunoResponsavel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('responsaveis_alunos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getVinculosByAluno = async (req: Request, res: Response) => {
  const { alunoId } = req.params;

  try {
    const { data, error } = await supabase
      .from('responsaveis_alunos')
      .select(`
        id,
        grau_parentesco,
        usuarios (
          id,
          nome,
          email
        )
      `)
      .eq('aluno_id', alunoId);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
