import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../supabaseClient';

export const getConversas = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    // Para simplificar no MVP, buscamos as mensagens e agrupamos no backend
    // Em produção, uma view ou RPC no PostgreSQL seria mais performático
    const { data: mensagens, error } = await supabaseAdmin
      .from('mensagens_diretas')
      .select('*, remetente:remetente_id(nome), destinatario:destinatario_id(nome)')
      .or(`remetente_id.eq.${user.id},destinatario_id.eq.${user.id}`)
      .order('data_envio', { ascending: false });

    if (error) throw error;

    // Agrupar por contato
    const conversasMap = new Map();

    mensagens?.forEach((msg: any) => {
      const isRemetente = msg.remetente_id === user.id;
      const contactId = isRemetente ? msg.destinatario_id : msg.remetente_id;
      const contactName = isRemetente ? msg.destinatario?.nome : msg.remetente?.nome;

      if (!conversasMap.has(contactId)) {
        conversasMap.set(contactId, {
          contato_id: contactId,
          contato_nome: contactName || 'Usuário',
          ultima_mensagem: msg.corpo_texto,
          data_envio: msg.data_envio,
          nao_lidas: (!isRemetente && !msg.lida) ? 1 : 0
        });
      } else {
        const c = conversasMap.get(contactId);
        if (!isRemetente && !msg.lida) c.nao_lidas += 1;
      }
    });

    res.json(Array.from(conversasMap.values()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getThread = async (req: Request, res: Response) => {
  const { id } = req.params; // id do contato para listar a thread (ou id do comunicado)
  const user = (req as any).user;

  try {
    const { data, error } = await supabaseAdmin
      .from('mensagens_diretas')
      .select('*')
      .or(`and(remetente_id.eq.${user.id},destinatario_id.eq.${id}),and(remetente_id.eq.${id},destinatario_id.eq.${user.id})`)
      .order('data_envio', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMensagem = async (req: Request, res: Response) => {
  const { corpo_texto, id_destinatario, id_comunicado_origem, id_mensagem_resposta, aluno_id } = req.body;
  const user = (req as any).user;

  if (!corpo_texto || corpo_texto.trim().length === 0) {
    return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
  }

  // Validação explícita de limite de caracteres (B4)
  if (corpo_texto.length > 500) {
    return res.status(400).json({ error: 'A mensagem não pode exceder 500 caracteres' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('mensagens_diretas')
      .insert([{
        corpo_texto: corpo_texto.trim(),
        remetente_id: user.id,
        destinatario_id: id_destinatario,
        aluno_id: aluno_id || null,
        id_comunicado_origem: id_comunicado_origem || null,
        id_mensagem_resposta: id_mensagem_resposta || null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: mensagem, error: fetchError } = await supabaseAdmin
      .from('mensagens_diretas')
      .select('destinatario_id')
      .eq('id', id)
      .single();

    if (fetchError || !mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    if (mensagem.destinatario_id !== user.id) {
      return res.status(403).json({ error: 'Apenas o destinatário pode marcar a mensagem como lida' });
    }

    const { error: updateError } = await supabaseAdmin
      .from('mensagens_diretas')
      .update({ lida: true })
      .eq('id', id);

    if (updateError) throw updateError;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getContatosSugeridos = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    // 1. Usar o papel do usuário que já vem no token (injetado pelo middleware)
    const userRole = (req as any).user.role;

    if (userRole === 'responsavel') {
      // Buscar professores das turmas dos filhos
      // Passos: Meus Filhos -> Suas Turmas -> Professores dessas Turmas
      
      // Buscamos os IDs das turmas dos filhos vinculados
      // Usamos supabaseAdmin para garantir acesso aos vínculos e dados dos alunos ignorando RLS restritivo
      const { data: filhos, error: filhosError } = await supabaseAdmin
        .from('responsaveis_alunos')
        .select('aluno_id, alunos:aluno_id(turma_id)')
        .eq('responsavel_id', user.id);

      if (filhosError) throw filhosError;

      const turmaIds = filhos
        ?.map((f: any) => {
           // Se alunos for um array (PostgREST às vezes retorna array para joins 1:1 dependendo da config)
           const aluno = Array.isArray(f.alunos) ? f.alunos[0] : f.alunos;
           return aluno?.turma_id;
        })
        .filter((id: any) => id !== null && id !== undefined) || [];

      if (turmaIds.length === 0) return res.json([]);

      // Buscamos os professores vinculados a essas turmas
      const { data: professoresVinculados, error: profError } = await supabaseAdmin
        .from('professores_turmas')
        .select('professor_id, usuarios:professor_id(id, nome, email)')
        .in('turma_id', turmaIds);

      if (profError) throw profError;

      // Remover duplicatas e formatar
      const uniqueProfs = new Map();
      professoresVinculados?.forEach((p: any) => {
        const prof = Array.isArray(p.usuarios) ? p.usuarios[0] : p.usuarios;
        if (prof) {
          uniqueProfs.set(prof.id, {
            id: prof.id,
            nome: prof.nome,
            email: prof.email,
            papel: 'professor'
          });
        }
      });

      return res.json(Array.from(uniqueProfs.values()));

    } else if (userRole === 'professor') {
      // 1. Buscar turmas do professor
      const { data: turmas, error: turmasError } = await supabaseAdmin
        .from('professores_turmas')
        .select('turma_id')
        .eq('professor_id', user.id);

      if (turmasError) throw turmasError;
      const turmaIds = turmas?.map(t => t.turma_id) || [];
      if (turmaIds.length === 0) return res.json([]);

      // 2. Buscar responsáveis vinculados a alunos nessas turmas
      // Usamos !inner para filtrar pelo relacionamento
      const { data: vinculos, error: vinculosError } = await supabaseAdmin
        .from('responsaveis_alunos')
        .select(`
          responsavel_id,
          usuarios:responsavel_id(id, nome, email),
          alunos:aluno_id!inner(turma_id)
        `)
        .in('alunos.turma_id', turmaIds);

      if (vinculosError) throw vinculosError;

      // 3. Formatar e remover duplicatas (um pai pode ter vários filhos)
      const uniqueResponsaveis = new Map();
      vinculos?.forEach((v: any) => {
        const resp = v.usuarios;
        if (resp && !uniqueResponsaveis.has(resp.id)) {
          uniqueResponsaveis.set(resp.id, {
            id: resp.id,
            nome: resp.nome,
            email: resp.email,
            papel: 'responsavel'
          });
        }
      });

      return res.json(Array.from(uniqueResponsaveis.values()));

    } else if (userRole === 'coordenacao') {
      // Coordenação pode contatar qualquer responsável
      const { data: todosResponsaveis, error: errorResp } = await supabaseAdmin
        .from('usuarios')
        .select('id, nome, email')
        .eq('papel', 'responsavel');
      
      if (errorResp) throw errorResp;
      return res.json(todosResponsaveis?.map(r => ({ ...r, papel: 'responsavel' })) || []);
    } else {
      return res.json([]);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
