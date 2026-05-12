import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';

// Middleware Real de Autenticação JWT usando Supabase
export const verifySupabaseJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido ou inválido (Formato: Bearer <token>)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Valida o Token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token expirado ou inválido.' });
    }

    // Busca o papel (Role) do usuário na nossa tabela pública
    const { data: userData, error: roleError } = await supabase
      .from('usuarios')
      .select('papel')
      .eq('id', user.id)
      .single();

    if (roleError || !userData) {
      return res.status(403).json({ error: 'Perfil de usuário não encontrado no sistema.' });
    }

    // Anexa os dados validados no request
    (req as any).user = {
      id: user.id,
      role: userData.papel
    };

    next();
  } catch (err) {
    res.status(500).json({ error: 'Erro interno na validação da sessão.' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Perfil sem permissão para esta ação.' });
    }
    next();
  };
};

