import { Router } from 'express';
import {
  getConversas,
  getThread,
  createMensagem,
  markAsRead,
  getContatosSugeridos
} from '../controllers/mensagensController';
import { verifySupabaseJWT } from '../middlewares/auth';

const router = Router();

// Todas as rotas requerem usuário autenticado
router.use(verifySupabaseJWT);

/**
 * @openapi
 * /mensagens:
 *   get:
 *     summary: Retorna a lista de conversas ativas do usuário
 *     tags: [Mensagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas com a última mensagem.
 */
router.get('/', getConversas);

// Sugestão de contatos (ex: professores dos filhos)
router.get('/contatos-sugeridos', getContatosSugeridos);

// Retorna mensagens trocadas com um contato específico (thread)
router.get('/:id/thread', getThread);

// Enviar nova mensagem
router.post('/', createMensagem);

// Marcar mensagem como lida
router.put('/:id/lida', markAsRead);

export default router;
