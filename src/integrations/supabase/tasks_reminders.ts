import { supabase } from './client';

export type TaskReminder = {
  id: string;
  creator_id: string;
  assignee_id: string | null;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluido';
  category: 'financeiro' | 'estrategia' | 'operacao_marketplace';
  created_at: string;
};

/**
 * Retorna as tarefas do Dashboard Diário do usuário atual,
 * trazendo primeiro as pendentes com prazo mais próximo.
 */
export async function getDailyDashboardTasks() {
  const { data, error } = await supabase
    .from('tasks_reminders')
    .select(`
      *,
      creator:creator_id ( full_name, avatar_url ),
      assignee:assignee_id ( full_name, avatar_url )
    `)
    .in('status', ['pendente', 'em_andamento'])
    .order('due_date', { ascending: true, nullsFirst: false }) // Prazos curtos primeiro
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Cria uma nova tarefa e delega para um assignee.
 */
export async function createTask(task: Omit<TaskReminder, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tasks_reminders')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data as TaskReminder;
}

/**
 * Toggle do status da tarefa para concluída (ou retorna para pendente).
 */
export async function toggleTaskStatus(id: string, currentStatus: TaskReminder['status']) {
  const newStatus = currentStatus === 'concluido' ? 'pendente' : 'concluido';
  
  const { data, error } = await supabase
    .from('tasks_reminders')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as TaskReminder;
}
