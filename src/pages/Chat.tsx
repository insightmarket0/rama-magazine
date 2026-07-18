import React, { useState } from "react";
import { 
  Mic, 
  Paperclip, 
  Send,
  MoreHorizontal,
  Hash,
  Search,
  Pin,
  AtSign,
  Bookmark,
  Reply,
  Smile,
  CheckCircle2,
  XCircle,
  Headphones,
  Calendar,
  Bold,
  Italic,
  Strikethrough,
  List,
  Code,
  Headset,
  AlignLeft,
  X,
  Menu
} from "lucide-react";

const CHANNELS = [
  { id: "c1", name: "geral", unread: 0 },
  { id: "c2", name: "aprovacoes-urgentes", unread: 1 },
  { id: "c3", name: "logistica", unread: 0 },
];

const DIRECT_MESSAGES = [
  { id: "u1", name: "Lucas", unread: 0, online: true, initials: "LU", color: "text-blue-400 bg-blue-400/10", statusIcon: <Headphones className="w-3 h-3"/>, statusText: "Focus Time" },
  { id: "u2", name: "Anderson", unread: 1, online: false, initials: "AN", color: "text-[#00FF00] bg-[#00FF00]/10", statusIcon: <Calendar className="w-3 h-3"/>, statusText: "Em Reunião" },
  { id: "u3", name: "Lívia", unread: 0, online: true, initials: "LI", color: "text-purple-400 bg-purple-400/10", statusIcon: null, statusText: "" },
];

const MOCK_MESSAGES = [
  { 
    id: 1, 
    type: "system",
    time: "11:15", 
    text: "Lívia alterou as permissões do canal #aprovacoes-urgentes."
  },
  { 
    id: 2, 
    type: "message",
    sender: "Anderson", 
    time: "11:20", 
    text: "Equipe, precisamos aprovar o orçamento da nova campanha de ADS urgente para rodar hoje.", 
    initials: "AN",
    color: "from-green-500/20 to-green-900/20 text-[#00FF00]"
  },
  { 
    id: 3, 
    type: "workflow",
    sender: "Workflow Bot", 
    time: "11:21", 
    initials: "🤖",
    color: "from-orange-500/20 to-orange-900/20 text-orange-400",
    workflowCard: {
      title: "Orçamento de Campanha",
      description: "Valor solicitado: R$ 5.000,00 | Plataforma: Meta Ads",
      requester: "Marketing",
      borderColor: "border-orange-500/30"
    }
  },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("aprovacoes-urgentes");
  const [message, setMessage] = useState("");
  const [showThread, setShowThread] = useState(true);

  const spectralGradientRing = "bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)]";

  return (
    <div className="flex h-[calc(100vh-48px)] w-full bg-[#0d0d0d] rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500 font-sans border border-black/50 relative">
      
      {/* 1. Sidebar Esquerda */}
      <div className="w-72 bg-[#121212] border-r border-[#1a1a1a] flex flex-col relative z-10 shrink-0 shadow-[8px_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Workspace Header - SKEUOMORPHIC & SPECTRAL */}
        <div className="p-6 pb-4">
          <div className="bg-[#181818] rounded-full p-2 flex items-center justify-between shadow-[inset_0_4px_10px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.05)] border border-[#0a0a0a]">
            
            <div className="flex items-center gap-3">
              {/* Spectral Ring Logo */}
              <div className={`h-11 w-11 rounded-full p-[2px] ${spectralGradientRing} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                <div className="bg-[#161616] h-full w-full rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-black/50">
                  <span className="text-gray-300 font-black text-sm tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">RM</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-gray-200 font-bold text-sm tracking-tight leading-none mb-0.5 drop-shadow-md">RAMA Studio</h2>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  Enterprise
                </span>
              </div>
            </div>
            
            <button className="h-8 w-8 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.5)] mr-1 hover:bg-[#252525] transition-colors">
              <Menu className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Global Search & Quick Filters */}
        <div className="px-6 py-2">
          <div className="relative mb-5 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-full pl-10 pr-4 py-2.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
            />
          </div>
          <div className="space-y-1.5">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#1a1a1a] text-gray-400 hover:text-gray-200 transition-colors group text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="w-6 flex justify-center"><AtSign className="h-4 w-4 group-hover:text-white transition-colors" /></div>
              Menções
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1e1e1e] text-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors group text-sm font-medium border border-[#2a2a2a]">
              <div className="w-6 flex justify-center"><Reply className="h-4 w-4 text-gray-300 drop-shadow-md" /></div>
              Threads Ativas
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar space-y-8 pb-6 mt-4">
          {/* Canais */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center justify-between group px-1 drop-shadow-sm">
              Canais
            </h4>
            <div className="space-y-1">
              {CHANNELS.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveChannel(c.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${
                    activeChannel === c.name 
                      ? 'bg-[#1e1e1e] border border-[#2a2a2a] shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] text-gray-200 font-bold' 
                      : 'hover:bg-[#1a1a1a] text-gray-500 font-medium border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <Hash className={`h-4 w-4 ${activeChannel === c.name ? 'text-gray-300' : 'opacity-40'}`} />
                    {c.name}
                  </span>
                  {c.unread > 0 && (
                    <span className="bg-[#252525] border border-[#333] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center justify-between group px-1">
              Equipe
            </h4>
            <div className="space-y-1.5">
              {DIRECT_MESSAGES.map(u => (
                <button 
                  key={u.id}
                  className="w-full flex flex-col px-3 py-2.5 rounded-xl hover:bg-[#1a1a1a] transition-all group text-left border border-transparent"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-3 text-sm text-gray-400 font-medium group-hover:text-gray-200">
                      <div className="relative">
                        {/* Avatar com sombra interna e borda metálica */}
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold ${u.color} border border-[#2a2a2a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.5)]`}>
                          {u.initials}
                        </div>
                        {u.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212] shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                      </div>
                      {u.name}
                    </span>
                  </div>
                  {u.statusText && (
                    <div className="flex items-center gap-1.5 mt-1.5 ml-10 text-[10px] text-gray-600 font-bold tracking-wider">
                      {u.statusIcon} <span className="opacity-80">{u.statusText}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Área Principal do Chat */}
      <div className="flex-1 flex flex-col bg-[#111] relative min-w-0 shadow-[inset_4px_0_24px_rgba(0,0,0,0.5)]">
        
        {/* Header do Canal - Dark Premium */}
        <div className="h-[72px] px-8 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111] z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#0a0a0a] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-[#1a1a1a]">
              <Hash className="h-4 w-4 text-gray-500 drop-shadow-md" />
            </div>
            <div>
              <h3 className="text-gray-200 font-bold text-lg tracking-tight">{activeChannel}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
               {DIRECT_MESSAGES.map(u => (
                 <div key={u.id} className={`h-8 w-8 rounded-full border-2 border-[#111] flex items-center justify-center text-[9px] font-bold ${u.color} shadow-md`}>
                   {u.initials}
                 </div>
               ))}
            </div>
            
            {/* Spectral Huddle Button */}
            <button className="relative p-[1px] rounded-full overflow-hidden group shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              <div className={`absolute inset-0 ${spectralGradientRing} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative bg-[#161616] px-5 py-2 rounded-full flex items-center gap-2 border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Headset className="h-4 w-4 text-gray-300 drop-shadow-md" />
                <span className="font-bold text-xs text-gray-200 tracking-wide drop-shadow-md">Huddle</span>
              </div>
            </button>

          </div>
        </div>

        {/* Pinned Items - Recessed Pill */}
        <div className="px-8 py-3 bg-[#0d0d0d] border-b border-[#1a1a1a]">
          <div className="bg-[#161616] border border-[#222] px-4 py-2 rounded-full flex items-center gap-3 text-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] w-fit">
            <Pin className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-300 font-bold whitespace-nowrap">Fixado:</span>
            <span className="text-gray-500 truncate">Aprovações acima de R$ 3.000 precisam de 2 vistos.</span>
          </div>
        </div>

        {/* Feed de Mensagens */}
        <div className="flex-1 overflow-y-auto pt-6 pb-6 custom-scrollbar flex flex-col justify-end">
          
          <div className="flex flex-col pb-2 space-y-6">
            {MOCK_MESSAGES.map((msg) => {
              if (msg.type === "system") {
                return (
                  <div key={msg.id} className="flex items-center gap-4 px-10 group">
                    <span className="text-[10px] font-bold text-gray-600 w-10 text-right">{msg.time}</span>
                    <div className="flex-1 text-xs text-gray-500 font-medium flex items-center gap-3">
                      <div className="h-px bg-gradient-to-r from-transparent to-[#1a1a1a] flex-1" />
                      <span className="italic">{msg.text}</span>
                      <div className="h-px bg-gradient-to-l from-transparent to-[#1a1a1a] flex-1" />
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={msg.id} 
                  className="flex gap-5 px-10 group relative"
                >
                  {/* Hover Actions Bar - Skeuomorphic Pill */}
                  <div className="absolute right-10 -top-4 bg-[#1e1e1e] border border-[#333] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] hidden group-hover:flex items-center p-1 z-20">
                    <button className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-full transition-colors"><Smile className="h-4 w-4" /></button>
                    <button onClick={() => setShowThread(true)} className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-full transition-colors"><Reply className="h-4 w-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-full transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>

                  {/* Avatar */}
                  <div className="w-12 shrink-0 flex flex-col items-center pt-1">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-b ${msg.color} shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-black/50`}>
                      {msg.initials}
                    </div>
                  </div>
                  
                  {/* Message Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-gray-200 font-bold text-[15px]">{msg.sender}</span>
                      <span className="text-[11px] text-gray-600 font-semibold">{msg.time}</span>
                    </div>
                    
                    {msg.type === "message" && (
                      <div className="text-gray-400 text-[15px] leading-relaxed font-normal">
                        {msg.text}
                      </div>
                    )}

                    {/* Actionable Workflow Card - Skeuomorphic Dark */}
                    {msg.type === "workflow" && msg.workflowCard && (
                      <div className="mt-3 max-w-xl rounded-2xl bg-[#161616] p-[1px] shadow-[0_8px_20px_rgba(0,0,0,0.4)] relative">
                         {/* Border Gradient wrapper */}
                         <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] rounded-2xl" />
                         
                         <div className="relative bg-[#141414] rounded-2xl p-5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] border border-black">
                           <div className="flex items-start justify-between mb-5">
                             <div>
                               <h4 className="text-gray-200 font-extrabold text-lg mb-1 tracking-tight drop-shadow-md">{msg.workflowCard.title}</h4>
                               <p className="text-gray-500 text-sm font-medium">{msg.workflowCard.description}</p>
                             </div>
                             <span className="bg-[#1a1a1a] text-gray-400 border border-[#222] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                               Pendente
                             </span>
                           </div>
                           
                           <div className="flex gap-4 pt-5 border-t border-[#1a1a1a]">
                             <button className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#141414] hover:from-[#252525] hover:to-[#1a1a1a] text-gray-300 border border-[#2a2a2a] transition-all font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
                               <CheckCircle2 className="h-4 w-4 text-green-500 drop-shadow-md" /> Aprovar
                             </button>
                             <button className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#141414] hover:from-[#252525] hover:to-[#1a1a1a] text-gray-300 border border-[#2a2a2a] transition-all font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
                               <XCircle className="h-4 w-4 text-red-500 drop-shadow-md" /> Recusar
                             </button>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Area Enterprise - Dark Recessed Shape */}
        <div className="px-8 pb-8 pt-2 bg-transparent z-20 shrink-0">
          <div className="bg-[#141414] rounded-[24px] shadow-[inset_0_4px_15px_rgba(0,0,0,0.6),0_2px_5px_rgba(255,255,255,0.02)] border border-[#000] p-1.5">
            
            <div className="bg-[#181818] rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] border border-[#222] overflow-hidden flex flex-col transition-colors focus-within:border-[#333]">
              
              {/* Rich Text Format Bar */}
              <div className="flex items-center gap-1 bg-transparent px-4 py-3">
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><Bold className="h-4 w-4" /></button>
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><Italic className="h-4 w-4" /></button>
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><Strikethrough className="h-4 w-4" /></button>
                <div className="w-px h-5 bg-[#2a2a2a] mx-2" />
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><List className="h-4 w-4" /></button>
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><AlignLeft className="h-4 w-4" /></button>
                <div className="w-px h-5 bg-[#2a2a2a] mx-2" />
                <button className="p-1.5 text-gray-500 hover:text-gray-300 rounded-md transition-colors"><Code className="h-4 w-4" /></button>
              </div>

              {/* Input Textarea */}
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Mensagem em #${activeChannel}`}
                className="w-full bg-transparent border-none focus:outline-none text-gray-300 text-[15px] resize-none px-5 py-2 min-h-[60px] font-medium custom-scrollbar placeholder:text-gray-600"
                rows={1}
              />

              {/* Bottom Toolbar */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-[#141414] hover:bg-[#111] text-gray-400 rounded-full transition-colors flex items-center justify-center border border-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="p-2.5 bg-[#141414] hover:bg-[#111] text-gray-400 rounded-full transition-colors flex items-center justify-center border border-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Spectral Send Button */}
                  <button 
                    className={`relative p-[1px] rounded-full overflow-hidden transition-all group ${message.trim() ? 'opacity-100' : 'opacity-50 grayscale'}`}
                  >
                    <div className={`absolute inset-0 ${spectralGradientRing} group-hover:rotate-180 transition-transform duration-1000`} />
                    <div className="relative bg-[#161616] px-6 py-2.5 rounded-full flex items-center gap-2 border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <span className="font-bold text-sm text-gray-200 tracking-wide drop-shadow-md">Enviar</span>
                      <Send className="h-4 w-4 text-gray-300 drop-shadow-md" />
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Thread Sidebar - Dark Recessed Edition */}
      {showThread && (
        <div className="w-96 bg-[#121212] border-l border-[#000] flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-300 z-30 shadow-[inset_4px_0_20px_rgba(0,0,0,0.6)]">
          <div className="h-[72px] px-8 border-b border-[#1a1a1a] flex items-center justify-between">
            <h3 className="text-gray-200 font-extrabold text-base tracking-tight flex items-center gap-2">
              <Reply className="h-4 w-4 text-gray-500 drop-shadow-md" /> Thread Ativa
            </h3>
            <button onClick={() => setShowThread(false)} className="h-8 w-8 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-[#2a2a2a] shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-8">
            
            {/* Thread Original Message Context */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-b from-green-500/20 to-green-900/20 text-[#00FF00] flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-black/50">AN</div>
              <div className="pt-0.5">
                <span className="text-gray-200 font-extrabold text-[15px] block mb-1">Anderson</span>
                <p className="text-gray-400 text-[15px] leading-relaxed font-light">Equipe, precisamos aprovar o orçamento da nova campanha de ADS urgente para rodar hoje.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative py-2">
               <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent absolute inset-0 top-1/2 w-full" />
               <span className="text-[9px] font-black uppercase text-gray-600 bg-[#121212] px-3 relative z-10 mx-auto tracking-widest">
                 Respostas
               </span>
            </div>

            {/* Thread Replies */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-900/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-black/50">LU</div>
              <div className="pt-0.5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-gray-200 font-extrabold text-[15px]">Lucas</span>
                  <span className="text-[10px] font-bold text-gray-600">11:22</span>
                </div>
                <p className="text-gray-400 text-[15px] leading-relaxed font-light">Já enviei os criativos pra revisão.</p>
              </div>
            </div>
          </div>

          <div className="p-8 pt-4">
            <div className="bg-[#0a0a0a] rounded-2xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-[#1a1a1a] p-1.5">
              <input 
                type="text" 
                placeholder="Responder..." 
                className="w-full bg-[#161616] border border-[#222] rounded-[14px] px-5 py-3 text-[15px] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#444] transition-colors shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
