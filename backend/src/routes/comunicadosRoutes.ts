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

// Leituras (B2, B3) - Todos os perfis podem listar e ver detalhes
router.get('/', getComunicados);
router.get('/:id', getComunicadoById);

// Confirmação de Ciência (B4) - Apenas responsáveis
router.post('/:id/ciencia', requireRole(['responsavel']), confirmarCiencia);

// Escrita (B5) - Apenas Professores e Coordenação
router.post('/', requireRole(['professor', 'coordenacao']), createComunicado);
router.put('/:id', requireRole(['professor', 'coordenacao']), updateComunicado);
router.delete('/:id', requireRole(['professor', 'coordenacao']), deleteComunicado);

export default router;
