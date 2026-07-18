import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Folder, 
  FileText, 
  X,
  ChevronRight,
  Package,
  MessageSquare,
  Store,
  Wrench,
  Clock,
  Printer,
  Share2
} from "lucide-react";

// ---- MOCK DATA ----
const CATEGORIES = [
  { id: "logistica", name: "Logística & Embalagem", icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "atendimento", name: "Atendimento ao Cliente", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "marketplaces", name: "Marketplaces (Cadastros)", icon: Store, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "resolucao", name: "Resolução de Problemas", icon: Wrench, color: "text-rose-400", bg: "bg-rose-400/10" },
];

const ARTICLES = [
  {
    id: "art_1",
    categoryId: "marketplaces",
    title: "Padrão de Títulos e Fotos - Shopee",
    author: "Anderson",
    lastUpdated: "Há 2 dias",
    content: `
## Diretrizes para Títulos na Shopee
Os títulos dos nossos produtos na Shopee precisam seguir uma estrutura exata para otimizar as buscas e evitar punições do algoritmo.

### Estrutura Obrigatória:
**[Produto] + [Marca] + [Característica Principal] + [Quantidade/Voltagem]**

*Correto:* Kit de Gás Aliança Completo com Mangueira 1,20m
*Incorreto:* Lindo kit de gás barato promoção

### Imagens do Produto:
1. **Fundo 100% Branco** na primeira foto (obrigatório, gera banimento se tiver fundo poluído).
2. Não adicione textos promocionais ou marcas d'água gigantes na primeira imagem.
3. As fotos 2, 3 e 4 devem ser o produto em uso (contexto) e os detalhes técnicos.

Se tiver dúvidas com a imagem, suba no sistema de *Mural de Ajustes* e peça avaliação da coordenação antes de publicar o anúncio.
    `
  },
  {
    id: "art_2",
    categoryId: "resolucao",
    title: "Como contestar devolução injusta (Mercado Livre)",
    author: "Estratégia",
    lastUpdated: "Há 1 semana",
    content: `
## Passo a Passo para Contestar Devoluções no ML

Quando o cliente devolver um produto avariado ou com peça faltando, siga este script *no mesmo dia*:

1. Tire 3 fotos nítidas assim que abrir a caixa:
   - A etiqueta de devolução dos Correios/Transportadora.
   - A caixa recebida (mostrando as fitas rompidas).
   - O produto avariado em detalhes.

2. Abra a mediação no Mercado Livre informando que o produto retornou fora do padrão.

3. **Texto Padrão para a Mediação:**
   "Olá equipe do Mercado Livre. O pacote referente à venda #XXXX retornou para nós no dia de hoje, porém o produto foi devolvido [sem a peça X / quebrado na lateral]. Anexamos as imagens que comprovam o estado que a caixa chegou. Solicitamos o reembolso da venda conforme a política de Proteção ao Vendedor."

**Atenção:** Você tem no máximo 3 dias corridos para abrir essa reclamação. Passou disso, a empresa perde o dinheiro. Fique atento ao Mural de Ajustes!
    `
  },
  {
    id: "art_3",
    categoryId: "logistica",
    title: "Procedimento: Embalagem de Kits Frágeis",
    author: "Lucas",
    lastUpdated: "Há 1 mês",
    content: "Instruções de embalagem pendentes de revisão..."
  },
  {
    id: "art_4",
    categoryId: "atendimento",
    title: "Script para clientes atrasados",
    author: "Anderson",
    lastUpdated: "Há 2 semanas",
    content: "Scripts de atendimento ao cliente..."
  }
];
// -------------------

export default function Playbooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<typeof ARTICLES[0] | null>(null);

  // Filtros
  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? art.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full relative">
      
      {/* Header Centralizado - Estilo Central de Ajuda */}
      <div className="flex flex-col items-center justify-center mb-12 mt-4 text-center">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
          Como podemos te ajudar hoje?
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Nossa base de conhecimento oficial. Guias, processos e manuais para garantir a qualidade de ponta a ponta na nossa operação.
        </p>
        
        {/* Barra de Busca Gigante */}
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ex: Como contestar devolução no ML..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#111315]/80 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg shadow-xl transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Esquerda (Categorias) */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Categorias</h3>
          
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              selectedCategory === null 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Folder className="h-4 w-4" />
            Todos os Manuais
          </button>

          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-md ${cat.bg} ${cat.color}`}>
                  <cat.icon className="h-3.5 w-3.5" />
                </div>
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Lista de Artigos */}
        <div className="lg:col-span-3">
          <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg min-h-[400px]">
            <h3 className="text-lg font-bold text-white mb-6">
              {selectedCategory 
                ? CATEGORIES.find(c => c.id === selectedCategory)?.name 
                : "Todos os Manuais Disponíveis"}
            </h3>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum manual encontrado para esta busca.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredArticles.map(art => {
                  const cat = CATEGORIES.find(c => c.id === art.categoryId);
                  const colorClass = cat?.color.replace('text-', 'border-') || 'border-white/5';
                  
                  return (
                    <button 
                      key={art.id}
                      onClick={() => setActiveArticle(art)}
                      className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border hover:border-white/20 bg-[#1A1D21]/50 hover:bg-[#1A1D21] transition-all duration-300 group text-left shadow-sm hover:shadow-xl hover:-translate-y-1 border-l-4 ${colorClass}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 mt-1 sm:mt-0 ${cat?.bg} ${cat?.color} shadow-inner`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat?.bg} ${cat?.color}`}>
                              {cat?.name}
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-lg mb-1.5 group-hover:text-primary transition-colors">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Atualizado {art.lastUpdated}
                            </span>
                            <span>•</span>
                            <span>Por {art.author}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 hidden sm:flex items-center text-gray-500 group-hover:text-primary transition-colors bg-white/5 p-2 rounded-full group-hover:bg-primary/10">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE LEITURA (Painel Lateral / Drawer) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay escuro */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveArticle(null)}
          />
          
          {/* Painel que desliza da direita */}
          <div className="relative w-full max-w-3xl bg-[#111315] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Cabecalho do Leitor */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1A1D21]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/30 shadow-inner">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white line-clamp-1">{activeArticle.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">Escrito por <span className="text-gray-300">{activeArticle.author}</span> • {activeArticle.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Imprimir (Em breve)">
                  <Printer className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Copiar Link">
                  <Share2 className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Conteudo (Renderização simulada de Markdown) */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[#111315]">
              <div className="prose prose-invert prose-p:text-gray-300 prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-a:text-primary max-w-none font-sans">
                {/* 
                  Neste mock, renderizamos o texto manualmente com tratamento básico 
                  para simular um parser Markdown
                */}
                {activeArticle.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-bold mt-10 mb-6 pb-2 border-b border-white/5 tracking-tight">{paragraph.replace('## ', '')}</h2>
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-200">{paragraph.replace('### ', '')}</h3>
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-6 mb-3 text-gray-300 text-lg list-disc pl-2 marker:text-primary">{paragraph.substring(3)}</li>
                  }
                  if (paragraph.trim() === '') return <div key={index} className="h-4" />
                  
                  // Simple bold parsing
                  const parts = paragraph.split('**');
                  return (
                    <p key={index} className="mb-6 leading-relaxed text-gray-300">
                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
                    </p>
                  );
                })}
              </div>

              <div className="mt-12 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-4">
                <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary font-bold text-sm mb-1">Este manual resolveu sua dúvida?</h4>
                  <p className="text-xs text-gray-400">A operação atualiza estes guias regularmente. Siga sempre o procedimento mais recente.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
