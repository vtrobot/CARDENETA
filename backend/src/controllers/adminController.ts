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
  if (!papel) return res.status(400).json({ error: 'Parâmetro papel é obrigatório.' });

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('papel', papel)
      .order('nome', { ascending: true });

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
    // Criação do usuário via API Admin (não loga o usuário que está fazendo a requisição)
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
