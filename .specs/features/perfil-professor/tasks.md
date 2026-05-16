# Tasks: Perfil Professor - Melhoria Painel de Gestão

Implementação de visibilidade de abas para o perfil de Professor.

## Preparação
- [x] Analisar `PainelGestao.tsx` para identificar pontos de alteração.

## Implementação [Execute]

### Frontend
- [x] **[T1]** Alterar o cabeçalho do `PainelGestao.tsx` para mostrar as abas principais para Professores.
    - Onde: `frontend/src/pages/PainelGestao.tsx`
    - O que: Mudar a condição de `role === 'coordenacao'` para incluir `professor`.
- [x] **[T2]** Ajustar a renderização do conteúdo da aba "Administração Escolar" em `PainelGestao.tsx`.
    - Onde: `frontend/src/pages/PainelGestao.tsx`
    - O que: 
        - Permitir que `professor` acesse o bloco `{activeTab === 'admin'}`.
        - Esconder a barra de sub-abas (`admin-subtabs`) se for `professor`, ou mostrar apenas "Alunos".
        - Forçar `adminSubTab` para 'alunos' se o usuário for Professor.

## Verificação
- [x] **[V1]** Testar login como Coordenador e verificar se as 3 sub-abas aparecem.
- [x] **[V2]** Testar login como Professor e verificar se as 2 abas principais aparecem, e se "Administração Escolar" mostra apenas Alunos.
