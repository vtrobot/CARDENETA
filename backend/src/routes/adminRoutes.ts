import { Router } from 'express';
import {
  getTurmas,
  createTurma,
  getUsuariosByPapel,
  createVinculoProfessorTurma
} from '../controllers/adminController';
import { verifySupabaseJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Todas as rotas admin requerem usuário logado e papel de coordenação
router.use(verifySupabaseJWT);
router.use(requireRole(['coordenacao']));

// Turmas
router.get('/turmas', getTurmas);
router.post('/turmas', createTurma);

// Usuários
router.get('/usuarios', getUsuariosByPapel);

// Vínculos
router.post('/vinculos/professor-turma', createVinculoProfessorTurma);

export default router;
