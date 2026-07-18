export interface MonthlyClosing {
  id: string;
  month: string; // "YYYY-MM"
  revenues: Record<string, number>; // marketplace_id -> value
  netProfit?: number; // Total net profit/repasse for the month
  total: number;
}

export interface DashboardStats {
  totalYear: number;
  monthlyAverage: number;
  bestChannel: {
    name: string;
    value: number;
  };
  bestMonth: {
    month: string;
    value: number;
  };
}
