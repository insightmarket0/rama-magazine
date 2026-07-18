-- Tabela 1: Avisos Internos
CREATE TABLE IF NOT EXISTS public.internal_announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela 2: Confirmações de Leitura (Ciente)
CREATE TABLE IF NOT EXISTS public.announcement_acknowledgments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID NOT NULL REFERENCES public.internal_announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Evita que um usuário dê "ciente" duas vezes no mesmo recado
    UNIQUE(announcement_id, user_id)
);

-- Ativar Row Level Security
ALTER TABLE public.internal_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Políticas para internal_announcements
-- 1. Leitura: Todos os usuários logados podem ler os avisos
CREATE POLICY "Leitura de avisos para todos"
    ON public.internal_announcements
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 2. Criação/Edição/Deleção: Apenas gerentes/admins (chefe/estrategista) ou quem criou
CREATE POLICY "Edição e Criação restrita"
    ON public.internal_announcements
    FOR ALL
    USING (
        auth.uid() = creator_id OR 
        (auth.jwt() ->> 'role_app' IN ('admin', 'manager'))
    );

-- Políticas para announcement_acknowledgments
-- 1. Leitura: Todos os usuários podem ver quem deu ciente
CREATE POLICY "Todos podem ver os cientes"
    ON public.announcement_acknowledgments
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 2. Inserção: O próprio usuário registra o SEU ciente
CREATE POLICY "Usuários marcam ciente"
    ON public.announcement_acknowledgments
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND 
        auth.role() = 'authenticated'
    );
