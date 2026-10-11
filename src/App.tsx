import React, { useState, useEffect } from 'react';
import { useFinance } from './hooks/useFinance';
import { LandingPage } from './components/LandingPage';
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
import type { SimulationProposal } from './types/finance';
import { formatINR } from './utils/financeEngine';

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

  // Primary view mode: dedicated editorial landing page or deep financial workspace
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  const [activeTab, setActiveTab] = useState<
    'command' | 'simulator' | 'calendar' | 'ledger' | 'subscriptions' | 'stress'
  >('command');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // URL hash sync: #app for deep workspace, #landing or root for landing page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#app' || window.location.hash.startsWith('#/app')) {
        setViewMode('app');
      } else {
        setViewMode('landing');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        setViewMode('app');
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

  const handleLaunchSimulationInApp = (proposal: SimulationProposal) => {
    simulatePurchase(proposal);
    setActiveTab('simulator');
    setViewMode('app');
    window.location.hash = '#app';
    setToastMessage(`Preloaded ${formatINR(proposal.amount)} purchase into Decision Simulator.`);
  };

  const handleEnterApp = () => {
    setViewMode('app');
    window.location.hash = '#app';
  };

  const handleBackToLanding = () => {
    window.location.hash = '#landing';
    setViewMode('landing');
  };

  // If viewing landing page, render dedicated high-end editorial landing experience
  if (viewMode === 'landing') {
    return (
      <div className="animate-in fade-in duration-300">
        <LandingPage
          metrics={metrics}
          currentDay={currentDay}
          totalDays={totalDays}
          startingBudget={startingBudget}
          transactions={transactions}
          subscriptions={subscriptions}
          savingsGoals={savingsGoals}
          onEnterApp={handleEnterApp}
          onLaunchSimulationInApp={handleLaunchSimulationInApp}
          onResetDemoData={resetToDemoData}
          onExportJson={handleExportJson}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  // Active Financial Application Workspace
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-[#12141a] animate-in fade-in duration-300">
      {/* Header with quick back to Landing toggle */}
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
        onBackToLanding={handleBackToLanding}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8">
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
