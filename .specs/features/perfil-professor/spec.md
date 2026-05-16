# Perfil Professor - Melhoria Painel de Gestão

Melhoria no Painel de Gestão para permitir que professores acessem funcionalidades de administração escolar limitadas ao gerenciamento de alunos.

## Requisitos

- **[REQ-01]** Ao logar, o Professor deve visualizar as abas principais "Comunicados" e "Administração Escolar" no Painel de Gestão.
- **[REQ-02]** Ao selecionar a aba "Administração Escolar", o Professor deve visualizar apenas a sub-aba (ou conteúdo direto) de "Alunos".
- **[REQ-03]** O Professor não deve ter acesso às sub-abas "Usuários" e "Turmas" (reservadas para a Coordenação).
- **[REQ-04]** A experiência da Coordenação deve permanecer inalterada (acesso total a todas as abas).

## Critérios de Aceite

- [ ] Login como Professor redireciona para Painel de Gestão com abas "Comunicados" e "Administração Escolar" visíveis.
- [ ] Clicar em "Administração Escolar" como Professor exibe a lista/gestão de alunos.
- [ ] Como Professor, as opções "Usuários" e "Turmas" não aparecem na navegação secundária.
- [ ] Como Coordenador, todas as abas (Comunicados, Admin) e sub-abas (Usuários, Turmas, Alunos) continuam visíveis.

## Impactos Técnicos

- `PainelGestao.tsx`: Alterar lógica de renderização condicional baseada no `role`.
- `AlunosTab.tsx`: Verificar se as permissões de backend (RLS) já permitem que o professor visualize alunos.
