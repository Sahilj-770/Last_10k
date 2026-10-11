import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Transaction,
  Subscription,
  SavingsGoal,
  SimulationProposal,
  SimulationResult,
  StressScenario,
  TransactionCategory,
  TransactionType,
} from '../types/finance';
import {
  INITIAL_STARTING_BUDGET,
  TOTAL_BUDGET_DAYS,
  INITIAL_CURRENT_DAY,
  INITIAL_TRANSACTIONS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SAVINGS_GOALS,
} from '../data/initialFinanceData';
import {
  computeFinancialMetrics,
  simulateExpenseDecision,
} from '../utils/financeEngine';

const STORAGE_KEY = 'last_10k_finance_v1';

export function useFinance() {
  const [startingBudget] = useState<number>(INITIAL_STARTING_BUDGET);
  const [totalDays] = useState<number>(TOTAL_BUDGET_DAYS);
  const [currentDay, setCurrentDay] = useState<number>(INITIAL_CURRENT_DAY);

  // Core records initialized from LocalStorage or seed data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_tx`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored transactions', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_subs`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored subscriptions', e);
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_goals`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored savings goals', e);
    }
    return INITIAL_SAVINGS_GOALS;
  });

  // Active stress test scenario (transient or applied)
  const [activeStressScenario, setActiveStressScenario] = useState<StressScenario | null>(null);

  // Active decision simulation proposal
  const [simulationProposal, setSimulationProposal] = useState<SimulationProposal | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tx`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY}_subs`, JSON.stringify(subscriptions));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(savingsGoals));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [transactions, subscriptions, savingsGoals]);

  // Derived baseline metrics
  const metrics = useMemo(() => {
    return computeFinancialMetrics(
      startingBudget,
      totalDays,
      currentDay,
      transactions,
      subscriptions,
      savingsGoals
    );
  }, [startingBudget, totalDays, currentDay, transactions, subscriptions, savingsGoals]);

  // Derived simulation result if a proposal exists
  const simulationResult = useMemo<SimulationResult | null>(() => {
    if (!simulationProposal) return null;
    return simulateExpenseDecision(
      simulationProposal,
      startingBudget,
      totalDays,
      currentDay,
      transactions,
      subscriptions,
      savingsGoals
    );
  }, [simulationProposal, startingBudget, totalDays, currentDay, transactions, subscriptions, savingsGoals]);

  // --- ACTIONS ---

  // 1. Simulate Decision (does NOT mutate state!)
  const simulatePurchase = useCallback((proposal: SimulationProposal) => {
    setSimulationProposal(proposal);
  }, []);

  // 2. Commit Decision (writes to ledger)
  const commitSimulation = useCallback(() => {
    if (!simulationProposal) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: simulationProposal.title,
      amount: simulationProposal.amount,
      type: 'expense',
      category: simulationProposal.category,
      day: simulationProposal.day,
      dateStr: `Day ${simulationProposal.day} · Live Decision`,
      isEssential: simulationProposal.isEssential,
      isPaid: true,
      isDemo: false,
      notes: 'Committed via Decision Simulator',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setSimulationProposal(null);
  }, [simulationProposal]);

  // 3. Cancel Simulation (leaves financial state untouched)
  const cancelSimulation = useCallback(() => {
    setSimulationProposal(null);
  }, []);

  // 4. Add Transaction
  const addTransaction = useCallback(
    (data: {
      title: string;
      amount: number;
      type: TransactionType;
      category: TransactionCategory;
      day: number;
      isEssential: boolean;
      notes?: string;
    }) => {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        title: data.title.trim(),
        amount: Math.abs(data.amount),
        type: data.type,
        category: data.category,
        day: data.day,
        dateStr: `Day ${data.day}`,
        isEssential: data.isEssential,
        isPaid: data.type !== 'commitment',
        isDemo: false,
        notes: data.notes?.trim(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    },
    []
  );

  // 5. Delete Transaction
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 6. Mark Commitment as Paid (avoids double deduction!)
  const markCommitmentPaid = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          isPaid: true,
          notes: (t.notes ? `${t.notes} · ` : '') + 'Paid & Reconciled',
        };
      })
    );
  }, []);

  // 7. Toggle Subscription (simulate cancelling/keeping)
  const toggleSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, isActive: !s.isActive };
      })
    );
  }, []);

  // 8. Stress Scenario Actions
  const applyStressScenario = useCallback((scenario: StressScenario) => {
    const stressTx: Transaction = {
      id: `stress-${scenario.id}-${Date.now()}`,
      title: `[Shock Test] ${scenario.title}`,
      amount: scenario.amount,
      type: 'expense',
      category: scenario.category,
      day: INITIAL_CURRENT_DAY,
      dateStr: `Day ${INITIAL_CURRENT_DAY} · Stress Test`,
      isEssential: true,
      isPaid: true,
      isDemo: false,
      notes: scenario.description,
    };
    setTransactions((prev) => [stressTx, ...prev]);
    setActiveStressScenario(scenario);
  }, []);

  const resetStressScenario = useCallback(() => {
    setTransactions((prev) => prev.filter((t) => !t.id.startsWith('stress-')));
    setActiveStressScenario(null);
  }, []);

  // 9. Allocate cash to savings goal
  const contributeToSavingsGoal = useCallback(
    (goalId: string, amount: number) => {
      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          return { ...g, currentAmount: g.currentAmount + amount };
        })
      );
      // Also record as savings allocation transaction
      const goal = savingsGoals.find((g) => g.id === goalId);
      const newTx: Transaction = {
        id: `tx-goal-${Date.now()}`,
        title: `Savings Allocation: ${goal?.title || 'Goal'}`,
        amount,
        type: 'expense',
        category: 'savings',
        day: currentDay,
        dateStr: `Day ${currentDay}`,
        isEssential: true,
        isPaid: true,
        isDemo: false,
        notes: `Transferred to savings reserve (${goal?.title})`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    },
    [currentDay, savingsGoals]
  );

  // 10. Reset to default demo data
  const resetToDemoData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setCurrentDay(INITIAL_CURRENT_DAY);
    setActiveStressScenario(null);
    setSimulationProposal(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_tx`);
      localStorage.removeItem(`${STORAGE_KEY}_subs`);
      localStorage.removeItem(`${STORAGE_KEY}_goals`);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    startingBudget,
    totalDays,
    currentDay,
    setCurrentDay,
    transactions,
    subscriptions,
    savingsGoals,
    metrics,
    simulationProposal,
    simulationResult,
    activeStressScenario,
    simulatePurchase,
    commitSimulation,
    cancelSimulation,
    addTransaction,
    deleteTransaction,
    markCommitmentPaid,
    toggleSubscription,
    applyStressScenario,
    resetStressScenario,
    contributeToSavingsGoal,
    resetToDemoData,
  };
}
