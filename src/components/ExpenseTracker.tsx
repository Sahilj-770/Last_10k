import React, { useState } from 'react';
import type {
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../types/finance';
import { CATEGORY_META, formatINR } from '../utils/financeEngine';
import {
  CreditCard,
  Plus,
  Search,
  X,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowUpRight,
  TrendingDown,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface ExpenseTrackerProps {
  transactions: Transaction[];
  currentDay: number;
  totalDays: number;
  onAddTransaction: (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    day: number;
    isEssential: boolean;
    notes?: string;
  }) => void;
  onDeleteTransaction: (id: string) => void;
  onMarkCommitmentPaid: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  transactions,
  currentDay,
  totalDays,
  onAddTransaction,
  onDeleteTransaction,
  onMarkCommitmentPaid,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all' | 'commitments_unpaid'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('food');
  const [newDay, setNewDay] = useState<number>(currentDay);
  const [newIsEssential, setNewIsEssential] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  // Filtered transactions
  const filtered = transactions.filter((tx) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!tx.title.toLowerCase().includes(q) && !tx.notes?.toLowerCase().includes(q)) {
        return false;
      }
    }
    // Type Filter
    if (typeFilter === 'commitments_unpaid') {
      if (tx.type !== 'commitment' || tx.isPaid) return false;
    } else if (typeFilter !== 'all') {
      if (tx.type !== typeFilter) return false;
    }
    // Category Filter
    if (categoryFilter !== 'all') {
      if (tx.category !== categoryFilter) return false;
    }
    return true;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a transaction title.');
      return;
    }
    if (!newAmount || Number(newAmount) <= 0) {
      alert('Please enter a positive amount.');
      return;
    }

    onAddTransaction({
      title: newTitle.trim(),
      amount: Number(newAmount),
      type: newType,
      category: newCategory,
      day: newDay,
      isEssential: newIsEssential,
      notes: newNotes.trim() || undefined,
    });

    onShowToast(`Added: ${newTitle} (₹${newAmount})`);
    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#10121a] border border-[#1e212d] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ccff00] mb-1.5 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#ccff00]" />
              <span>UNIFIED TRANSACTION &amp; COMMITMENTS LEDGER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#faf7f0] tracking-tight">
              Expenses &amp; Commitments
            </h2>
            <p className="text-xs sm:text-sm text-[#8e96a8] max-w-2xl font-body mt-1 leading-relaxed">
              Every completed debit and upcoming payment obligation reconciled in a single transparent register. Marking a commitment as paid settles it without duplicate deductions.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-semibold text-xs sm:text-sm font-mono px-4 py-2.5 transition-colors flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter Tabs */}
      <div className="bg-[#10121a] border border-[#1e212d] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#656d80] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, notes, bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090a0f] border border-[#232738] pl-9 pr-8 py-2 text-xs font-mono text-[#faf7f0] placeholder-[#555d70] focus:border-[#ccff00] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#656d80] hover:text-[#faf7f0]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2 text-xs font-mono">
            <span className="text-[#717b8f] shrink-0">CATEGORY:</span>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as TransactionCategory | 'all')
              }
              className="bg-[#090a0f] border border-[#232738] px-3 py-1.5 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#181a24] text-xs font-mono">
          <span className="text-[#656d80] text-[11px] uppercase mr-1">TYPE:</span>
          {(
            [
              { id: 'all', label: `ALL (${transactions.length})` },
              {
                id: 'commitments_unpaid',
                label: `UNPAID COMMITMENTS (${
                  transactions.filter((t) => t.type === 'commitment' && !t.isPaid).length
                })`,
              },
              {
                id: 'expense',
                label: `PAID EXPENSES (${
                  transactions.filter((t) => t.type === 'expense' || (t.type === 'commitment' && t.isPaid)).length
                })`,
              },
              {
                id: 'income',
                label: `INCOMES (${transactions.filter((t) => t.type === 'income').length})`,
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-2.5 py-1 border transition-colors ${
                typeFilter === t.id
                  ? 'bg-[#ccff00] text-black font-bold border-[#ccff00]'
                  : 'bg-[#12141c] text-[#8a92a3] border-[#222533] hover:text-[#faf7f0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#10121a] border border-[#1e212d] overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-[#090a0f] border-b border-[#1e212d] text-[#717b8f]">
              <th className="py-3 px-4">DATE / DAY</th>
              <th className="py-3 px-4">DESCRIPTION</th>
              <th className="py-3 px-4">CATEGORY</th>
              <th className="py-3 px-4">TYPE / STATUS</th>
              <th className="py-3 px-4">PRIORITY</th>
              <th className="py-3 px-4 text-right">AMOUNT</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#181a24]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#656d80]">
                  No matching transactions found in this view.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isCommitment = tx.type === 'commitment';
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#141722] transition-colors group"
                  >
                    <td className="py-3 px-4 text-[#a3adc2] whitespace-nowrap">
                      Day {tx.day}{' '}
                      <span className="text-[#656d80] text-[10px]">
                        ({tx.day <= currentDay ? 'Past' : 'Upcoming'})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#faf7f0]">{tx.title}</div>
                      {tx.notes && (
                        <div className="text-[10px] text-[#717b8f] line-clamp-1">{tx.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#d1d5db]">
                        {CATEGORY_META[tx.category]?.label || tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isCommitment ? (
                        tx.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 border border-[#22c55e]/30 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> SETTLED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 border border-[#f59e0b]/30 text-[10px]">
                            <Lock className="w-3 h-3" /> RESERVED
                          </span>
                        )
                      ) : isIncome ? (
                        <span className="text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 text-[10px]">
                          + CREDIT
                        </span>
                      ) : (
                        <span className="text-[#8e96a8] bg-[#1a1d29] px-2 py-0.5 text-[10px]">
                          PAID DEBIT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 ${
                          tx.isEssential
                            ? 'text-[#60a5fa] bg-[#3b82f6]/10'
                            : 'text-[#9ca3af] bg-[#374151]/20'
                        }`}
                      >
                        {tx.isEssential ? 'ESSENTIAL' : 'DISCRETIONARY'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-black text-sm ${
                          isIncome
                            ? 'text-[#22c55e]'
                            : isCommitment && !tx.isPaid
                            ? 'text-[#f59e0b]'
                            : 'text-[#faf7f0]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {isCommitment && !tx.isPaid && (
                          <button
                            onClick={() => {
                              onMarkCommitmentPaid(tx.id);
                              onShowToast(`Settled: ${tx.title}`);
                            }}
                            className="bg-[#132219] hover:bg-[#1a3525] text-[#22c55e] border border-[#22c55e]/40 px-2 py-1 text-[10px] font-bold"
                            title="Mark as paid now (reconciles without double-counting)"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${tx.title}"?`)) {
                              onDeleteTransaction(tx.id);
                              onShowToast(`Removed ${tx.title}`);
                            }
                          }}
                          className="text-[#656d80] hover:text-[#ff4d4f] p-1 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="w-full max-w-lg bg-[#10121a] border border-[#262939] shadow-2xl p-6 text-left font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e212d] mb-4">
              <h3 className="font-heading font-black text-base text-[#faf7f0] uppercase">
                Record New Transaction
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#656d80] hover:text-[#faf7f0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-[#a3adc2] mb-1 font-semibold">TITLE / ITEM *</label>
                <input
                  type="text"
                  placeholder="e.g. Canteen dinner, Xerox, WiFi share"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#090a0f] border border-[#232738] px-3 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a3adc2] mb-1 font-semibold">AMOUNT (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 250"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#090a0f] border border-[#232738] px-3 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a3adc2] mb-1 font-semibold">TYPE</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TransactionType)}
                    className="w-full bg-[#090a0f] border border-[#232738] px-2.5 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                  >
                    <option value="expense">Paid Expense (Immediate debit)</option>
                    <option value="commitment">Upcoming Commitment (Reserved bill)</option>
                    <option value="income">Income / Stipend (+ Credit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a3adc2] mb-1 font-semibold">CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                    className="w-full bg-[#090a0f] border border-[#232738] px-2.5 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#a3adc2] mb-1 font-semibold">DAY OF EXPENSE</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full bg-[#090a0f] border border-[#232738] px-2.5 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                  >
                    {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        Day {d} {d === currentDay ? '(Today)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Essential checkbox */}
              <div className="flex items-center gap-2 bg-[#090a0f] p-3 border border-[#1e212d]">
                <input
                  type="checkbox"
                  id="is-essential-cb"
                  checked={newIsEssential}
                  onChange={(e) => setNewIsEssential(e.target.checked)}
                  className="accent-[#ccff00]"
                />
                <label htmlFor="is-essential-cb" className="text-[#a3adc2] cursor-pointer">
                  Mark as Essential (e.g., food staple, medicine, hostel bill)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[#a3adc2] mb-1">NOTES (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Split with Ankit, payment via UPI"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#090a0f] border border-[#232738] px-3 py-2 text-[#faf7f0] focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e212d]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#161822] text-[#8e96a8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
