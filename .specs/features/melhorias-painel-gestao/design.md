# Design: Refatoração do Painel de Gestão

## Arquitetura de Componentes

O `PainelGestao` atual é monolítico. A nova estrutura será:

```
frontend/src/pages/
├── PainelGestao.tsx (Orquestrador)
└── PainelGestaoTabs/
    ├── ComunicadosTab.tsx
    ├── UsuariosTab.tsx
    ├── TurmasTab.tsx
    └── AlunosTab.tsx
```

### PainelGestao.tsx (Orquestrador)
- Gerencia o estado das abas principais e sub-abas de administração.
- Passa dados globais (como lista de turmas, papéis, etc.) via props se necessário, ou as abas gerenciam suas próprias queries se forem independentes.
- Centraliza o layout comum (header do painel e botões de abas).

### AlunosTab.tsx
- Recebe a lista de turmas para o filtro.
- Mantém o estado local do filtro (`selectedTurmaId`).
- Renderiza a tabela de alunos e o modal de vínculos (que também pode ser um sub-componente).

## Padrões de Acessibilidade

- **Labels**:
  ```tsx
  <label htmlFor="input-id">Label Text</label>
  <input id="input-id" ... />
  ```
- **Icon Buttons**:
  ```tsx
  <button className="btn-icon" aria-label="Editar Comunicado">✏️</button>
  ```

## Filtro de Alunos
- No componente `AlunosTab`, adicionar um `<select>` acima da tabela.
- `const filteredAlunos = selectedTurmaId ? alunos.filter(a => a.turma_id === selectedTurmaId) : alunos;`
