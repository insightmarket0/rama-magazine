import {
    Bar,
    ComposedChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { useMarketplaces } from "@/hooks/useMarketplaces";

interface RevenueChartProps {
    data: MonthlyClosing[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    const { marketplaces } = useMarketplaces();

    // Sort data by month to ensure correct order
    const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartData = sortedData.map((item) => {
        const [year, month] = item.month.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = date.toLocaleString("pt-BR", { month: "short" });
        const capitalizedMonth =
            monthName.charAt(0).toUpperCase() + monthName.slice(1);

        // Create base object with common props
        const dataPoint: any = {
            name: capitalizedMonth,
            total: item.total,
            fullDate: item.month,
            netProfit: item.netProfit || 0,
        };

        // Add individual marketplace revenues
        marketplaces.forEach(m => {
            dataPoint[m.id] = Number(item.revenues?.[m.id] || 0);
        });

        return dataPoint;
    });

    return (
        <Card className="col-span-4 bg-[#111111] border border-white/5 shadow-2xl rounded-2xl p-2 transition-all hover:border-white/10 group relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#00FF00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="px-6 pt-6">
                <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-6 pb-6">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorMeli" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorShopee" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorAmazon" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorMagalu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.4} />
                            <XAxis
                                dataKey="name"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$ ${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        // Calculate total only from marketplace entries (ignore netProfit)
                                        const total = payload
                                            .filter(p => p.dataKey !== 'netProfit')
                                            .reduce((acc: number, entry: any) => acc + (Number(entry.value) || 0), 0);

                                        const netProfitEntry = payload.find(p => p.dataKey === 'netProfit');

                                        return (
                                            <div className="rounded-xl border border-[#333] bg-[#121212] p-4 shadow-2xl min-w-[220px]">
                                                <div className="mb-2 border-b border-[#333] pb-2">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-2xl font-bold text-white">
                                                            {formatCurrency(total)}
                                                        </p>
                                                        <span className="text-xs text-gray-500 mb-1">Bruto</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 mb-3">
                                                    {payload
                                                        .filter(p => p.dataKey !== 'netProfit')
                                                        .map((entry: any, index: number) => {
                                                        const market = marketplaces.find(m => m.id === entry.dataKey);
                                                        const Icon = market?.icon;

                                                        return (
                                                            <div key={index} className="flex items-center justify-between text-xs">
                                                                <div className="flex items-center gap-2">
                                                                    {Icon ? (
                                                                        <Icon className="h-3 w-3" style={{ color: entry.color }} />
                                                                    ) : (
                                                                        <div
                                                                            className="h-2.5 w-2.5 rounded-full"
                                                                            style={{ backgroundColor: entry.color }}
                                                                        />
                                                                    )}
                                                                    <span className="text-gray-300">
                                                                        {entry.name}
                                                                    </span>
                                                                </div>
                                                                <span className="font-medium text-white">
                                                                    {formatCurrency(entry.value as number)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                {netProfitEntry && (
                                                    <div className="pt-2 border-t border-[#00FF00]/20 bg-[#00FF00]/5 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-[#00FF00] uppercase tracking-widest">Lucro Líquido</span>
                                                            <span className="text-sm font-bold text-[#00FF00]">
                                                                {formatCurrency(netProfitEntry.value as number)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {marketplaces.map((market, index) => (
                                <Bar
                                    key={market.id}
                                    dataKey={market.id}
                                    name={market.label}
                                    stackId="a"
                                    fill={market.color}
                                    radius={index === marketplaces.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                                    maxBarSize={60}
                                />
                            ))}
                            
                            <Line
                                type="monotone"
                                dataKey="netProfit"
                                name="Lucro Líquido"
                                stroke="#00FF00"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#111111", stroke: "#00FF00", strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: "#00FF00", stroke: "#fff", strokeWidth: 2 }}
                                style={{ filter: "drop-shadow(0px 0px 8px rgba(0,255,0,0.5))" }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
