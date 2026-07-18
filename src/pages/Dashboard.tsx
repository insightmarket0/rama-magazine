import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Plus, TrendingUp, AlertCircle, ShoppingCart, Users, BarChart3, CalendarClock, Wallet } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  InstallmentStatus,
  InstallmentWithRelations,
} from "@/hooks/useInstallments";
import { formatCurrencyBRL, formatNumberBR } from "@/lib/format";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { EmptyState } from "@/components/layout/EmptyState";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";
import { cn } from "@/lib/utils";

const statusLabels: Record<InstallmentStatus, string> = {
  pendente: "Pendente",
  atrasado: "Atrasado",
  pago: "Pago",
};

const getStatusVariant = (status: InstallmentStatus) => {
  switch (status) {
    case "pago":
      return "default";
    case "atrasado":
      return "destructive";
    default:
      return "secondary";
  }
};

const chartConfig = {
  variaveis: {
    label: "Variáveis",
    color: "hsl(var(--chart-1))",
  },
  fixas: {
    label: "Fixas",
    color: "hsl(var(--chart-2))",
  },
};

const renderUpcomingItem = (installment: InstallmentWithRelations) => (
  <div
    key={installment.id}
    className="flex items-center justify-between gap-4 p-4 bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-xl hover:border-white/10 transition-colors group"
  >
    <div className="flex-1">
      <p className="font-medium text-white text-sm tracking-wide">
        {installment.supplier?.name ?? "Fornecedor não informado"}
      </p>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
        Pedido {installment.order?.order_number ?? "-"} •{" "}
        {installment.installment_number === 0
          ? "Entrada"
          : `Parcela ${installment.installment_number}`}
      </p>
    </div>
    <div className="text-right">
      <p className="font-light text-white text-lg tracking-tight">
        {formatCurrencyBRL(installment.value)}
      </p>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
        Vence em {format(parseISO(installment.due_date), "dd/MM")}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboard();

  const metrics = [
    {
      title: "Projeção de Caixa (30 dias)",
      icon: TrendingUp,
      color: "text-secondary",
      value: data ? formatCurrencyBRL(data.metrics.cashProjectionNext30Days) : null,
    },
    {
      title: "Despesas Variáveis (30 dias)",
      icon: Wallet,
      color: "text-accent",
      value: data ? formatCurrencyBRL(data.metrics.upcomingVariable30DaysTotal) : null,
    },
    {
      title: "Despesas Fixas (mês atual)",
      icon: CalendarClock,
      color: "text-primary",
      value: data ? formatCurrencyBRL(data.metrics.recurringMonthlyTotal) : null,
    },
    {
      title: "Parcelas Vencidas",
      icon: AlertCircle,
      color: "text-destructive",
      value: data ? formatNumberBR(data.metrics.overdueCount) : null,
    },
    {
      title: "Pedidos em Aberto",
      icon: ShoppingCart,
      color: "text-muted-foreground",
      value: data ? formatNumberBR(data.metrics.openOrdersCount) : null,
    },
    {
      title: "Fornecedores Ativos",
      icon: Users,
      color: "text-muted-foreground",
      value: data ? formatNumberBR(data.metrics.activeSuppliersCount) : null,
    },
  ];

  const chartData = data?.variableVsFixedChart ?? [];
  const chartHasData = chartData.some((item) => item.variaveis > 0 || item.fixas > 0);

  const insights = useMemo(() => {
    if (!data) return [];

    const items: Array<{
      id: string;
      title: string;
      description: string;
      actionLabel?: string;
      onAction?: () => void;
      tone?: "warning" | "info" | "success";
    }> = [];

    if (data.metrics.overdueCount > 0) {
      items.push({
        id: "overdue",
        title: `${formatNumberBR(data.metrics.overdueCount)} parcela(s) em atraso`,
        description: "Priorize pagamentos atrasados para manter fornecedores confiantes.",
        actionLabel: "Ver contas a pagar",
        onAction: () => navigate("/contas"),
        tone: "warning",
      });
    }

    if (data.metrics.openOrdersCount > 0) {
      items.push({
        id: "orders",
        title: `${formatNumberBR(data.metrics.openOrdersCount)} pedido(s) aguardando avanço`,
        description: "Finalize negociações ou atualize o status dos pedidos em aberto.",
        actionLabel: "Pedidos de compra",
        onAction: () => navigate("/pedidos"),
        tone: "info",
      });
    }

    const nextInstallment = data.upcomingInstallments[0];
    if (nextInstallment) {
      const dueDate = parseISO(nextInstallment.due_date);
      const daysToDue = differenceInCalendarDays(dueDate, new Date());

      if (daysToDue >= 0 && daysToDue <= 7) {
        items.push({
          id: "next-installment",
          title: `Próximo vencimento em ${format(dueDate, "dd/MM")}`,
          description: `Parcela de ${formatCurrencyBRL(nextInstallment.value)} para ${nextInstallment.supplier?.name ?? "fornecedor sem nome"}.`,
          actionLabel: "Organizar pagamento",
          onAction: () => navigate("/contas"),
          tone: "info",
        });
      }
    }

    if (items.length === 0) {
      items.push({
        id: "all-good",
        title: "Fluxo financeiro sob controle",
        description:
          "Sem pendências urgentes no momento. Aproveite para planejar novas compras ou revisar oportunidades de economia.",
        tone: "success",
      });
    }

    return items;
  }, [data, navigate]);

  const insightToneStyles: Record<
    "warning" | "info" | "success",
    { container: string; title: string; description: string; button: string }
  > = {
    warning: {
      container: "bg-red-900/10 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
      title: "text-red-500",
      description: "text-red-400/80",
      button: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
    },
    info: {
      container: "bg-[#111111]/80 backdrop-blur-sm border border-white/10 hover:border-white/20",
      title: "text-white",
      description: "text-gray-400",
      button: "bg-white/5 text-white hover:bg-white/10 border-white/10 text-xs",
    },
    success: {
      container: "bg-emerald-900/10 backdrop-blur-sm border-t border-emerald-500/30 border-x-emerald-500/10 border-b-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:border-emerald-500/40",
      title: "text-[#00FF00]",
      description: "text-emerald-400/80",
      button: "bg-[#00FF00]/10 text-[#00FF00] hover:bg-[#00FF00]/20 border-[#00FF00]/20 text-xs",
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <OnboardingChecklist />
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tight leading-none mb-2">Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide uppercase">
            Visão geral das suas finanças
          </p>
        </div>
        <Button
          className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-bold shadow-[0_0_15px_rgba(0,255,0,0.3)] rounded-lg px-6 transition-all"
          onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Métricas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/10 transition-colors group">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold line-clamp-1">{metric.title}</p>
              <metric.icon className={`h-4 w-4 ${metric.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 bg-white/5" />
              ) : metric.value !== null ? (
                <div className={`text-3xl font-light tracking-tighter ${metric.title.includes('Vencidas') && Number(metric.value) > 0 ? 'text-red-500' : 'text-white'}`}>
                  {metric.value}
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  Erro ao carregar.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prioridades do Dia */}
      <div className="bg-[#111111]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-light text-white tracking-tight mb-1">Prioridades do dia</h2>
          <p className="text-gray-500 text-sm font-medium">
            Foque nas ações que mantêm o caixa saudável e o relacionamento com fornecedores em dia.
          </p>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : insights.length > 0 ? (
            insights.map((insight) => {
              const tone = insight.tone ?? "info";
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl p-5 md:flex-row md:items-center md:justify-between transition-colors",
                    insightToneStyles[tone].container,
                  )}
                >
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "font-medium text-base tracking-wide flex items-center gap-2",
                        insightToneStyles[tone].title,
                      )}
                    >
                      {tone === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" />}
                      {tone === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      {insight.title}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        insightToneStyles[tone].description,
                      )}
                    >
                      {insight.description}
                    </p>
                  </div>
                  {insight.onAction ? (
                    <Button size="sm" className={cn("font-bold border tracking-wide", insightToneStyles[tone].button)} onClick={insight.onAction}>
                      {insight.actionLabel ?? "Ver detalhes"}
                    </Button>
                  ) : null}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">
              Não foi possível carregar as prioridades agora. Atualize a página ou tente novamente mais tarde.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-light text-white tracking-tight">Variáveis vs Fixas (Próximas Semanas)</h2>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-64 w-full bg-white/5 rounded-xl" />
            ) : chartHasData ? (
              <>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={80}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        }).format(value as number)
                      }
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload.range ?? ""
                          }
                          formatter={(value, seriesKey) => [
                            formatCurrencyBRL(value as number),
                            seriesKey === "variaveis" ? "Variáveis" : "Fixas",
                          ]}
                        />
                      }
                    />
                    <ChartLegend
                      content={<ChartLegendContent />}
                      wrapperStyle={{ paddingTop: 12 }}
                    />
                    <Bar
                      dataKey="variaveis"
                      fill="var(--color-variaveis)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="fixas"
                      fill="var(--color-fixas)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </>
            ) : (
              <EmptyState
                className="h-64"
                icon={<BarChart3 className="h-6 w-6" />}
                title="Sem valores previstos"
                description="Cadastre pedidos ou contas fixas para ver projeções aqui."
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar pedido
                  </Button>
                }
              />
            )}
          </div>
        </div>
        {/* Próximos Vencimentos */}
        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-light text-white tracking-tight">Próximos Vencimentos</h2>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : data && data.upcomingInstallments.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingInstallments.map(renderUpcomingItem)}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarClock className="h-6 w-6" />}
                title="Sem vencimentos próximos"
                description="As parcelas aparecerão aqui quando estiverem próximas do vencimento."
              />
            )}
          </div>
        </div>
      </div>

      {isError ? (
        <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-md p-4 text-sm">
          Ocorreu um erro ao carregar os dados.{" "}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => refetch()}
          >
            Tentar novamente
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
