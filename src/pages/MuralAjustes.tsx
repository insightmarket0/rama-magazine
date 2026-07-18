import React, { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Plus, 
  Search,
  ShoppingCart,
  Store,
  Tag
} from "lucide-react";
import { QuickAdjustment } from "@/integrations/supabase/quick_adjustments";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Dados mockados baseados nos exemplos reais solicitados pelo usuário
const MOCK_TICKETS: any[] = [
  {
    id: "1",
    creator_id: "user_manager",
    assignee_id: "user_operacao_1",
    assignee_name: "Lucas",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "Aviso no kit de gás: corrigir a imagem e a descrição. Tem duas abraçadeiras na foto, mas é só uma.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins atrás
  },
  {
    id: "2",
    creator_id: "user_manager",
    assignee_id: null,
    assignee_name: null,
    marketplace: "Shopee",
    sku: "CAP002",
    description: "Retirar a marca do título e descrição do anúncio do cap na Shopee para evitar bloqueio.",
    status: "pendente",
    priority: "critico",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    creator_id: "user_manager",
    assignee_id: "user_operacao_2",
    assignee_name: "João",
    marketplace: "Amazon",
    sku: "MANG003",
    description: "Alterar as especificações do produto: retira a mangueira comum da descrição porque é uma pigtail.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "4",
    creator_id: "user_manager",
    assignee_id: "user_operacao_1",
    assignee_name: "Lucas",
    marketplace: "Geral",
    sku: "RGUARDANAPO",
    description: "Tirar a letra R que foi digitada por erro antes da palavra Guardanapo no SKU.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  }
];

const getMarketplaceStyle = (marketplace: string) => {
  switch (marketplace.toLowerCase()) {
    case 'mercado livre':
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case 'shopee':
      return "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/20";
    case 'magalu':
    case 'magazine luiza':
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case 'amazon':
      return "bg-white/10 text-white border-white/20";
    default:
      return "bg-white/5 text-gray-400 border-white/10";
  }
};

export default function MuralAjustes() {
  const [tickets, setTickets] = useState<any[]>(MOCK_TICKETS);
  const [filter, setFilter] = useState("todos");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    marketplace: 'Mercado Livre',
    sku: '',
    description: '',
    priority: 'normal'
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    
    const newTicket = {
      id: Math.random().toString(),
      creator_id: "user_manager",
      assignee_id: null,
      assignee_name: null,
      marketplace: formData.marketplace,
      sku: formData.sku,
      description: formData.description,
      status: "pendente",
      priority: formData.priority,
      created_at: new Date().toISOString()
    };
    
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setFormData({ marketplace: 'Mercado Livre', sku: '', description: '', priority: 'normal' });
  };

  const handleResolve = (id: string) => {
    // Na vida real: await updateTicketStatus(id, 'resolvido')
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolvido', resolved_by: 'Você' } : t));
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === "todos") return true;
    return t.marketplace.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-light tracking-tight text-white flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Mural de Ajustes Rápidos
          </h2>
          <p className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">
            Kanban ágil de correções técnicas para anúncios e cadastro de produtos
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar SKU ou tarefa..." 
              className="pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-[#00FF00]/50 focus:shadow-[0_0_10px_rgba(0,255,0,0.1)] transition-all w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]"
          >
            <Plus className="h-4 w-4" />
            Novo Ticket
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['Todos', 'Shopee', 'Mercado Livre', 'Amazon', 'Geral'].map((m) => (
          <button 
            key={m}
            onClick={() => setFilter(m.toLowerCase())}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === m.toLowerCase() 
                ? 'bg-white/10 text-white border-b-2 border-[#00FF00]' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-b-2 border-transparent'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Grid de Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTickets.map((ticket) => {
          const isResolved = ticket.status === 'resolvido';
          
          return (
            <div 
              key={ticket.id} 
              className={`bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-between shadow-2xl transition-all group ${
                isResolved ? 'opacity-50 border border-[#00FF00]/20' : 'border border-white/5 hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border flex items-center gap-2 ${getMarketplaceStyle(ticket.marketplace)}`}>
                    <Store className="h-3 w-3 opacity-70" />
                    {ticket.marketplace}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Hoje
                  </span>
                </div>
                
                {ticket.sku && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-2 w-2 rounded-full ${ticket.priority === 'critico' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]'}`} title={ticket.priority === 'critico' ? 'Crítico / Risco' : 'Normal / Estético'} />
                    <div className="flex items-center gap-2 text-[#00FF00] font-light tracking-wide">
                      <Tag className="h-4 w-4 opacity-70" />
                      <a href={`https://seller.shopee.com.br/portal/product/list?search=${ticket.sku}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF00]/80 transition-colors">
                        SKU: {ticket.sku}
                      </a>
                    </div>
                  </div>
                )}
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-gray-600 shrink-0" />
                  <span className={isResolved ? "line-through text-gray-500" : ""}>{ticket.description}</span>
                </p>
              </div>
              
              <div className="pt-5 border-t border-white/5 flex items-center justify-between gap-4 mt-auto">
                {/* Avatar / Assignee */}
                <div className="flex items-center gap-2 shrink-0">
                  {ticket.assignee_name ? (
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-[10px] font-bold tracking-wider" title={`Responsável: ${ticket.assignee_name}`}>
                      {ticket.assignee_name.substring(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 text-[10px] font-bold" title="Sem responsável (Livre)">
                      --
                    </div>
                  )}
                </div>

                {isResolved ? (
                  <div className="text-[#00FF00]/70 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Resolvido por {ticket.resolved_by}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleResolve(ticket.id)}
                    className="flex-1 py-2.5 px-4 bg-transparent hover:bg-[#00FF00]/10 border border-white/10 hover:border-[#00FF00]/50 text-gray-400 hover:text-[#00FF00] text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <CheckCircle2 className="h-4 w-4 group-hover/btn:scale-110 group-hover/btn:drop-shadow-[0_0_8px_rgba(0,255,0,0.5)] transition-all" />
                    Marcar Resolvido
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredTickets.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
            <CheckCircle2 className="h-12 w-12 mb-3 text-white/10" />
            <p>Nenhum ajuste pendente para este canal.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#00FF00]" />
              Novo Ticket de Ajuste
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados da correção necessária no anúncio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Plataforma</label>
              <select 
                value={formData.marketplace}
                onChange={e => setFormData({...formData, marketplace: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50"
              >
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Shopee">Shopee</option>
                <option value="Magalu">Magalu</option>
                <option value="Amazon">Amazon</option>
                <option value="Geral">Geral</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">SKU (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: KITGAS001"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Prioridade</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50"
              >
                <option value="normal">Normal / Estético</option>
                <option value="critico">Crítico / Risco de Bloqueio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">O que precisa ser feito?</label>
              <textarea 
                placeholder="Descreva o ajuste necessário de forma clara..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 min-h-[100px] resize-none"
                required
              />
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]"
              >
                Criar Ticket
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
