import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/finance";
import { DollarSign, TrendingUp, Trophy, Calendar } from "lucide-react";
import { MARKETPLACES } from "@/config/marketplaces";

interface FinancialStatsProps {
    stats: DashboardStats;
}

export const FinancialStats = ({ stats }: FinancialStatsProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const cardClass = "bg-[#111111] border border-white/5 shadow-2xl rounded-2xl overflow-hidden relative p-5 transition-all hover:border-white/10 group";
    const accentLine = "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00FF00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity";

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Faturamento Total */}
            <Card className={cardClass}>
                <div className={accentLine} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10 px-0 pt-0">
                    <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faturamento Total (Ano)</CardTitle>
                    <DollarSign className="h-5 w-5 text-[#00FF00]" />
                </CardHeader>
                <CardContent className="relative z-10 px-0 pb-0">
                    <div className="text-4xl md:text-5xl font-light text-white tracking-tighter leading-none mb-3">{formatCurrency(stats.totalYear)}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">+12% YoY</span>
                    </div>
                </CardContent>
            </Card>

            {/* Média Mensal */}
            <Card className={cardClass}>
                <div className={accentLine} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10 px-0 pt-0">
                    <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Média Mensal</CardTitle>
                    <TrendingUp className="h-5 w-5 text-[#00FF00]" />
                </CardHeader>
                <CardContent className="relative z-10 px-0 pb-0">
                    <div className="text-4xl md:text-5xl font-light text-white tracking-tighter leading-none mb-3">{formatCurrency(stats.monthlyAverage)}</div>
                </CardContent>
            </Card>

            {/* Melhor Canal */}
            <Card className={cardClass}>
                <div className={accentLine} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10 px-0 pt-0">
                    <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Melhor Canal</CardTitle>
                    <Trophy className="h-5 w-5 text-[#00FF00]" />
                </CardHeader>
                <CardContent className="relative z-10 px-0 pb-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl font-light text-white capitalize truncate leading-none" title={stats.bestChannel.name}>
                            {stats.bestChannel.name}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        <span className="text-[#00FF00] font-bold">{formatCurrency(stats.bestChannel.value)}</span> de receita
                    </p>
                </CardContent>
            </Card>

            {/* Melhor Mês */}
            <Card className={cardClass}>
                <div className={accentLine} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10 px-0 pt-0">
                    <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Melhor Mês</CardTitle>
                    <Calendar className="h-5 w-5 text-[#00FF00]" />
                </CardHeader>
                <CardContent className="relative z-10 px-0 pb-0">
                    <div className="text-4xl md:text-5xl font-light text-white capitalize leading-none mb-3">{stats.bestMonth.month}</div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        <span className="text-[#00FF00] font-bold">{formatCurrency(stats.bestMonth.value)}</span> neste mês
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
