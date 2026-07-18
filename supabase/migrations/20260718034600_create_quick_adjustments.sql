-- Criação de tipos Enum
CREATE TYPE marketplace_type AS ENUM ('Shopee', 'Mercado Livre', 'Amazon', 'Geral');
CREATE TYPE ticket_status AS ENUM ('pendente', 'resolvido');

-- Criação da tabela
CREATE TABLE IF NOT EXISTS public.quick_adjustments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    marketplace marketplace_type NOT NULL DEFAULT 'Geral',
    sku TEXT,
    description TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Ativar Row Level Security
ALTER TABLE public.quick_adjustments ENABLE ROW LEVEL SECURITY;

-- Políticas (RLS)
-- 1. Leitura: Todos os usuários autenticados da empresa podem ver os tickets
CREATE POLICY "Usuários autenticados podem ver os tickets"
    ON public.quick_adjustments
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 2. Criação: Usuários autenticados podem criar tickets
CREATE POLICY "Usuários autenticados podem criar tickets"
    ON public.quick_adjustments
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Atualização: Membros da equipe podem editar tickets
CREATE POLICY "Membros da equipe podem editar tickets"
    ON public.quick_adjustments
    FOR UPDATE
    USING (auth.role() = 'authenticated');
