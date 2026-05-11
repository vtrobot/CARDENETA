# Especificação: Configuração Inicial (Setup)

## 1. Visão Geral
Esta etapa aborda a infraestrutura base descrita no PRD para o desenvolvimento da aplicação. Trata-se da criação da fundação do projeto (Front-end, Back-end e Banco de Dados/Auth).

## 2. Requisitos (Traceability)
| ID | Descrição | Origem |
|---|---|---|
| REQ-SET-01 | Inicializar repositório Git (caso não exista). | RNF04 |
| REQ-SET-02 | Criar projeto Front-end React com Vite. | PRD 8.1 |
| REQ-SET-03 | Configurar React Query no Front-end. | RNF02 |
| REQ-SET-04 | Criar projeto Back-end Node.js com Express e TypeScript. | PRD 8.1 |
| REQ-SET-05 | Configurar variáveis de ambiente (`.env`). | RNF04 |
| REQ-SET-06 | Criar schema do banco de dados no Supabase. | PRD 7.1 |

## 3. Escopo Auto-Sized
**Complexidade**: Média (várias configurações iniciais).
**Fases aplicadas**:
- [x] Specify
- [ ] Design (Padrão, não exige doc extra)
- [x] Tasks (Para guiar a execução)
- [ ] Execute
