import React, { useState } from "react";
import { 
  MessageCircle, 
  X, 
  Mic, 
  Paperclip, 
  Send,
  MoreVertical,
  Hash,
  User,
  Package,
  FileText
} from "lucide-react";

const CHANNELS = [
  { id: "c1", name: "geral", unread: 0 },
  { id: "c2", name: "urgencias", unread: 2 },
  { id: "c3", name: "logistica", unread: 0 },
];

const DIRECT_MESSAGES = [
  { id: "u1", name: "Lucas", unread: 0, online: true },
  { id: "u2", name: "João", unread: 1, online: false },
  { id: "u3", name: "Diretoria", unread: 0, online: true },
];

const MOCK_MESSAGES = [
  { id: 1, sender: "Lucas", text: "Já separei as caixas do ML, o caminhão chega às 14h?", time: "11:20", isMe: false },
  { id: 2, sender: "Você", text: "Sim, confirme se os kits de gás já estão embalados.", time: "11:22", isMe: true },
  { id: 3, sender: "Lucas", text: "Tudo certo. Estou indo pro horário de almoço agora.", time: "11:25", isMe: false },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("Lucas");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  return (
    <>
      {/* Botão Flutuante (Fechado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center transition-all hover:scale-110 z-50 animate-in zoom-in duration-300"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Badge de Não Lidas */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#111315]">
            3
          </span>
        </button>
      )}

      {/* Painel do Chat Aberto */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[800px] h-[600px] bg-[#111315]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden z-50 animate-in slide-in-from-bottom-8 duration-300">
          
          {/* Sidebar Esquerda (Canais e DMs) */}
          <div className="w-64 bg-[#1A1D21]/50 border-r border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold">Rama Chat</h3>
              <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-6">
              {/* Canais */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Canais</h4>
                <div className="space-y-1">
                  {CHANNELS.map(c => (
                    <button key={c.id} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors group">
                      <span className="flex items-center gap-2 text-sm">
                        <Hash className="h-3.5 w-3.5 opacity-50" />
                        {c.name}
                      </span>
                      {c.unread > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">{c.unread}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensagens Diretas */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Equipe</h4>
                <div className="space-y-1">
                  {DIRECT_MESSAGES.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => setActiveChat(u.name)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
                        activeChat === u.name ? 'bg-primary/10 text-white' : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <div className="relative">
                          <User className="h-3.5 w-3.5 opacity-50" />
                          {u.online && <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-[#1A1D21]" />}
                        </div>
                        {u.name}
                      </span>
                      {u.unread > 0 && <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">{u.unread}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Área de Conversa Direita */}
          <div className="flex-1 flex flex-col bg-[#0A0B0C]">
            {/* Header da Conversa */}
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-[#111315]/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                  {activeChat.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold leading-none">{activeChat}</h3>
                  <span className="text-[10px] text-green-400 font-medium">Online no sistema</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Feed de Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex justify-center mb-6">
                <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">Hoje</span>
              </div>
              
              {MOCK_MESSAGES.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!msg.isMe && (
                      <div className="h-6 w-6 shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-[10px] font-bold border border-blue-500/30 mb-1">
                        {msg.sender.substring(0,2).toUpperCase()}
                      </div>
                    )}
                    
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.isMe 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-[#1A1D21] text-gray-200 border border-white/5 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 mx-8">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Área */}
            <div className="p-4 bg-[#111315]/50 border-t border-white/5">
              {showAttachMenu && (
                <div className="absolute bottom-20 left-72 bg-[#1A1D21] border border-white/10 rounded-xl p-2 shadow-xl flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors w-20">
                    <Package className="h-5 w-5 text-orange-400" />
                    <span className="text-[10px] font-medium">Anexar SKU</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors w-20">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span className="text-[10px] font-medium">Playbook</span>
                  </button>
                </div>
              )}
              
              <div className="flex items-end gap-2 bg-[#1A1D21] p-1.5 rounded-xl border border-white/10 focus-within:border-primary/50 transition-colors shadow-inner">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={`p-2.5 rounded-lg transition-colors ${showAttachMenu ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  title="Anexar dados do sistema (Smart Tags)"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Envie uma mensagem..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm resize-none py-3 px-2 max-h-32 min-h-[44px]"
                  rows={1}
                />
                
                {message.trim() ? (
                  <button className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg">
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    className={`p-2.5 rounded-lg transition-colors shadow-inner flex items-center gap-2 ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    onClick={() => setIsRecording(!isRecording)}
                    title="Gravar Áudio Rápido (Walkie-Talkie)"
                  >
                    <Mic className="h-5 w-5" />
                    {isRecording && <span className="text-xs font-bold mr-1">Gravando...</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
