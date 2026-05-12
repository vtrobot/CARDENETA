import { Request, Response, NextFunction } from 'express';

// Middleware provisório para simular um usuário autenticado (Épico 3 trará o real com JWT)
export const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId || !userRole) {
    return res.status(401).json({ error: 'Usuário não autenticado. Forneça x-user-id e x-user-role nos headers.' });
  }

  // Anexa o usuário mockado ao request
  (req as any).user = {
    id: userId,
    role: userRole
  };

  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Perfil sem permissão.' });
    }
    next();
  };
};
