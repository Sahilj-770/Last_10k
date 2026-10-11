import type {
  Transaction,
  Subscription,
  SavingsGoal,
  CalculatedMetrics,
  RiskAnalysis,
  RiskLevel,
  SimulationProposal,
  SimulationResult,
  SimulationAlternative,
  TransactionCategory,
} from '../types/finance';

// Formatter for Indian Rupees (₹)
export function formatINR(amount: number, hideDecimals = true): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: hideDecimals ? 0 : 2,
    minimumFractionDigits: hideDecimals ? 0 : 2,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export const CATEGORY_META: Record<
  TransactionCategory,
  { label: string; iconName: string; color: string; isDiscretionaryDefault: boolean }
> = {
  food: { label: 'Food & Canteen', iconName: 'Utensils', color: '#f59e0b', isDiscretionaryDefault: false },
  transport: { label: 'Metro & Commute', iconName: 'Train', color: '#3b82f6', isDiscretionaryDefault: false },
  academics: { label: 'Books & Xerox', iconName: 'BookOpen', color: '#8b5cf6', isDiscretionaryDefault: false },
  essentials: { label: 'Essentials & Meds', iconName: 'Package', color: '#10b981', isDiscretionaryDefault: false },
  subscriptions: { label: 'Subscriptions', iconName: 'CreditCard', color: '#ec4899', isDiscretionaryDefault: true },
  entertainment: { label: 'Outings & Gear', iconName: 'Tv', color: '#ccff00', isDiscretionaryDefault: true },
  rent_utilities: { label: 'Hostel & WiFi', iconName: 'Home', color: '#06b6d4', isDiscretionaryDefault: false },
  savings: { label: 'Savings Reserve', iconName: 'PiggyBank', color: '#22c55e', isDiscretionaryDefault: false },
  income: { label: 'Stipend / Income', iconName: 'TrendingUp', color: '#22c55e', isDiscretionaryDefault: false },
};

/**
 * Computes all financial metrics deterministically from application state.
 */
export function computeFinancialMetrics(
  startingBudget: number,
  totalDays: number,
  currentDay: number,
  transactions: Transaction[],
  subscriptions: Subscription[],
  savingsGoals: SavingsGoal[]
): CalculatedMetrics {
  // 1. Incomes
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // 2. Paid Actual Expenses
  const totalPaidExpenses = transactions
    .filter((t) => t.type === 'expense' || (t.type === 'commitment' && t.isPaid))
    .reduce((sum, t) => sum + t.amount, 0);

  // 3. Current Cash in Hand
  const currentCashBalance = startingBudget + totalIncome - totalPaidExpenses;

  // 4. Unpaid Commitments (upcoming obligations reserved for future days)
  const totalUnpaidCommitments = transactions
    .filter((t) => t.type === 'commitment' && !t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // 5. Active subscriptions and renewals still due in this budget cycle.
  const activeSubs = subscriptions.filter((s) => s.isActive);
  const totalActiveSubscriptions = activeSubs.reduce((sum, s) => sum + s.amount, 0);
  const upcomingSubscriptionCost = activeSubs
    .filter((s) => {
      if (s.renewalDay < currentDay) return false;
      // Avoid reserving a renewal twice if the user already recorded that exact subscription payment.
      return !transactions.some((t) =>
        (t.type === 'expense' || t.type === 'commitment') &&
        t.category === 'subscriptions' &&
        t.day === s.renewalDay &&
        t.title.trim().toLocaleLowerCase() === s.name.trim().toLocaleLowerCase()
      );
    })
    .reduce((sum, s) => sum + s.amount, 0);

  // 6. Savings locked in goals are earmarked cash, not free-to-spend cash.
  const totalSavingsAllocated = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  // 7. True spendable balance excludes unpaid bills, upcoming active renewals, and locked savings.
  // Keep currentCashBalance as the actual cash balance; these are allocations within that cash.
  const spendableBalance = Math.max(
    0,
    currentCashBalance - totalUnpaidCommitments - upcomingSubscriptionCost - totalSavingsAllocated
  );

  // 8. Remaining Days in cycle (e.g., if Day 12 of 30, remaining = 30 - 12 + 1 = 19 days)
  const remainingDays = Math.max(1, totalDays - currentDay + 1);

  // 9. Safe Daily Discretionary Allowance:
  // (Spendable cash after reserved commitments) divided by remaining days
  const safeDailyAllowance = Math.round(spendableBalance / remainingDays);

  // 10. Month-End Forecast:
  // Assumes spending at safe daily allowance for remaining days minus any future commitments
  // If user continues current daily spending pace:
  const pastDays = Math.max(1, currentDay - 1);
  const pastDiscretionarySpent = transactions
    .filter((t) => t.type === 'expense' && !t.isEssential && t.day < currentDay)
    .reduce((sum, t) => sum + t.amount, 0);
  const avgPastDailyPace = pastDays > 0 ? pastDiscretionarySpent / pastDays : safeDailyAllowance;

  // Projected remaining discretionary spend
  const projectedFutureDiscretionary = Math.round(avgPastDailyPace * remainingDays);
  const forecastedMonthEndBalance =
    currentCashBalance -
    totalUnpaidCommitments -
    upcomingSubscriptionCost -
    totalSavingsAllocated -
    projectedFutureDiscretionary;

  // 11. Risk Analysis Engine
  const risk = evaluateRisk(
    currentCashBalance,
    spendableBalance,
    safeDailyAllowance,
    forecastedMonthEndBalance,
    totalUnpaidCommitments,
    remainingDays
  );

  return {
    startingBudget,
    totalIncome,
    totalPaidExpenses,
    currentCashBalance,
    totalUnpaidCommitments,
    spendableBalance,
    remainingDays,
    safeDailyAllowance,
    forecastedMonthEndBalance,
    totalActiveSubscriptions,
    upcomingSubscriptionCost,
    totalSavingsAllocated,
    risk,
  };
}

/**
 * Transparent, deterministic financial risk evaluation.
 * Benchmarks against realistic Indian student survival minimums (~₹80-100/day for food & tea).
 */
export function evaluateRisk(
  cashBalance: number,
  spendableBalance: number,
  dailyAllowance: number,
  forecastedMonthEnd: number,
  unpaidCommitments: number,
  remainingDays: number
): RiskAnalysis {
  const reasons: string[] = [];
  let score = 100;

  // Survival threshold in Indian college cities: ₹75/day (absolute baseline)
  const MIN_DAILY_SURVIVAL = 75;
  const COMFORT_DAILY_ALLOWANCE = 150;

  // Check 1: Cash vs Commitments
  if (cashBalance < unpaidCommitments) {
    score -= 45;
    reasons.push(
      `Cash in hand (${formatINR(cashBalance)}) is insufficient to cover pending commitments (${formatINR(unpaidCommitments)}).`
    );
  } else if (spendableBalance < 500) {
    score -= 30;
    reasons.push(
      `Spendable cash buffer is down to critical levels (${formatINR(spendableBalance)}).`
    );
  }

  // Check 2: Daily Allowance
  if (dailyAllowance < MIN_DAILY_SURVIVAL) {
    score -= 35;
    reasons.push(
      `Daily allowance (${formatINR(dailyAllowance)}/day) is below minimum campus survival threshold (${formatINR(MIN_DAILY_SURVIVAL)}/day).`
    );
  } else if (dailyAllowance < COMFORT_DAILY_ALLOWANCE) {
    score -= 15;
    reasons.push(
      `Daily allowance (${formatINR(dailyAllowance)}/day) requires strict rationing over ${remainingDays} remaining days.`
    );
  } else {
    reasons.push(`Comfortable daily runway of ${formatINR(dailyAllowance)}/day across ${remainingDays} days.`);
  }

  // Check 3: Month-end forecast
  if (forecastedMonthEnd < 0) {
    score -= 25;
    reasons.push(`Projected month-end deficit of ${formatINR(Math.abs(forecastedMonthEnd))}.`);
  } else if (forecastedMonthEnd < 500) {
    score -= 10;
    reasons.push(`Thin month-end cushion of ${formatINR(forecastedMonthEnd)}.`);
  } else {
    reasons.push(`Projected positive month-end closing reserve of ${formatINR(forecastedMonthEnd)}.`);
  }

  score = Math.max(0, Math.min(100, score));

  let level: RiskLevel = 'STABLE';
  let title = 'Stable Runway';

  if (score < 40 || dailyAllowance < MIN_DAILY_SURVIVAL || cashBalance < unpaidCommitments) {
    level = 'AT_RISK';
    title = 'At Risk // Budget Deficit Warning';
  } else if (score < 70 || dailyAllowance < COMFORT_DAILY_ALLOWANCE) {
    level = 'CAUTION';
    title = 'Caution // Tight Runway';
  } else {
    level = 'STABLE';
    title = 'Stable // Sustainable Pace';
  }

  // Calculate emergency buffer: how much unexpected shock can be absorbed without breaking commitments
  const emergencyBuffer = Math.max(0, spendableBalance - (MIN_DAILY_SURVIVAL * remainingDays));
  const runwayDays = dailyAllowance > 0 ? Math.min(remainingDays, Math.floor(spendableBalance / Math.max(1, dailyAllowance))) : 0;

  return {
    level,
    score,
    title,
    reasons,
    runwayDays,
    emergencyBuffer,
  };
}

/**
 * Simulates a prospective expense decision without mutating application state.
 */
export function simulateExpenseDecision(
  proposal: SimulationProposal,
  startingBudget: number,
  totalDays: number,
  currentDay: number,
  transactions: Transaction[],
  subscriptions: Subscription[],
  savingsGoals: SavingsGoal[]
): SimulationResult {
  const baseline = computeFinancialMetrics(
    startingBudget,
    totalDays,
    currentDay,
    transactions,
    subscriptions,
    savingsGoals
  );

  // Create temporary synthetic transaction
  const simulatedTransaction: Transaction = {
    id: 'simulated_temp',
    title: proposal.title,
    amount: proposal.amount,
    type: 'expense',
    category: proposal.category,
    day: proposal.day,
    dateStr: `Day ${proposal.day}`,
    isEssential: proposal.isEssential,
    isPaid: true,
    isDemo: false,
  };

  const simulatedTransactions = [...transactions, simulatedTransaction];

  const simulated = computeFinancialMetrics(
    startingBudget,
    totalDays,
    currentDay,
    simulatedTransactions,
    subscriptions,
    savingsGoals
  );

  const balanceBefore = baseline.currentCashBalance;
  const balanceAfter = simulated.currentCashBalance;
  const allowanceBefore = baseline.safeDailyAllowance;
  const allowanceAfter = simulated.safeDailyAllowance;
  const forecastBefore = baseline.forecastedMonthEndBalance;
  const forecastAfter = simulated.forecastedMonthEndBalance;

  const isAffordable = simulated.spendableBalance >= 0 && simulated.safeDailyAllowance >= 60;
  const shortfall = Math.max(0, proposal.amount - baseline.spendableBalance);
  const riskChanged = baseline.risk.level !== simulated.risk.level;

  const warnings: string[] = [];
  if (proposal.amount > baseline.spendableBalance) {
    warnings.push(
      `Insufficient spendable cash! You need ${formatINR(proposal.amount)} but only have ${formatINR(baseline.spendableBalance)} after commitments.`
    );
  }
  if (allowanceAfter < 75) {
    warnings.push(
      `Reduces daily allowance by ${formatINR(allowanceBefore - allowanceAfter)}/day, down to a tight ${formatINR(allowanceAfter)}/day.`
    );
  }
  if (simulated.risk.level === 'AT_RISK' && baseline.risk.level !== 'AT_RISK') {
    warnings.push('This single decision pushes your financial status from safe into AT RISK.');
  }

  // Generate 3 actionable, transparent alternatives:
  const alternatives: SimulationAlternative[] = [
    {
      id: 'buy_now',
      title: 'Option A: Buy Today (Full Cost)',
      description: `Commit ${formatINR(proposal.amount)} right now on Day ${currentDay}.`,
      amount: proposal.amount,
      dailyAllowance: allowanceAfter,
      monthEndForecast: forecastAfter,
      riskLevel: simulated.risk.level,
    },
    {
      id: 'delay_purchase',
      title: 'Option B: Delay to Day 26',
      description: `Hold off for 14 days until essential bills are settled and month-end buffer is clear.`,
      amount: proposal.amount,
      // If delayed, allowance during days 12-25 remains baseline!
      dailyAllowance: baseline.safeDailyAllowance,
      monthEndForecast: forecastAfter,
      riskLevel: baseline.risk.level,
    },
    {
      id: 'budget_alternative',
      title: 'Option C: Budget Alternative (-50% Cost)',
      description: `Look for a pre-owned, refurbished, or split-cost alternative (~${formatINR(Math.round(proposal.amount * 0.5))}).`,
      amount: Math.round(proposal.amount * 0.5),
      dailyAllowance: Math.round((baseline.spendableBalance - Math.round(proposal.amount * 0.5)) / baseline.remainingDays),
      monthEndForecast: forecastBefore - Math.round(proposal.amount * 0.5),
      riskLevel:
        (baseline.spendableBalance - Math.round(proposal.amount * 0.5)) / baseline.remainingDays >= 120
          ? 'STABLE'
          : 'CAUTION',
    },
  ];

  return {
    proposal,
    baseline,
    simulated,
    balanceBefore,
    balanceAfter,
    allowanceBefore,
    allowanceAfter,
    forecastBefore,
    forecastAfter,
    isAffordable,
    shortfall,
    riskChanged,
    warnings,
    alternatives,
  };
}
