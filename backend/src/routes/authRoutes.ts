import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação para obter token de uso na API
 */

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Gera um token de autenticação (JWT)
 *     description: Realiza login no Supabase utilizando email e senha e retorna o token de acesso (access_token) que deve ser usado no header Authorization como Bearer token para as demais rotas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário.
 *                 example: admin@escola.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário.
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *                 token_type:
 *                   type: string
 *                   example: bearer
 *                 expires_in:
 *                   type: integer
 *                   description: Tempo de expiração do token em segundos.
 *       400:
 *         description: Requisição inválida (Faltando email ou senha)
 *       401:
 *         description: Credenciais inválidas (Email ou senha incorretos)
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/token', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (data.session) {
      return res.status(200).json({
        access_token: data.session.access_token,
        token_type: data.session.token_type,
        expires_in: data.session.expires_in,
        user: data.user
      });
    }

    return res.status(500).json({ error: 'Falha ao gerar o token de sessão.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
});

export default router;
