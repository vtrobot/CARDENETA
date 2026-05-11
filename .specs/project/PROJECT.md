# Caderneta Escola & Família - Visão e Objetivos

## Visão Geral
A Caderneta Escola & Família é uma aplicação web responsiva que digitaliza o canal de comunicação escola-família. A plataforma oferece três jornadas distintas (Responsável, Professor e Coordenação) para resolver problemas com cadernetas físicas, como perda de informação, falta de rastreabilidade e ausência de canal oficial estruturado.

## Objetivos (KPIs)
- Substituir a caderneta física por um canal digital rastreável e auditável.
- Garantir que comunicados urgentes gerem ciência formal dos responsáveis.
- Prover ao corpo docente e à coordenação um painel de gestão de turmas, alunos e vínculos familiares.
- Servir de base técnica escalável para funcionalidades futuras.

### Metas (MVP)
- Taxa de leitura de comunicados: ≥ 80% em 48h.
- Confirmação de ciência (urgência Alta): 100% dos avisos críticos.
- Tempo de resposta da API (GET): < 200 ms (p95).
- Taxa de cobertura de testes E2E: ≥ 70% dos fluxos críticos.

## Personas e Perfis
- **Responsável**: Acompanhar comunicados e interagir com a escola.
- **Professor**: Publicar e gerenciar comunicados para suas turmas.
- **Coordenação**: Gerir base cadastral e configurar o sistema.

## Stack Tecnológico
- Frontend: React + React Query
- Backend: Node.js + Express
- Banco de Dados / Auth: Supabase (PostgreSQL + JWT)
