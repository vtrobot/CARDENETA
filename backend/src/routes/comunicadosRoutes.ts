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
/**
 * @swagger
 * /comunicados:
 *   post:
 *     summary: Cadastra um novo comunicado
 *     tags: [Comunicados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - corpo_texto
 *               - nivel_urgencia
 *               - id_turma_destino
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Reunião de Pais"
 *               corpo_texto:
 *                 type: string
 *                 example: "Convidamos todos para a reunião no dia 20/05."
 *               nivel_urgencia:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *                 example: "media"
 *               id_turma_destino:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       201:
 *         description: Comunicado criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido (Usuário não tem permissão ou não é o autor)
 */
router.post('/', requireRole(['professor', 'coordenacao']), createComunicado);
router.put('/:id', requireRole(['professor', 'coordenacao']), updateComunicado);
router.delete('/:id', requireRole(['professor', 'coordenacao']), deleteComunicado);

export default router;
