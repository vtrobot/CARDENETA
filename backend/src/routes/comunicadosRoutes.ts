import { Router } from 'express';
import {
  getComunicados,
  getComunicadoById,
  confirmarCiencia,
  createComunicado,
  updateComunicado,
  deleteComunicado
} from '../controllers/comunicadosController';
import { verifySupabaseJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Todas as rotas de comunicados requerem usuário autenticado
router.use(verifySupabaseJWT);

/**
 * @openapi
 * /comunicados:
 *   get:
 *     summary: Lista todos os comunicados
 *     tags: [Comunicados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna a lista de comunicados.
 */
router.get('/', getComunicados);
router.get('/:id', getComunicadoById);

// Confirmação de Ciência (B4) - Apenas responsáveis
router.post('/:id/ciencia', requireRole(['responsavel']), confirmarCiencia);

// Escrita (B5) - Apenas Professores e Coordenação
router.post('/', requireRole(['professor', 'coordenacao']), createComunicado);
router.put('/:id', requireRole(['professor', 'coordenacao']), updateComunicado);
router.delete('/:id', requireRole(['professor', 'coordenacao']), deleteComunicado);

export default router;
