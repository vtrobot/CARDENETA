import { Router } from 'express';
import {
  getTurmas,
  createTurma,
  getUsuariosByPapel,
  createVinculoProfessorTurma,
  createUsuario,
  getAlunos,
  createAluno,
  createVinculoAlunoResponsavel,
  updateVinculoAlunoResponsavel,
  deleteVinculoAlunoResponsavel,
  getVinculosByAluno
} from '../controllers/adminController';
import { verifySupabaseJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Todas as rotas admin requerem usuário logado
router.use(verifySupabaseJWT);

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
 *         description: Proibido (usuário não tem papel permitido)
 */
router.get('/turmas', requireRole(['coordenacao', 'professor']), getTurmas);

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
router.get('/usuarios', requireRole(['coordenacao']), getUsuariosByPapel);

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
router.post('/usuarios', requireRole(['coordenacao']), createUsuario);

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
router.post('/vinculos/professor-turma', requireRole(['coordenacao']), createVinculoProfessorTurma);

// Alunos
/**
 * @swagger
 * /admin/alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get('/alunos', requireRole(['coordenacao']), getAlunos);

/**
 * @swagger
 * /admin/alunos:
 *   post:
 *     summary: Cadastra um novo aluno
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
 *               - matricula
 *               - data_nascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Enzo Silva"
 *               matricula:
 *                 type: string
 *                 example: "2026001"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "2018-05-15"
 *               turma_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       400:
 *         description: Erro de validação ou matrícula duplicada
 */
router.post('/alunos', requireRole(['coordenacao']), createAluno);

// Vínculos Responsável-Aluno
/**
 * @swagger
 * /admin/vinculos/aluno-responsavel:
 *   post:
 *     summary: Cria um vínculo entre um responsável e um aluno
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
 *               - responsavel_id
 *               - aluno_id
 *               - grau_parentesco
 *             properties:
 *               responsavel_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               aluno_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               grau_parentesco:
 *                 type: string
 *                 example: "Pai"
 *     responses:
 *       201:
 *         description: Vínculo criado com sucesso
 *       400:
 *         description: Vínculo já existe ou usuário não é responsável
 */
router.post('/vinculos/aluno-responsavel', requireRole(['coordenacao']), createVinculoAlunoResponsavel);

/**
 * @swagger
 * /admin/vinculos/aluno-responsavel/{alunoId}:
 *   get:
 *     summary: Lista os vínculos de responsáveis de um aluno específico
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alunoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de vínculos retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get('/vinculos/aluno-responsavel/:alunoId', requireRole(['coordenacao']), getVinculosByAluno);

/**
 * @swagger
 * /admin/vinculos/aluno-responsavel/{id}:
 *   put:
 *     summary: Atualiza o grau de parentesco de um vínculo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do vínculo (UUID da tabela responsaveis_alunos)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grau_parentesco
 *             properties:
 *               grau_parentesco:
 *                 type: string
 *                 example: "Responsável Legal"
 *     responses:
 *       200:
 *         description: Vínculo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Vínculo não encontrado
 */
router.put('/vinculos/aluno-responsavel/:id', requireRole(['coordenacao']), updateVinculoAlunoResponsavel);

/**
 * @swagger
 * /admin/vinculos/aluno-responsavel/{id}:
 *   delete:
 *     summary: Remove um vínculo entre responsável e aluno
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do vínculo
 *     responses:
 *       204:
 *         description: Vínculo removido com sucesso
 *       404:
 *         description: Vínculo não encontrado
 */
router.delete('/vinculos/aluno-responsavel/:id', requireRole(['coordenacao']), deleteVinculoAlunoResponsavel);

export default router;
