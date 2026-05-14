# Tarefas: Cadastro de Usuários

- [x] **1. Adicionar cliente admin do Supabase**
  - **O que**: Configurar `supabaseAdmin` em `supabaseClient.ts` que utiliza `SUPABASE_SERVICE_ROLE_KEY` (se disponível) para poder criar usuários sem afetar a sessão atual.
  - **Onde**: `backend/src/supabaseClient.ts`

- [x] **2. Implementar Controller de Cadastro de Usuário**
  - **O que**: Criar método `createUsuario` em `adminController.ts`. O método deve:
    - Validar o payload (`nome`, `email`, `senha`, `papel`).
    - Criar o usuário no Supabase Auth.
    - Inserir o registro correspondente na tabela `usuarios`.
  - **Onde**: `backend/src/controllers/adminController.ts`

- [x] **3. Registrar Rota no Admin Routes**
  - **O que**: Adicionar rota `POST /usuarios` mapeando para `createUsuario` e incluir a respectiva documentação Swagger.
  - **Onde**: `backend/src/routes/adminRoutes.ts`
