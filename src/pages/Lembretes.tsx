import React, { useState } from "react";
import { 
  CheckSquare, 
  Clock, 
  CircleDashed,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  MoreVertical,
  CalendarDays
} from "lucide-react";
import { TaskReminder } from "@/integrations/supabase/tasks_reminders";
import { format, isBefore, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mockados baseados nos exemplos reais solicitados pelo usuário
const MOCK_TASKS: TaskReminder[] = [
  {
    id: "1",
    creator_id: "user_chefe",
    assignee_id: "user_chefe",
    title: "Pagar fornecedor de embalagens",
    description: "Vencimento na parte da tarde, não esquecer de baixar o boleto no email.",
    due_date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), // Hoje às 14:00
    priority: "alta",
    status: "pendente",
    category: "financeiro",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    creator_id: "user_manager",
    assignee_id: "user_manager",
    title: "Analisar por que o anúncio X da Shopee caiu de posição",
    description: "Verificar CTR, conversão e concorrentes novos.",
    priority: "media",
    status: "pendente",
    category: "estrategia",
    created_at: new Date(Date.now() - 1000000).toISOString(),
  },
  {
    id: "3",
    creator_id: "user_manager",
    assignee_id: "user_operacao_1",
    title: "Replicar correção em todos os canais",
    description: "Tira o R antes do Guardanapo, foi erro de escrita meu. Atualizar Mercado Livre, Amazon e Shopee.",
    priority: "alta",
    status: "pendente",
    category: "operacao_marketplace",
    created_at: new Date(Date.now() - 2000000).toISOString(),
  },
  {
    id: "4",
    creator_id: "user_manager",
    assignee_id: "user_operacao_2",
    title: "Ajustar descrições de Hidráulica",
    description: "Retira a mangueira pq é uma pigtail. Atualizar o texto nos anúncios ativos.",
    priority: "media",
    status: "em_andamento",
    category: "operacao_marketplace",
    created_at: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "5",
    creator_id: "user_manager",
    assignee_id: "user_operacao_1",
    title: "Atualizar foto do kit de gás",
    description: "Aqui tem duas abraçadeiras, é só uma. Trocar a foto do anúncio mestre.",
    priority: "media",
    status: "pendente",
    category: "operacao_marketplace",
    created_at: new Date(Date.now() - 4000000).toISOString(),
  }
];

export default function Lembretes() {
  const [tasks, setTasks] = useState<TaskReminder[]>(MOCK_TASKS);
  
  // Função que muda a cor do card financeiro baseado no prazo (due_date)
  const getDeadlineColor = (dueDate?: string) => {
    if (!dueDate) return "text-gray-400 border-white/5 bg-[#111315]/80";
    const date = parseISO(dueDate);
    const now = new Date();
    
    if (isBefore(date, now)) {
      // Atrasado / Estourado
      return "text-red-400 border-red-500/30 bg-red-500/5 shadow-red-500/10";
    }
    
    if (isToday(date)) {
      // Vence hoje (Atenção)
      return "text-orange-400 border-orange-500/30 bg-orange-500/5 shadow-orange-500/10";
    }

    return "text-gray-400 border-white/5 bg-[#111315]/80";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financeiro': return <DollarSign className="h-5 w-5 text-emerald-400" />;
      case 'estrategia': return <TrendingUp className="h-5 w-5 text-purple-400" />;
      case 'operacao_marketplace': return <Package className="h-5 w-5 text-blue-400" />;
      default: return <CheckSquare className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'financeiro': return "Financeiro";
      case 'estrategia': return "Estratégia";
      case 'operacao_marketplace': return "Operação";
      default: return category;
    }
  };

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'concluido' ? 'pendente' : 'concluido' };
      }
      return t;
    }));
  };

  const pendingTasks = tasks.filter(t => t.status !== 'concluido');
  const todoTasks = tasks.filter(t => t.status === 'pendente');
  const doingTasks = tasks.filter(t => t.status === 'em_andamento');
  const doneTasks = tasks.filter(t => t.status === 'concluido');

  const renderCard = (task: TaskReminder) => {
    const cardStyles = getDeadlineColor(task.due_date);
    const isCompleted = task.status === 'concluido';
    
    return (
      <div 
        key={task.id} 
        className={`bg-white/5 backdrop-blur-md border rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${
          isCompleted ? 'border-white/5 opacity-60' : 
          cardStyles.includes('bg-red') || cardStyles.includes('bg-orange') ? cardStyles : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
              {getCategoryLabel(task.category)}
            </span>
            {task.priority === 'alta' && !isCompleted && (
              <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                Urgente
              </span>
            )}
          </div>
          <button 
            onClick={() => handleToggle(task.id)} 
            className="text-white/20 hover:text-[#00FF00] transition-colors"
            title="Mover card"
          >
            {isCompleted ? <CheckCircle2 className="h-5 w-5 text-[#00FF00]" /> : task.status === 'em_andamento' ? <Clock className="h-5 w-5 text-blue-400" /> : <CircleDashed className="h-5 w-5" />}
          </button>
        </div>
        
        <h4 className={`text-white font-bold text-sm leading-snug mb-2 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h4>
        
        {task.description && !isCompleted && (
          <p className="text-gray-400 text-xs mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
        
        {!isCompleted && task.due_date && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
             <span className={`px-2.5 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 ${
                 isBefore(parseISO(task.due_date), new Date()) ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}>
                <Clock className="h-3 w-3" />
                {format(parseISO(task.due_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
              </span>
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                {getCategoryIcon(task.category)}
              </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-48px)]">
      
      {/* Header com Métricas Integradas */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 shrink-0">
        <div>
          <h2 className="text-4xl font-light tracking-tight text-white flex items-center gap-4">
            <CalendarDays className="h-10 w-10 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Quadro Operacional
          </h2>
          <p className="text-gray-400 mt-2 font-medium tracking-wide">
            Gestão visual de tarefas no padrão Kanban.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-2xl flex gap-6 shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Urgências Hoje</span>
              <span className="text-xl font-light text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">
                {pendingTasks.filter(t => t.due_date && isToday(parseISO(t.due_date))).length}
              </span>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Concluídas</span>
              <span className="text-xl font-light text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]">
                {doneTasks.length}
              </span>
            </div>
          </div>

          <button className="h-full flex items-center justify-center gap-2 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 px-6 py-4 rounded-2xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
            <Plus className="h-4 w-4" strokeWidth={3} />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Board Kanban Horizontal */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar flex-1 items-start">
        
        {/* Coluna A Fazer */}
        <div className="min-w-[320px] w-[320px] bg-[#0a0a0a]/80 backdrop-blur-2xl border-x border-b border-white/5 border-t-[3px] border-t-white/20 rounded-[2rem] flex flex-col max-h-full shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="p-5 flex items-center justify-between border-b border-white/5 shrink-0">
            <h3 className="text-white font-bold tracking-wide flex items-center gap-3">
              <CircleDashed className="h-5 w-5 text-gray-400" />
              A Fazer
            </h3>
            <span className="bg-white/10 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg">{todoTasks.length}</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {todoTasks.length === 0 && (
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                <CheckSquare className="h-8 w-8 text-white/10" />
                <p className="text-xs text-gray-500 font-medium">Nenhuma tarefa pendente</p>
              </div>
            )}
            {todoTasks.map(renderCard)}
          </div>
          <div className="p-4 border-t border-white/5 shrink-0">
            <button className="w-full flex items-center gap-2 text-gray-500 hover:text-white font-medium text-sm p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Plus className="h-4 w-4" />
              Adicionar Cartão
            </button>
          </div>
        </div>

        {/* Coluna Em Andamento */}
        <div className="min-w-[320px] w-[320px] bg-[#0a0a0a]/80 backdrop-blur-2xl border-x border-b border-white/5 border-t-[3px] border-t-blue-500 rounded-[2rem] flex flex-col max-h-full shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="p-5 flex items-center justify-between border-b border-white/5 shrink-0">
            <h3 className="text-white font-bold tracking-wide flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
              Em Andamento
            </h3>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1.5 rounded-lg">{doingTasks.length}</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {doingTasks.length === 0 && (
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                <Clock className="h-8 w-8 text-white/10" />
                <p className="text-xs text-gray-500 font-medium">Nenhuma tarefa em andamento</p>
              </div>
            )}
            {doingTasks.map(renderCard)}
          </div>
          <div className="p-4 border-t border-white/5 shrink-0">
            <button className="w-full flex items-center gap-2 text-gray-500 hover:text-white font-medium text-sm p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Plus className="h-4 w-4" />
              Adicionar Cartão
            </button>
          </div>
        </div>

        {/* Coluna Concluído */}
        <div className="min-w-[320px] w-[320px] bg-[#0a0a0a]/80 backdrop-blur-2xl border-x border-b border-white/5 border-t-[3px] border-t-[#00FF00] rounded-[2rem] flex flex-col max-h-full shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="p-5 flex items-center justify-between border-b border-white/5 shrink-0">
            <h3 className="text-white font-bold tracking-wide flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]" />
              Concluído
            </h3>
            <span className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 text-xs font-bold px-3 py-1.5 rounded-lg">{doneTasks.length}</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4 opacity-70 hover:opacity-100 transition-opacity">
            {doneTasks.length === 0 && (
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-white/10" />
                <p className="text-xs text-gray-500 font-medium">Nenhuma tarefa concluída</p>
              </div>
            )}
            {doneTasks.map(renderCard)}
          </div>
          <div className="p-4 border-t border-white/5 shrink-0">
            <button className="w-full flex items-center gap-2 text-gray-500 hover:text-white font-medium text-sm p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Plus className="h-4 w-4" />
              Adicionar Cartão
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
