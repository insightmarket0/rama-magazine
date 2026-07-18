import React, { useState } from "react";
import { 
  Megaphone,
  Pin,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Plus
} from "lucide-react";
import { InternalAnnouncement } from "@/integrations/supabase/internal_announcements";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const MOCK_ANNOUNCEMENTS: InternalAnnouncement[] = [
  {
    id: "1",
    creator_id: "user_manager",
    title: "Padrão de Imagens - Kits de Gás",
    content: "Atenção nas fotos dos kits de gás: verifiquem as imagens do fornecedor antes de subir. Se o kit é de apenas uma abraçadeira, a foto não pode ter duas abraçadeiras. Corrijam a imagem antes de publicar.",
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
    creator: { full_name: "Anderson • Estratégia", avatar_url: "" },
    acknowledgments: [
      { id: "ack_1", announcement_id: "1", user_id: "user_operacao_1", acknowledged_at: new Date().toISOString(), user: { full_name: "Carlos • Operação", avatar_url: "" } }
    ]
  },
  {
    id: "2",
    creator_id: "user_chefe",
    title: "Cuidado com Marcas Não Autorizadas",
    content: "Aviso geral: muita atenção ao clonar anúncios da Shopee. Lembrem sempre de retirar a marca do título e da descrição para evitar bloqueios e perda do anúncio.",
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
    creator: { full_name: "Lívia • Direção", avatar_url: "" },
    acknowledgments: []
  }
];

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split("•")[0].trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function MuralAlinhamento() {
  const [announcements, setAnnouncements] = useState<InternalAnnouncement[]>(MOCK_ANNOUNCEMENTS);
  // Simula o ID do usuário logado (ex: um operador)
  const CURRENT_USER_ID = "user_operacao_2"; 

  const handleAcknowledge = (id: string) => {
    // Na vida real: await acknowledgeAnnouncement(id, userId)
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        // Simula adicionar o usuário atual nos cientes
        const newAck = {
          id: `ack_temp_${Date.now()}`,
          announcement_id: id,
          user_id: CURRENT_USER_ID,
          acknowledged_at: new Date().toISOString(),
          user: { full_name: "Você (Operador 2)", avatar_url: "" }
        };
        return { ...a, acknowledgments: [...(a.acknowledgments || []), newAck] };
      }
      return a;
    }));
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-light tracking-tight text-white flex items-center gap-4">
            <Megaphone className="h-10 w-10 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Mural de Alinhamento
          </h2>
          <p className="text-gray-400 mt-2 font-medium tracking-wide">
            Feed oficial de avisos, processos e prevenção de erros.
          </p>
        </div>
        
        {/* Este botão apareceria apenas para Gestores/Admins */}
        <button className="flex items-center justify-center gap-2 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          <Plus className="h-4 w-4" strokeWidth={3} />
          Novo Aviso
        </button>
      </div>

      <div className="columns-1 xl:columns-2 gap-8">
        {announcements.map((announcement) => {
          const hasAcknowledged = announcement.acknowledgments?.some(ack => ack.user_id === CURRENT_USER_ID);
          const isPinned = announcement.is_pinned;

          return (
            <div 
              key={announcement.id} 
              className={`inline-block w-full mb-8 break-inside-avoid bg-[#0a0a0a]/90 backdrop-blur-2xl border rounded-3xl p-8 shadow-2xl transition-all ${
                isPinned ? 'border-[#00FF00]/30 shadow-[0_0_20px_rgba(0,255,0,0.05)]' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white font-bold text-lg shadow-inner">
                    {getInitials(announcement.creator?.full_name)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base tracking-wide">
                      {announcement.creator?.full_name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(announcement.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                {isPinned && (
                  <span className="px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-bold bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <Pin className="h-3.5 w-3.5" />
                    Aviso Importante
                  </span>
                )}
              </div>

              <div className="mb-8">
                <h3 className={`text-2xl font-light tracking-tight mb-4 flex items-center gap-3 ${isPinned ? 'text-white' : 'text-gray-200'}`}>
                  {isPinned && <AlertTriangle className="h-6 w-6 text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]" />}
                  {announcement.title}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {announcement.content}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                
                <div className="flex -space-x-3 overflow-hidden items-center">
                  {announcement.acknowledgments?.map((ack) => (
                    <div 
                      key={ack.id} 
                      className="inline-flex h-10 w-10 rounded-full ring-4 ring-[#0a0a0a] bg-[#00FF00]/20 items-center justify-center border border-[#00FF00]/30 text-[#00FF00] text-xs font-bold shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                      title={`${ack.user?.full_name} leu em ${format(parseISO(ack.acknowledged_at), "dd/MM HH:mm")}`}
                    >
                      {getInitials(ack.user?.full_name)}
                    </div>
                  ))}
                  {(!announcement.acknowledgments || announcement.acknowledgments.length === 0) && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 pl-2">Ninguém confirmou leitura.</span>
                  )}
                  {announcement.acknowledgments && announcement.acknowledgments.length > 0 && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 pl-5 my-auto">
                      {announcement.acknowledgments.length} {announcement.acknowledgments.length === 1 ? 'Ciente' : 'Cientes'}
                    </span>
                  )}
                </div>

                {hasAcknowledged ? (
                  <div className="flex items-center gap-2 text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-5 py-2.5 rounded-xl border border-[#00FF00]/20 shadow-[0_0_10px_rgba(0,255,0,0.05)]">
                    <CheckCircle2 className="h-5 w-5 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
                    Você está ciente
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAcknowledge(announcement.id)}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-transparent text-gray-400 border border-white/10 hover:bg-[#00FF00] hover:border-[#00FF00] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] group"
                  >
                    <CheckCircle2 className="h-5 w-5 group-hover:text-black text-gray-400 transition-colors" />
                    Estou Ciente
                  </button>
                )}
                
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
