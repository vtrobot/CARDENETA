# Spec: Cadastro de Usuários

## 1. Visão Geral
Implementar um endpoint para o cadastro de novos usuários com papéis específicos (`professor`, `coordenacao`, `responsavel`) pelo painel administrativo. 

## 2. Requisitos
- **REQ-01**: O endpoint será acessível em `POST /api/admin/usuarios`.
- **REQ-02**: Apenas usuários autenticados e com o papel de `coordenacao` poderão acessar (já coberto pelo middleware atual em `/admin`).
- **REQ-03**: O payload deverá receber `nome`, `email`, `senha`, e `papel`.
- **REQ-04**: O campo `papel` será validado contra a lista: `professor`, `responsavel`, `coordenacao`.
- **REQ-05**: Criação do usuário no Supabase Auth usando as permissões de admin (`auth.admin.createUser`) para evitar o login automático na sessão do requisitante.
- **REQ-06**: Inserção/Sincronização dos dados complementares na tabela `usuarios` (`id`, `nome`, `email`, `papel`).
- **REQ-07**: Documentação do endpoint via Swagger em `adminRoutes.ts`.

## 3. Escopo Atual
Apenas o endpoint no backend será implementado inicialmente.
