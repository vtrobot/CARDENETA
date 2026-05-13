import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const getComunicados = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { page = '1', limit = '10', aluno_id, status } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum - 1;

  try {
    let query = supabase
      .from('comunicados')
      .select('*, leituras_comunicados(assinatura_digital, data_leitura)', { count: 'exact' });

    // Para o MVP mockado de filtros
    if (user.role === 'responsavel' && aluno_id) {
       // Filtro simulado
    }

    const { data, error, count } = await query
      .order('data_criacao', { ascending: false })
      .range(start, end);

    if (error) throw error;

    // Mapear para o formato que o Frontend espera
    const mappedData = data.map((item: any) => ({
      ...item,
      leituras_comunicados: item.leituras_comunicados?.map((lc: any) => ({
        status_lido: !!lc.data_leitura,
        ciencia_confirmada: !!lc.assinatura_digital
      }))
    }));

    res.json({
      data: mappedData,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getComunicadoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: comunicado, error } = await supabase
      .from('comunicados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!comunicado) return res.status(404).json({ error: 'Comunicado não encontrado' });

    if (user.role === 'responsavel' && comunicado.nivel_urgencia !== 'alta') {
      await supabase
        .from('leituras_comunicados')
        .upsert({ 
          comunicado_id: id,
          responsavel_id: user.id,
          data_leitura: new Date().toISOString() 
        }, { onConflict: 'comunicado_id, responsavel_id' });
    }

    res.json(comunicado);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmarCiencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: comunicado, error: fetchError } = await supabase
      .from('comunicados')
      .select('nivel_urgencia')
      .eq('id', id)
      .single();

    if (fetchError || !comunicado) {
      return res.status(404).json({ error: 'Comunicado não encontrado' });
    }

    if (comunicado.nivel_urgencia !== 'alta') {
      return res.status(400).json({ error: 'Comunicado não exige confirmação explícita de ciência' });
    }

    // Regra (B4): Confirma a ciência e define como lido
    const { error: updateError } = await supabase
      .from('leituras_comunicados')
      .upsert({
        comunicado_id: id,
        responsavel_id: user.id,
        data_leitura: new Date().toISOString(),
        assinatura_digital: 'Assinatura Eletrônica'
      }, { onConflict: 'comunicado_id, responsavel_id' });

    if (updateError) throw updateError;

    res.json({ success: true, message: 'Ciência confirmada com sucesso' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createComunicado = async (req: Request, res: Response) => {
  const { titulo, corpo_texto, nivel_urgencia, id_turma_destino } = req.body;
  const user = (req as any).user;

  try {
    // A validação B5: "Validar se Professor tem vínculo com a turma" deve ser feita aqui ou via RLS.
    // O RLS já faz isso no INSERT, mas vamos incluir uma validação básica preventiva.
    if (user.role === 'professor') {
      const { data: vinculo } = await supabase
        .from('professores_turmas')
        .select('*')
        .eq('professor_id', user.id)
        .eq('turma_id', id_turma_destino)
        .single();
        
      if (!vinculo) {
        return res.status(403).json({ error: 'Professor não possui vínculo com esta turma' });
      }
    }

    const { data, error } = await supabase
      .from('comunicados')
      .insert([{
        titulo,
        corpo_texto,
        nivel_urgencia,
        turma_id: id_turma_destino,
        autor_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComunicado = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, corpo_texto, nivel_urgencia } = req.body;
  const user = (req as any).user;

  try {
    // Validar se o usuário é o autor do comunicado (Opcional, pois RLS cobre isso, mas é boa prática)
    const { data: comunicado, error: fetchError } = await supabase
      .from('comunicados')
      .select('autor_id')
      .eq('id', id)
      .single();

    if (fetchError || !comunicado) {
      return res.status(404).json({ error: 'Comunicado não encontrado' });
    }

    if (user.role === 'professor' && comunicado.autor_id !== user.id) {
      return res.status(403).json({ error: 'Apenas o autor pode editar o comunicado' });
    }

    const { data, error } = await supabase
      .from('comunicados')
      .update({ titulo, corpo_texto, nivel_urgencia })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComunicado = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: comunicado, error: fetchError } = await supabase
      .from('comunicados')
      .select('autor_id')
      .eq('id', id)
      .single();

    if (fetchError || !comunicado) {
      return res.status(404).json({ error: 'Comunicado não encontrado' });
    }

    if (user.role === 'professor' && comunicado.autor_id !== user.id) {
      return res.status(403).json({ error: 'Apenas o autor pode excluir o comunicado' });
    }

    const { error } = await supabase
      .from('comunicados')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Comunicado excluído' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
