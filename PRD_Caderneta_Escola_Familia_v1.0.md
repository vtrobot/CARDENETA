# PRD — Caderneta Escola & Família
**Documento de Requisitos de Produto · v1.0 · Maio de 2026**

---

| Campo | Valor |
|---|---|
| **Versão** | 1.0 — MVP + Módulo Administrativo |
| **Autor** | Valmor Tambosi Junior — RU 178528 |
| **Curso** | Bacharelado em Engenharia de Software — UNINTER |
| **Disciplina** | Atividades Extensionistas III — Análise |
| **Setor de Aplicação** | CEMEI — Bairro Boa Vista, Curitiba/PR |
| **ODS Alinhado** | ODS 04 — Educação de Qualidade |
| **Stack Tecnológico** | React · Node.js / Express · Supabase (PostgreSQL) |

---

## Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Personas e Perfis de Usuário](#2-personas-e-perfis-de-usuário)
3. [Escopo — Fase 1 (MVP + Módulo Administrativo)](#3-escopo--fase-1-mvp--módulo-administrativo)
4. [Requisitos Funcionais](#4-requisitos-funcionais)
5. [Requisitos Não Funcionais](#5-requisitos-não-funcionais)
6. [Regras de Negócio](#6-regras-de-negócio)
7. [Modelo de Dados](#7-modelo-de-dados)
8. [Arquitetura Técnica](#8-arquitetura-técnica)
9. [Matriz de Rastreabilidade](#9-matriz-de-rastreabilidade)
10. [Critérios de Aceite Globais (DoD)](#10-critérios-de-aceite-globais-dod)
11. [Fora do Escopo — Fase 1](#11-fora-do-escopo--fase-1)
12. [Riscos e Mitigações](#12-riscos-e-mitigações)
13. [Glossário](#13-glossário)

---

## 1. Visão Geral do Produto

### 1.1 Problema

A comunicação entre escola e família em instituições de ensino infantil ainda depende amplamente de cadernetas físicas, bilhetes em papel e grupos de mensagens informais. Esse modelo gera perda de informação, falta de rastreabilidade das leituras e ausência de um canal oficial estruturado que garanta que comunicados críticos cheguem efetivamente aos responsáveis.

O Centro Municipal de Educação Infantil (CEMEI) do bairro Boa Vista, em Curitiba/PR, identificou essa lacuna e propôs a digitalização desse fluxo como projeto extensionista.

### 1.2 Solução Proposta

A **Caderneta Escola & Família** é uma aplicação web responsiva que digitaliza o canal de comunicação escola-família. A plataforma oferece três jornadas distintas — Responsável, Professor e Coordenação — cada uma com interface e permissões ajustadas ao seu papel.

### 1.3 Objetivos de Produto

- Substituir a caderneta física por um canal digital rastreável e auditável.
- Garantir que comunicados urgentes gerem ciência formal dos responsáveis.
- Prover ao corpo docente e à coordenação um painel de gestão de turmas, alunos e vínculos familiares.
- Servir de base técnica escalável para funcionalidades futuras (notas, frequência, agenda).

### 1.4 Métricas de Sucesso (KPIs)

| Métrica | Meta (MVP) | Instrumento de Medição |
|---|---|---|
| Taxa de leitura de comunicados | ≥ 80% em 48h | tabela `leituras_comunicados` |
| Confirmação de ciência (urgência Alta) | 100% dos avisos críticos | campo `ciencia_confirmada` |
| Tempo de resposta da API (GET) | < 200 ms (p95) | APM / logs Node.js |
| Taxa de cobertura de testes E2E | ≥ 70% dos fluxos críticos | Playwright / Cypress report |

---

## 2. Personas e Perfis de Usuário

O sistema opera sob um modelo RBAC (Role-Based Access Control) com três perfis principais:

| Perfil | Responsabilidade Principal | Ações no Sistema |
|---|---|---|
| **Responsável** | Acompanhar comunicados e interagir com a escola. | Ler feed, filtrar por aluno, confirmar ciência, enviar mensagens diretas. |
| **Professor** | Publicar e gerenciar comunicados para suas turmas. | Criar/editar/excluir comunicados; visualiza apenas turmas alocadas. |
| **Coordenação / Administração** | Gerir base cadastral e configurar o sistema. | Cadastrar turmas, alunos, professores e vínculos familiares; acessar todos os endpoints de escrita. |

---

## 3. Escopo — Fase 1 (MVP + Módulo Administrativo)

### Épico 1 — Mural de Comunicados

| ID | Título | Descrição Resumida | Critérios-Chave |
|---|---|---|---|
| US01 | Leitura e Filtro do Feed | Como Responsável, visualizo comunicados e filtro por aluno. | Feed cronológico; filtro por dependente e status de leitura; card exibe título, data, remetente e urgência. |
| US02 | Assinatura de Ciência (Alta Urgência) | Como Escola/Professor, exijo confirmação explícita em avisos críticos. | Botão "Confirmar Ciência" obrigatório; status permanece "Pendente" até clique; log com data/hora. |

### Épico 2 — Mensageria Simples

| ID | Título | Descrição Resumida | Critérios-Chave |
|---|---|---|---|
| US03 | Envio de Mensagem Direta | Como Responsável, envio mensagem de texto para professor ou coordenação. | Formulário com destinatário, assunto e mensagem (máx. 500 chars); sanitização na API; confirmação de envio. |

### Épico 3 — Autenticação e Perfis

| ID | Título | Descrição Resumida | Critérios-Chave |
|---|---|---|---|
| US04 | Login e Roteamento (RBAC) | Como Usuário, faço login e sou direcionado ao painel correto. | JWT via Supabase Auth; rota `/mural` (Responsável) ou `/painel-gestao` (Professor/Coord.); erro genérico em falhas. |

### Épico 4 — Administração e Cadastros

| ID | Título | Descrição Resumida | Critérios-Chave |
|---|---|---|---|
| US05 | Gestão de Alunos e Turmas | Como Coordenador, cadastro alunos e os matriculo em turmas. | Validação de campos obrigatórios; restrição de matrícula dupla no mesmo ano letivo. |
| US06 | Vínculo Familiar | Como Coordenador, vinculo responsáveis aos alunos cadastrados. | Aluno sem responsável não pode ser salvo; responsável pode ter múltiplos alunos. |
| US07 | Gestão de Professores | Como Coordenador, cadastro docentes e os aloco em turmas. | Professor pode estar em múltiplas turmas; visualiza apenas turmas alocadas. |

---

## 4. Requisitos Funcionais

### 4.1 Autenticação e Gestão de Acessos

| ID | Requisito | Regra de Negócio / Observação |
|---|---|---|
| RF01 | Autenticar usuários via e-mail e senha com sessão gerenciada por JWT (Supabase Auth). | — |
| RF02 | Redirecionar usuário autenticado para interface específica conforme perfil (RBAC). | `RESPONSAVEL` → `/mural`; `PROFESSOR`/`COORDENACAO` → `/painel-gestao` |
| RF03 | Permitir recuperação de senha via link enviado ao e-mail cadastrado. | — |

### 4.2 Gestão de Comunicados (Mural)

| ID | Requisito | Regra de Negócio / Observação |
|---|---|---|
| RF04 | Professor e Coordenação criam, editam e excluem comunicados com título, urgência e turma-alvo. | RN02: Professor vê apenas turmas alocadas. |
| RF05 | Exibir feed de comunicados ao Responsável, ordenados do mais recente ao mais antigo. | RN01: Cada comunicado de turma gera registro individual por Responsável. |
| RF06 | Disponibilizar filtros por aluno dependente e por status de leitura no feed. | — |
| RF07 | Registrar visualização e alterar status para "Lido" ao abrir detalhe pela primeira vez. | — |
| RF08 | Para urgência "Alta", exigir clique no botão "Confirmar Ciência" para registrar leitura. | RN03: Comunicado urgente não pode ser marcado como lido sem confirmação explícita. |

### 4.3 Mensageria Simples

| ID | Requisito | Regra de Negócio / Observação |
|---|---|---|
| RF09 | Responsável inicia conversa de texto com Professor da Turma ou Coordenação. | Formulário: Destinatário, Assunto, Mensagem (máx. 500 chars). |
| RF10 | Responsável responde a comunicado recebido, mantendo histórico vinculado ao aviso original. | Thread via `id_comunicado_origem` e `id_mensagem_resposta`. |

### 4.4 Administração e Cadastros (Backoffice)

| ID | Requisito | Regra de Negócio / Observação |
|---|---|---|
| RF13 | Criar, editar e excluir turmas (série/ano, ano letivo, turno). | Turnos: `MANHA`, `TARDE`, `INTEGRAL`. |
| RF14 | Cadastrar professores e alocá-los em turmas com disciplina. | RN09: Professor pode estar em múltiplas turmas. |
| RF15 | Cadastrar alunos (nome, matrícula, data de nascimento) e matriculá-los em turma ativa. | RN08: Um aluno = uma turma por ano letivo. |
| RF16 | Cadastrar responsáveis e estabelecer vínculo relacional com um ou mais alunos. | RN07: Aluno sem responsável não pode ser persistido. |

---

## 5. Requisitos Não Funcionais

| ID | Categoria | Requisito | Critério de Aceitação |
|---|---|---|---|
| RNF01 | Desempenho | Rotas de leitura (GET) da API retornam dados em tempo médio inferior a 200 ms. | p95 < 200 ms medido por APM ou teste de carga. |
| RNF02 | Desempenho | Front-end React utiliza cache de dados (ex.: React Query) para navegação fluida em mobile. | Sem re-fetch desnecessário em navegação entre páginas. |
| RNF03 | Segurança | Banco de dados utiliza Row Level Security (RLS) — Responsável acessa apenas dados dos seus dependentes. | Testes de isolamento: usuário B não acessa dados de usuário A. |
| RNF04 | Segurança | Chaves de API e credenciais gerenciadas via variáveis de ambiente (`.env`), nunca versionadas. | Nenhuma chave sensível presente no repositório Git. |
| RNF05 | Segurança | API sanitiza inputs para prevenir SQL Injection e XSS. | Testes OWASP básicos passando; inputs não sanitizados bloqueados. |
| RNF06 | Testabilidade | Elementos interativos do React possuem atributos `data-testid` únicos. | Relatório E2E com cobertura ≥ 70% dos fluxos críticos. |
| RNF07 | Arquitetura | Lógica de negócio reside na camada de serviços da API Node.js, não no front-end. | Code review: nenhuma regra de negócio em componentes React. |

---

## 6. Regras de Negócio

| ID | Regra | Impacto Técnico |
|---|---|---|
| RN01 | Comunicados para "Turma" geram registros individuais de leitura para cada Responsável vinculado. | Inserção em lote na tabela `leituras_comunicados` ao criar comunicado. |
| RN02 | Professores visualizam apenas turmas e alunos nos quais estão formalmente alocados. | Filtro via JOIN `professores_turmas` + RLS no Supabase. |
| RN03 | Comunicados de urgência "Alta" exigem confirmação de leitura obrigatória. | `ciencia_confirmada = FALSE` bloqueia mudança de status no front. |
| RN07 | Aluno não pode ser salvo sem ao menos um Responsável vinculado. | Validação na camada de serviços antes do INSERT; transaction rollback. |
| RN08 | Aluno pode estar ativo em somente uma turma por ano letivo. | Constraint `UNIQUE (id_aluno, ano_letivo)` ou validação de serviço. |
| RN09 | Professor pode estar vinculado a múltiplas turmas simultaneamente. | Tabela associativa `professores_turmas` sem restrição de unicidade por professor. |
| RN10 | Apenas perfil "COORDENACAO" acessa endpoints de escrita (POST, PUT, DELETE) do backoffice. | Middleware de autorização na API verifica `role` antes de processar a requisição. |

---

## 7. Modelo de Dados

Banco de dados implementado no **Supabase (PostgreSQL)**.

### 7.1 Entidades Principais

#### `usuarios`
> O `id_usuario` referencia `auth.users.id` gerado pelo Supabase Auth.

| Campo | Tipo | Restrições |
|---|---|---|
| `id_usuario` | UUID | PK |
| `nome_completo` | VARCHAR(150) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `perfil` | VARCHAR(20) | NOT NULL · Check: `COORDENACAO`, `PROFESSOR`, `RESPONSAVEL` |
| `criado_em` | TIMESTAMP | DEFAULT NOW() |

#### `turmas`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_turma` | UUID | PK, DEFAULT uuid_generate_v4() |
| `serie_ano` | VARCHAR(50) | NOT NULL |
| `ano_letivo` | SMALLINT | NOT NULL |
| `turno` | VARCHAR(20) | NOT NULL · Check: `MANHA`, `TARDE`, `INTEGRAL` |

#### `alunos`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_aluno` | UUID | PK, DEFAULT uuid_generate_v4() |
| `matricula` | VARCHAR(50) | NOT NULL, UNIQUE |
| `nome_completo` | VARCHAR(150) | NOT NULL |
| `data_nascimento` | DATE | NOT NULL |
| `id_turma` | UUID | FK → `turmas.id_turma`, NOT NULL |

#### `comunicados`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_comunicado` | UUID | PK, DEFAULT uuid_generate_v4() |
| `titulo` | VARCHAR(150) | NOT NULL |
| `corpo_texto` | TEXT | NOT NULL |
| `nivel_urgencia` | VARCHAR(20) | NOT NULL · Check: `BAIXA`, `MEDIA`, `ALTA` |
| `data_envio` | TIMESTAMP | DEFAULT NOW() |
| `id_turma_destino` | UUID | FK → `turmas.id_turma`, NOT NULL |
| `id_autor` | UUID | FK → `usuarios.id_usuario`, NOT NULL |

#### `mensagens_diretas`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_mensagem` | UUID | PK, DEFAULT uuid_generate_v4() |
| `corpo_texto` | VARCHAR(500) | NOT NULL |
| `data_envio` | TIMESTAMP | DEFAULT NOW() |
| `id_remetente` | UUID | FK → `usuarios.id_usuario`, NOT NULL |
| `id_destinatario` | UUID | FK → `usuarios.id_usuario`, NOT NULL |
| `id_comunicado_origem` | UUID | FK → `comunicados.id_comunicado`, NULL |
| `id_mensagem_resposta` | UUID | FK → `mensagens_diretas.id_mensagem`, NULL (self-join) |

#### `notificacoes`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_notificacao` | UUID | PK, DEFAULT uuid_generate_v4() |
| `id_usuario` | UUID | FK → `usuarios.id_usuario`, NOT NULL |
| `tipo` | VARCHAR(50) | NOT NULL · Ex: `NOVA_MENSAGEM`, `NOVO_COMUNICADO` |
| `conteudo` | VARCHAR(255) | NOT NULL |
| `lida` | BOOLEAN | DEFAULT FALSE |
| `data_criacao` | TIMESTAMP | DEFAULT NOW() |

### 7.2 Entidades Associativas (N:N)

#### `responsaveis_alunos`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_responsavel` | UUID | FK → `usuarios.id_usuario`, PK Composta |
| `id_aluno` | UUID | FK → `alunos.id_aluno`, PK Composta |
| `vinculo` | VARCHAR(50) | NULL · Ex: `Pai`, `Mãe`, `Avô` |

#### `professores_turmas`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_professor` | UUID | FK → `usuarios.id_usuario`, PK Composta |
| `id_turma` | UUID | FK → `turmas.id_turma`, PK Composta |
| `disciplina` | VARCHAR(100) | NOT NULL |

#### `leituras_comunicados`

| Campo | Tipo | Restrições |
|---|---|---|
| `id_comunicado` | UUID | FK → `comunicados.id_comunicado`, PK Composta |
| `id_responsavel` | UUID | FK → `usuarios.id_usuario`, PK Composta |
| `status_lido` | BOOLEAN | DEFAULT FALSE |
| `data_hora_leitura` | TIMESTAMP | NULL |
| `ciencia_confirmada` | BOOLEAN | DEFAULT FALSE |

---

## 8. Arquitetura Técnica

### 8.1 Stack

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| **Front-end** | React + React Query | Interface responsiva; cache de dados; atributos `data-testid` para E2E. |
| **Back-end / API** | Node.js + Express (REST) | Regras de negócio, autenticação JWT, sanitização de inputs, roteamento RBAC. |
| **Banco de Dados / Auth** | Supabase (PostgreSQL) | Persistência, Row Level Security (RLS), Supabase Auth (JWT). |
| **Infraestrutura** | Nuvem (a definir) | Deploy cloud para testes iniciais com professores e pais do CEMEI. |

### 8.2 Princípios Arquiteturais

- **Separação de responsabilidades:** lógica de negócio exclusiva na API (RNF07).
- **Security by design:** RLS no banco + validação na API + sanitização de inputs (RNF03, RNF05).
- **Performance-first mobile:** React Query para cache e evitar re-fetch desnecessário (RNF02).
- **Testabilidade:** `data-testid` em todos os elementos interativos para cobertura E2E (RNF06).
- **Configuração via ambiente:** nenhuma credencial hardcoded no código-fonte (RNF04).

---

## 9. Matriz de Rastreabilidade

| Estória | RF Associados | RNF Associados | Regras de Negócio |
|---|---|---|---|
| US01 — Leitura e Filtro do Feed | RF05, RF06 | RNF01, RNF02, RNF03, RNF06 | RN01, RN02 |
| US02 — Assinatura de Ciência | RF07, RF08 | RNF06, RNF07 | RN03 |
| US03 — Mensageria Simples | RF09, RF10 | RNF05, RNF06 | — |
| US04 — Login e Roteamento RBAC | RF01, RF02, RF03 | RNF04, RNF06 | — |
| US05 — Gestão de Alunos e Turmas | RF13, RF15 | RNF06, RNF07 | RN08, RN10 |
| US06 — Vínculo Familiar | RF16 | RNF03, RNF06 | RN07, RN10 |
| US07 — Gestão de Professores | RF14 | RNF06 | RN09, RN10 |

---

## 10. Critérios de Aceite Globais (DoD)

A Definição de Pronto (Definition of Done) para qualquer entrega deste MVP:

- Funcionalidade implementada conforme critérios de aceite da estória (BDD validado).
- Testes E2E cobrindo o happy path e ao menos um cenário de erro.
- Code review aprovado com verificação de ausência de lógica de negócio no front-end.
- RLS testado: usuário sem permissão não acessa dados de outros responsáveis.
- Performance validada: rotas GET < 200 ms em ambiente de staging.
- Nenhuma credencial sensível commitada no repositório.
- Elementos interativos possuem atributos `data-testid` únicos e documentados.
- Deploy realizado em ambiente de nuvem com testes iniciais com professores e responsáveis do CEMEI.

---

## 11. Fora do Escopo — Fase 1

Os itens abaixo são reconhecidos como necessidades futuras, mas estão explicitamente excluídos do MVP:

- Controle de frequência e registro de faltas.
- Lançamento e consulta de notas e boletins.
- Agenda escolar com eventos e feriados.
- Aplicativo nativo para iOS ou Android.
- Integração com sistemas municipais de gestão escolar (SIGE).
- Notificações push via serviços externos (FCM/APNs).
- Relatórios e dashboards analíticos avançados.
- Suporte multilíngue.

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Baixa adesão digital por parte dos responsáveis. | Média | Treinamento presencial no CEMEI; interface simplificada e responsiva para mobile. |
| Falhas de configuração do RLS expondo dados de outros usuários. | Baixa | Testes de isolamento automatizados obrigatórios antes de cada deploy. |
| Performance degradada com aumento do volume de comunicados. | Baixa | Paginação no feed desde o MVP; cache via React Query; índices no PostgreSQL. |
| Escopo inflado durante o desenvolvimento (scope creep). | Média | Backlog priorizado com itens fora de escopo documentados na Seção 11. |
| Disponibilidade limitada de tempo do desenvolvedor (projeto solo). | Alta | MVP enxuto com funcionalidades críticas; entrega incremental por épico. |

---

## 13. Glossário

| Termo | Definição |
|---|---|
| **RBAC** | Role-Based Access Control — controle de acesso baseado no perfil do usuário. |
| **RLS** | Row Level Security — política de segurança no PostgreSQL que restringe o acesso a linhas individuais por usuário. |
| **JWT** | JSON Web Token — token stateless utilizado para autenticação entre front-end e API. |
| **MVP** | Minimum Viable Product — versão mínima do produto com funcionalidades suficientes para validação. |
| **BDD** | Behavior-Driven Development — metodologia de especificação em formato Dado/Quando/Então. |
| **DoD** | Definition of Done — conjunto de critérios que uma entrega deve satisfazer para ser considerada concluída. |
| **CEMEI** | Centro Municipal de Educação Infantil — instituição-alvo do projeto extensionista. |
| **Thread** | Encadeamento de mensagens em resposta a um comunicado original, preservando o contexto da conversa. |
| **ODS 04** | Objetivo de Desenvolvimento Sustentável nº 4 da ONU: Educação de Qualidade. |

---

*Confidencial — UNINTER / Engenharia de Software · v1.0 · Maio de 2026*
