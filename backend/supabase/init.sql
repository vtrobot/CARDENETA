-- Configuração Inicial do Banco de Dados - Caderneta Escola & Família
-- Baseado no PRD Seção 7.1 e 7.2

-- Habilitar a extensão pgcrypto para geração de UUIDs (se necessário, Supabase já possui)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela: usuarios
CREATE TABLE public.usuarios (
    id UUID DEFAULT auth.uid() PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    papel VARCHAR(50) NOT NULL CHECK (papel IN ('responsavel', 'professor', 'coordenacao')),
    telefone VARCHAR(20),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Tabela: turmas
CREATE TABLE public.turmas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano_letivo INT NOT NULL,
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('manha', 'tarde', 'integral')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Tabela: professores_turmas (Relacionamento N:N)
CREATE TABLE public.professores_turmas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professor_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
    data_vinculo TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(professor_id, turma_id)
);

-- 4. Tabela: alunos
CREATE TABLE public.alunos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. Tabela: responsaveis_alunos (Relacionamento N:N)
CREATE TABLE public.responsaveis_alunos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    responsavel_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
    grau_parentesco VARCHAR(50) NOT NULL,
    data_vinculo TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(responsavel_id, aluno_id)
);

-- 6. Tabela: comunicados
CREATE TABLE public.comunicados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    autor_id UUID NOT NULL REFERENCES public.usuarios(id),
    turma_id UUID REFERENCES public.turmas(id),
    nivel_urgencia VARCHAR(20) NOT NULL DEFAULT 'baixa' CHECK (nivel_urgencia IN ('baixa', 'media', 'alta')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 7. Tabela: leituras_comunicados
CREATE TABLE public.leituras_comunicados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comunicado_id UUID NOT NULL REFERENCES public.comunicados(id) ON DELETE CASCADE,
    responsavel_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    data_leitura TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    assinatura_digital VARCHAR(255),
    UNIQUE(comunicado_id, responsavel_id)
);

-- 8. Tabela: mensagens_diretas
CREATE TABLE public.mensagens_diretas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    remetente_id UUID NOT NULL REFERENCES public.usuarios(id),
    destinatario_id UUID NOT NULL REFERENCES public.usuarios(id),
    aluno_id UUID REFERENCES public.alunos(id),
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 9. Tabela: notificacoes
CREATE TABLE public.notificacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    referencia_id UUID -- Pode ser ID do comunicado, mensagem, etc.
);

-- Habilitar RLS (Row Level Security) - Básicos
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores_turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsaveis_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leituras_comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_diretas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Nota: Políticas de segurança detalhadas (Policies) serão implementadas nas próximas fases.
