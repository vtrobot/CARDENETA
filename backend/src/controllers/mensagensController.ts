import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const getConversas = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    // Para simplificar no MVP, buscamos as mensagens e agrupamos no backend
    // Em produção, uma view ou RPC no PostgreSQL seria mais performático
    const { data: mensagens, error } = await supabase
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
    const { data, error } = await supabase
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
  const { corpo_texto, id_destinatario, id_comunicado_origem, id_mensagem_resposta } = req.body;
  const user = (req as any).user;

  if (!corpo_texto || corpo_texto.trim().length === 0) {
    return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
  }

  // Validação explícita de limite de caracteres (B4)
  if (corpo_texto.length > 500) {
    return res.status(400).json({ error: 'A mensagem não pode exceder 500 caracteres' });
  }

  try {
    const { data, error } = await supabase
      .from('mensagens_diretas')
      .insert([{
        corpo_texto: corpo_texto.trim(),
        remetente_id: user.id,
        destinatario_id: id_destinatario,
        aluno_id: null, // Pode ser derivado se aplicável na regra futura
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
    const { data: mensagem, error: fetchError } = await supabase
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

    const { error: updateError } = await supabase
      .from('mensagens_diretas')
      .update({ lida: true })
      .eq('id', id);

    if (updateError) throw updateError;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
