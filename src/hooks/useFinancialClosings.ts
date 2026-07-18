import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MonthlyClosing } from "@/types/finance";
import { toast } from "sonner";

interface FinancialClosingRow {
    id: string;
    user_id: string;
    month: string;
    revenues: Record<string, number>; // JSONB
    created_at: string;
}

export const useFinancialClosings = () => {
    const queryClient = useQueryClient();

    const fetchClosings = async (): Promise<MonthlyClosing[]> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const { data, error } = await supabase
            .from("financial_closings")
            .select("*")
            .eq("user_id", user.id)
            .order("month", { ascending: true });

        if (error) {
            console.error("Error fetching closings:", error);
            throw error;
        }

        return (data as any[]).map((row: FinancialClosingRow) => {
            const cleanRevenues = { ...row.revenues };
            const netProfit = cleanRevenues['_net_profit'] || 0;
            delete cleanRevenues['_net_profit'];

            // Calculate total only from actual marketplace revenues
            const total = Object.values(cleanRevenues).reduce((sum, val) => sum + (Number(val) || 0), 0);

            return {
                id: row.id,
                month: row.month,
                revenues: cleanRevenues,
                netProfit,
                total,
            };
        });
    };

    const { data: closings = [], isLoading } = useQuery({
        queryKey: ["financial_closings"],
        queryFn: fetchClosings,
    });

    const createClosing = useMutation({
        mutationFn: async (newClosing: Omit<MonthlyClosing, "id" | "total">) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado");

            const dbRevenues = { ...newClosing.revenues, _net_profit: newClosing.netProfit || 0 };

            const { error } = await supabase.from("financial_closings").insert({
                user_id: user.id,
                month: newClosing.month,
                revenues: dbRevenues, // Insert JSONB directly
            });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["financial_closings"] });
            toast.success("Fechamento registrado com sucesso!");
        },
        onError: (error: any) => {
            if (error.code === "23505") {
                toast.error("Já existe um fechamento para este mês.");
            } else {
                toast.error("Erro ao salvar fechamento.");
            }
        },
    });

    const deleteClosing = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("financial_closings")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["financial_closings"] });
            toast.success("Fechamento removido com sucesso.");
        },
        onError: () => {
            toast.error("Erro ao remover fechamento.");
        },
    });

    const updateClosing = useMutation({
        mutationFn: async (data: MonthlyClosing) => {
            const dbRevenues = { ...data.revenues, _net_profit: data.netProfit || 0 };

            const { error } = await supabase
                .from("financial_closings")
                .update({
                    month: data.month,
                    revenues: dbRevenues,
                } as any)
                .eq("id", data.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["financial_closings"] });
            toast.success("Fechamento atualizado com sucesso.");
        },
        onError: () => {
            toast.error("Erro ao atualizar fechamento.");
        },
    });

    return {
        closings,
        isLoading,
        createClosing,
        deleteClosing,
        updateClosing,
    };
};
