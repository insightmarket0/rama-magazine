import { supabase } from './client';

export type QuickAdjustment = {
  id: string;
  creator_id: string;
  assignee_id: string | null;
  marketplace: 'Shopee' | 'Mercado Livre' | 'Amazon' | 'Geral';
  sku?: string;
  description: string;
  status: 'pendente' | 'resolvido';
  created_at: string;
  resolved_at?: string;
};

// CREATE - Criar um novo ticket
export async function createTicket(ticket: Omit<QuickAdjustment, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('quick_adjustments')
    .insert([ticket])
    .select()
    .single();

  if (error) throw error;
  return data as QuickAdjustment;
}

// READ - Feed de Tickets Pendentes
// Retorna os tickets com status 'pendente' ordenados do mais recente para o mais antigo
export async function getPendingTickets() {
  const { data, error } = await supabase
    .from('quick_adjustments')
    .select(`
      *,
      creator:creator_id ( full_name, avatar_url ),
      assignee:assignee_id ( full_name, avatar_url )
    `)
    .eq('status', 'pendente')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// UPDATE - Marcar como resolvido ou alterar status
export async function updateTicketStatus(id: string, status: 'pendente' | 'resolvido') {
  const resolved_at = status === 'resolvido' ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('quick_adjustments')
    .update({ status, resolved_at })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as QuickAdjustment;
}

// UPDATE - Atribuir ticket para alguém da operação
export async function assignTicket(id: string, assignee_id: string) {
  const { data, error } = await supabase
    .from('quick_adjustments')
    .update({ assignee_id })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as QuickAdjustment;
}
