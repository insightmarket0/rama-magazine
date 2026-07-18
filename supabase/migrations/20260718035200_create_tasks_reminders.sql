-- Criação de tipos Enum
CREATE TYPE task_priority AS ENUM ('baixa', 'media', 'alta');
CREATE TYPE task_status AS ENUM ('pendente', 'em_andamento', 'concluido');
CREATE TYPE task_category AS ENUM ('financeiro', 'estrategia', 'operacao_marketplace');

-- Criação da tabela
CREATE TABLE IF NOT EXISTS public.tasks_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority task_priority NOT NULL DEFAULT 'media',
    status task_status NOT NULL DEFAULT 'pendente',
    category task_category NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar Row Level Security
ALTER TABLE public.tasks_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas (RLS)

-- 1. Leitura: O funcionário vê o que criou, o que foi delegado a ele, ou tudo se for ADMIN
CREATE POLICY "Usuários veem suas tarefas ou todas se admin"
    ON public.tasks_reminders
    FOR SELECT
    USING (
        auth.uid() = creator_id OR 
        auth.uid() = assignee_id OR 
        (auth.jwt() ->> 'role_app' = 'admin') 
    );

-- 2. Criação: Qualquer usuário logado pode criar
CREATE POLICY "Usuários autenticados podem criar tarefas"
    ON public.tasks_reminders
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Edição: Funcionários só podem editar suas próprias tarefas ou as delegadas a eles (ou Admin)
CREATE POLICY "Edição restrita aos envolvidos ou admin"
    ON public.tasks_reminders
    FOR UPDATE
    USING (
        auth.uid() = creator_id OR 
        auth.uid() = assignee_id OR 
        (auth.jwt() ->> 'role_app' = 'admin')
    );

-- 4. Deleção: Apenas quem criou ou Admin
CREATE POLICY "Apenas criador ou admin podem deletar"
    ON public.tasks_reminders
    FOR DELETE
    USING (
        auth.uid() = creator_id OR 
        (auth.jwt() ->> 'role_app' = 'admin')
    );
