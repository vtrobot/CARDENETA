import { Router } from 'express';
import {
  getTurmas,
  createTurma,
  getUsuariosByPapel,
  createVinculoProfessorTurma,
  createUsuario
} from '../controllers/adminController';
import { verifySupabaseJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Todas as rotas admin requerem usuário logado e papel de coordenação
router.use(verifySupabaseJWT);
router.use(requireRole(['coordenacao']));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrativos (requer papel de coordenação)
 */

// Turmas
/**
 * @swagger
 * /admin/turmas:
 *   get:
 *     summary: Lista todas as turmas
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas retornada com sucesso
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       403:
 *         description: Proibido (usuário não tem papel de coordenação)
 */
router.get('/turmas', getTurmas);
/**
 * @swagger
 * /admin/turmas:
 *   post:
 *     summary: Cadastra uma nova turma
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - turno
 *               - ano_letivo
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "1º Ano A"
 *               turno:
 *                 type: string
 *                 enum: [Matutino, Vespertino, Integral]
 *                 example: "Matutino"
 *               ano_letivo:
 *                 type: number
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *       400:
 *         description: Erro de validação (dados faltando)
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido
 */
router.post('/turmas', createTurma);

// Usuários
/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: Lista usuários por papel
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: papel
 *         required: true
 *         schema:
 *           type: string
 *           enum: [professor, responsavel, coordenacao]
 *         description: Papel do usuário a ser filtrado
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       400:
 *         description: Parâmetro papel não fornecido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido
 */
router.get('/usuarios', getUsuariosByPapel);

/**
 * @swagger
 * /admin/usuarios:
 *   post:
 *     summary: Cadastra um novo usuário (professor, responsável, coordenação)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - papel
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva@escola.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *               papel:
 *                 type: string
 *                 enum: [professor, responsavel, coordenacao]
 *                 example: "professor"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido
 *       500:
 *         description: Erro interno
 */
router.post('/usuarios', createUsuario);

// Vínculos
/**
 * @swagger
 * /admin/vinculos/professor-turma:
 *   post:
 *     summary: Cria um vínculo entre um professor e uma turma
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professor_id
 *               - turma_id
 *             properties:
 *               professor_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               turma_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       201:
 *         description: Vínculo criado com sucesso
 *       400:
 *         description: Vínculo já existe ou erro de validação
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido
 */
router.post('/vinculos/professor-turma', createVinculoProfessorTurma);

export default router;
