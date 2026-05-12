import { Router } from 'express';
import {
  getConversas,
  getThread,
  createMensagem,
  markAsRead
} from '../controllers/mensagensController';
import { mockAuthMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas requerem usuário autenticado
router.use(mockAuthMiddleware);

// Retorna lista de conversas ativas (inbox)
router.get('/', getConversas);

// Retorna mensagens trocadas com um contato específico (thread)
router.get('/:id/thread', getThread);

// Enviar nova mensagem
router.post('/', createMensagem);

// Marcar mensagem como lida
router.put('/:id/lida', markAsRead);

export default router;
