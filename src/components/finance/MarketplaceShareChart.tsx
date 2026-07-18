import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { useMemo } from "react";

interface MarketplaceShareChartProps {
    data: MonthlyClosing[];
}

export const MarketplaceShareChart = ({ data }: MarketplaceShareChartProps) => {
    const { marketplaces } = useMarketplaces();

    const chartData = useMemo(() => {
        // Aggregate totals by marketplace dynamic keys
        const totals: Record<string, number> = {};
        let totalAll = 0;

        data.forEach(closing => {
            Object.entries(closing.revenues || {}).forEach(([shopId, value]) => {
                const amount = Number(value) || 0;
                totals[shopId] = (totals[shopId] || 0) + amount;
                totalAll += amount;
            });
        });

        return {
            data: marketplaces.map(market => ({
                name: market.label,
                id: market.id, // we need id for pastel mapping
                value: totals[market.id] || 0,
                color: market.color
            })).filter(item => item.value > 0),
            totalAll
        };
    }, [data, marketplaces]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTooltip = (value: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    };

    // Mapeamento de cores pastel para a rosca
    const pastelColors: Record<string, string> = {
        mercadolivre: "#FDE047", // Yellow 300
        shopee: "#FB923C", // Orange 400
        amazon: "#7DD3FC", // Sky 300
        magalu: "#60A5FA", // Blue 400
    };

    return (
        <Card className="col-span-3 bg-[#111111] border border-white/5 shadow-2xl rounded-2xl p-2 transition-all hover:border-white/10 group relative overflow-hidden">
            <CardHeader className="px-6 pt-6">
                <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Share por Marketplace</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    const market = marketplaces.find(m => m.label === chartData.data[index].name);
                                    const Icon = market?.icon;

                                    if (percent < 0.01) return null;

                                    return (
                                        <g>
                                            <foreignObject x={x - 20} y={y - 12} width={40} height={24}>
                                                <div className="flex items-center justify-center gap-1 bg-[#121212]/80 backdrop-blur-sm rounded-md border border-white/10 px-1 py-0.5 shadow-sm">
                                                    {Icon && <Icon className="h-3 w-3" style={{ color: chartData.data[index].color }} />}
                                                    <span className="text-[10px] font-bold text-white">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </span>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                }}
                            >
                                {chartData.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pastelColors[entry.id as string] || entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatTooltip(value)}
                                contentStyle={{
                                    backgroundColor: "#1C1C1E",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    color: "#E5E7EB"
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-gray-300 font-medium ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total</span>
                        <span className="text-2xl font-bold text-white">
                            {formatCurrency(chartData.totalAll)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
