import React, { useState, useEffect } from 'react';
import { useFinance } from './hooks/useFinance';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { SpendingSimulator } from './components/SpendingSimulator';
import { SurvivalCalendar } from './components/SurvivalCalendar';
import { ExpenseTracker } from './components/ExpenseTracker';
import { SubscriptionLeakDetector } from './components/SubscriptionLeakDetector';
import { StressTestScenarios } from './components/StressTestScenarios';
import { SavingsGoals } from './components/SavingsGoals';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

export function App() {
  const {
    startingBudget,
    totalDays,
    currentDay,
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
  } = useFinance();

  const [activeTab, setActiveTab] = useState<
    'command' | 'simulator' | 'calendar' | 'ledger' | 'subscriptions' | 'stress'
  >('command');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Keyboard Shortcuts (e.g. S for Simulator)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        setActiveTab('simulator');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportJson = () => {
    const data = {
      product: 'LAST ₹10K',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      startingBudget,
      totalDays,
      currentDay,
      metrics,
      transactions,
      subscriptions,
      savingsGoals,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `last-10k-ledger-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage('Financial ledger JSON successfully exported.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-[#faf7f0]">
      {/* Header */}
      <Header
        currentDay={currentDay}
        totalDays={totalDays}
        cashBalance={metrics.currentCashBalance}
        safeDailyAllowance={metrics.safeDailyAllowance}
        riskLevel={metrics.risk.level}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSimulate={() => setActiveTab('simulator')}
        onResetDemoData={resetToDemoData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeTab === 'command' && (
          <div className="space-y-8">
            <CommandCenter
              metrics={metrics}
              currentDay={currentDay}
              totalDays={totalDays}
              savingsGoals={savingsGoals}
              recentTransactions={transactions}
              onOpenSimulator={() => setActiveTab('simulator')}
              onOpenAddTransaction={() => setActiveTab('ledger')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
            {/* Embedded Savings & Goal Tracking preview on command center */}
            <SavingsGoals
              savingsGoals={savingsGoals}
              metrics={metrics}
              onContributeToGoal={contributeToSavingsGoal}
              onShowToast={setToastMessage}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <SpendingSimulator
            currentDay={currentDay}
            totalDays={totalDays}
            metrics={metrics}
            activeResult={simulationResult}
            onSimulate={simulatePurchase}
            onCommit={commitSimulation}
            onCancel={cancelSimulation}
            onShowToast={setToastMessage}
          />
        )}

        {activeTab === 'calendar' && (
          <SurvivalCalendar
            currentDay={currentDay}
            totalDays={totalDays}
            transactions={transactions}
            subscriptions={subscriptions}
            metrics={metrics}
            onOpenSimulatorForDay={(day) => {
              setActiveTab('simulator');
              simulatePurchase({
                title: 'Simulated Purchase',
                amount: 800,
                category: 'entertainment',
                day,
                isEssential: false,
              });
            }}
          />
        )}

        {activeTab === 'ledger' && (
          <ExpenseTracker
            transactions={transactions}
            currentDay={currentDay}
            totalDays={totalDays}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onMarkCommitmentPaid={markCommitmentPaid}
            onShowToast={setToastMessage}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionLeakDetector
            subscriptions={subscriptions}
            startingBudget={startingBudget}
            onToggleSubscription={toggleSubscription}
            onShowToast={setToastMessage}
          />
        )}

        {activeTab === 'stress' && (
          <StressTestScenarios
            metrics={metrics}
            activeScenario={activeStressScenario}
            onApplyScenario={applyStressScenario}
            onResetScenario={resetStressScenario}
            onShowToast={setToastMessage}
          />
        )}
      </main>

      {/* Toast Notification Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <Footer
        onResetDemoData={resetToDemoData}
        onExportJson={handleExportJson}
        onShowToast={setToastMessage}
      />
    </div>
  );
}

export default App;
