import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { Trash2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { useAuth } from "@/hooks/useAuth";

interface RecentClosingsTableProps {
    data: MonthlyClosing[];
    onDelete: (id: string) => void;
    onEdit: (closing: MonthlyClosing) => void;
}

export const RecentClosingsTable = ({
    data,
    onDelete,
    onEdit,
}: RecentClosingsTableProps) => {
    const { marketplaces } = useMarketplaces();
    const { user } = useAuth();
    const isAdmin = user?.email === "livia@hotmail.com";

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const sortedData = [...data].sort((a, b) => b.month.localeCompare(a.month));

    return (
        <Card className="bg-[#111111] border border-white/5 shadow-2xl rounded-2xl overflow-hidden relative">
            <CardHeader className="border-b border-white/5 px-6 pt-6 pb-4">
                <CardTitle className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0">Lançamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-gray-400 font-medium w-[120px]">Mês/Ano</TableHead>
                            {/* Dynamic Headers */}
                            {marketplaces.map(m => (
                                <TableHead key={m.id} className="text-right text-gray-400 font-medium">{m.label}</TableHead>
                            ))}
                            <TableHead className="text-right text-[#00FF00] font-bold uppercase text-[10px] tracking-wider">Lucro Líquido</TableHead>
                            <TableHead className="text-right text-[#00FF00] font-bold uppercase text-[10px] tracking-wider">Total Geral</TableHead>
                            <TableHead className="text-right text-gray-500 uppercase text-[10px] tracking-wider">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow key={row.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-medium text-white capitalize">
                                    {format(parseISO(row.month + "-01"), "MMMM/yyyy", {
                                        locale: ptBR,
                                    })}
                                </TableCell>
                                {marketplaces.map(market => (
                                    <TableCell key={`td-${row.id}-${market.id}`} className="text-right text-gray-300">
                                        {formatCurrency(Number(row.revenues?.[market.id] || 0))}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right text-[#00FF00] font-bold bg-[#00FF00]/10">
                                    {formatCurrency(row.netProfit || 0)}
                                </TableCell>
                                <TableCell className="text-right text-[#00FF00] font-extrabold bg-[#00FF00]/5">
                                    {formatCurrency(row.total)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isAdmin && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(row)}
                                                className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(row.id)}
                                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedData.length === 0 && (
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableCell colSpan={marketplaces.length + 4} className="h-24 text-center text-gray-500">
                                    Nenhum fechamento registrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
