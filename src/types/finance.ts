export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'academics'
  | 'essentials'
  | 'subscriptions'
  | 'entertainment'
  | 'rent_utilities'
  | 'savings'
  | 'income';

export type TransactionType = 'expense' | 'income' | 'commitment';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  day: number; // 1 to 30
  dateStr: string;
  isEssential: boolean;
  isPaid: boolean; // Relevant for commitments
  isDemo: boolean;
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDay: number; // 1 to 30
  category: TransactionCategory;
  isActive: boolean;
  isEssential: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDay: number;
  description?: string;
}

export type RiskLevel = 'STABLE' | 'CAUTION' | 'AT_RISK';

export interface RiskAnalysis {
  level: RiskLevel;
  score: number; // 0 to 100
  title: string;
  reasons: string[];
  runwayDays: number;
  emergencyBuffer: number;
}

export interface CalculatedMetrics {
  startingBudget: number;
  totalIncome: number;
  totalPaidExpenses: number;
  currentCashBalance: number;
  totalUnpaidCommitments: number;
  spendableBalance: number;
  remainingDays: number;
  safeDailyAllowance: number;
  forecastedMonthEndBalance: number;
  totalActiveSubscriptions: number;
  totalSavingsAllocated: number;
  risk: RiskAnalysis;
}

export interface SimulationProposal {
  amount: number;
  category: TransactionCategory;
  title: string;
  day: number;
  isEssential: boolean;
}

export interface SimulationAlternative {
  id: string;
  title: string;
  description: string;
  amount: number;
  dailyAllowance: number;
  monthEndForecast: number;
  riskLevel: RiskLevel;
}

export interface SimulationResult {
  proposal: SimulationProposal;
  baseline: CalculatedMetrics;
  simulated: CalculatedMetrics;
  balanceBefore: number;
  balanceAfter: number;
  allowanceBefore: number;
  allowanceAfter: number;
  forecastBefore: number;
  forecastAfter: number;
  isAffordable: boolean;
  shortfall: number;
  riskChanged: boolean;
  warnings: string[];
  alternatives: SimulationAlternative[];
}

export interface StressScenario {
  id: string;
  title: string;
  amount: number;
  category: TransactionCategory;
  description: string;
}
