# Especificação: Épico 3 — Autenticação e Perfis (Auth / RBAC)

## 1. Escopo e Objetivos
Este épico substitui o sistema provisório de "mock" por uma camada de segurança real, robusta e baseada no Supabase Auth. Garantirá que apenas pessoas cadastradas na instituição de ensino tenham acesso ao sistema, e que cada uma veja apenas o que o seu "Perfil" (Role) permite.

**Objetivos:**
- Autenticação JWT baseada em e-mail e senha.
- Roteamento Inteligente (RBAC) que direciona Pais/Responsáveis para o `/mural` e Equipe Pedagógica para o `/painel-gestao`.
- Proteção definitiva das rotas de back-end verificando as assinaturas dos tokens.

## 2. Requisitos Associados (PRD)
- **US04:** Login e Roteamento (RBAC)
- **RF01:** Autenticar via Supabase Auth (JWT).
- **RF02:** Redirecionamento dinâmico baseado em Perfil (`responsavel`, `professor`, `coordenacao`).
- **RF03:** Fluxo de recuperação de senha.

## 3. Casos de Uso e Comportamento (BDD)

### Cenário 1: Autenticação de Responsável
**Dado** que um usuário do tipo "Responsável" acessa a tela de `/login`
**Quando** preenche e-mail e senha válidos
**Então** o Supabase emite um JWT
**E** o Front-end o redireciona automaticamente para a rota `/mural`.

### Cenário 2: Tentativa de Acesso a Área Restrita
**Dado** que um "Responsável" está autenticado no sistema
**Quando** ele tenta acessar manualmente a URL `/painel-gestao`
**Então** a aplicação bloqueia o acesso via Roteador (Protected Route)
**E** o redireciona de volta para `/mural` (ou exibe erro 403).

### Cenário 3: Back-end blindado
**Dado** que um atacante não possui um Token válido
**Quando** ele tenta disparar um `GET /api/comunicados`
**Então** a API Node.js valida a ausência de sessão e retorna HTTP 401 (Unauthorized).

## 4. Endpoints da API e Camada Lógica (Backend)
Diferente dos outros épicos, a Autenticação pesada do Supabase é um "BaaS" (Backend as a Service). O Front-end frequentemente fala direto com o Supabase para gerar o Token. O papel do nosso Backend Express é validar esse token.

- `Middleware verifyJWT`: Um middleware no Express que irá interceptar o Header `Authorization: Bearer <token>`, usar o SDK Admin do Supabase ou a chave pública para validar se o Token não expirou.
- Ao validar, extrai o UUID e busca na tabela `usuarios` qual o papel (`role`) daquela pessoa, injetando no `req.user` para que os controllers antigos de Comunicados e Mensagens continuem funcionando.

## 5. UI/UX (Frontend)
- **Tela de Login (`/login`)**: Layout limpo focado em conversão e usabilidade. Formulário centralizado com e-mail, senha e botão primário de "Entrar".
- **Link de Recuperação**: Texto "Esqueci minha senha" abaixo do formulário, levando a uma etapa de envio de link mágico.
- **Provider de Autenticação (`AuthProvider`)**: Um wrapper global no React que escuta mudanças de estado do Supabase (`onAuthStateChange`) e injeta o usuário autenticado em toda a árvore do App.

## 6. Segurança
- Nenhuma senha viaja em plain text para o nosso backend, o fluxo de Hash/Salt é governado diretamente pelo provedor de identidade do Supabase.
- A persistência da sessão no navegador utilizará as boas práticas do SDK padrão do Supabase (localStorage seguro / in-memory).
