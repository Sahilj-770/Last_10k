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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!tx.title.toLowerCase().includes(q) && !tx.notes?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (typeFilter === 'commitments_unpaid') {
      if (tx.type !== 'commitment' || tx.isPaid) return false;
    } else if (typeFilter !== 'all') {
      if (tx.type !== typeFilter) return false;
    }
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
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f6f4ee] rounded-full text-xs font-mono text-[#5a6272] mb-2 border border-[#e8e5dc]">
              <CreditCard className="w-3.5 h-3.5 text-[#12141a]" />
              <span>UNIFIED TRANSACTION &amp; COMMITMENTS LEDGER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12141a] tracking-tight">
              Expenses &amp; Commitments
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6272] max-w-2xl mt-1 leading-relaxed">
              Every completed debit and upcoming payment obligation reconciled in a single transparent register. Marking a commitment as paid settles it without duplicate deductions.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter Tabs */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8c95a6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, notes, bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg pl-9 pr-8 py-2 text-xs text-[#12141a] placeholder-[#8c95a6] focus:bg-white focus:border-[#12141a] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c95a6] hover:text-[#12141a]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
            <span className="text-[#64748b] font-medium shrink-0">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as TransactionCategory | 'all')
              }
              className="bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-3 py-1.5 text-[#12141a] focus:border-[#12141a] focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#ede9df] text-xs">
          <span className="text-[#8c95a6] text-[11px] uppercase font-mono mr-1">Filter:</span>
          {(
            [
              { id: 'all', label: `All (${transactions.length})` },
              {
                id: 'commitments_unpaid',
                label: `Unpaid Commitments (${
                  transactions.filter((t) => t.type === 'commitment' && !t.isPaid).length
                })`,
              },
              {
                id: 'expense',
                label: `Paid Expenses (${
                  transactions.filter((t) => t.type === 'expense' || (t.type === 'commitment' && t.isPaid)).length
                })`,
              },
              {
                id: 'income',
                label: `Incomes (${transactions.filter((t) => t.type === 'income').length})`,
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                typeFilter === t.id
                  ? 'bg-[#12141a] text-white shadow-xs'
                  : 'bg-[#f6f4ee] text-[#5a6272] border border-[#e8e5dc] hover:text-[#12141a]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[#e8e5dc] rounded-2xl overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fcfbf9] border-b border-[#ede9df] text-[#64748b] font-medium">
              <th className="py-3.5 px-5">DATE / DAY</th>
              <th className="py-3.5 px-5">DESCRIPTION</th>
              <th className="py-3.5 px-5">CATEGORY</th>
              <th className="py-3.5 px-5">STATUS</th>
              <th className="py-3.5 px-5">PRIORITY</th>
              <th className="py-3.5 px-5 text-right font-mono">AMOUNT</th>
              <th className="py-3.5 px-5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ede9df]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#8c95a6]">
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
                    className="hover:bg-[#fbfaf7] transition-colors"
                  >
                    <td className="py-3.5 px-5 font-mono text-[#5a6272] whitespace-nowrap">
                      Day {tx.day}{' '}
                      <span className="text-[#8c95a6] text-[11px]">
                        ({tx.day <= currentDay ? 'Past' : 'Upcoming'})
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#12141a] text-sm">{tx.title}</div>
                      {tx.notes && (
                        <div className="text-[11px] text-[#64748b] line-clamp-1">{tx.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[#5a6272]">
                      {CATEGORY_META[tx.category]?.label || tx.category}
                    </td>
                    <td className="py-3.5 px-5">
                      {isCommitment ? (
                        tx.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px] font-medium">
                            <Lock className="w-3 h-3 text-amber-600" /> Reserved Bill
                          </span>
                        )
                      ) : isIncome ? (
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          + Credit
                        </span>
                      ) : (
                        <span className="text-[#5a6272] bg-[#f6f4ee] px-2 py-0.5 rounded-full text-[11px] font-medium">
                          Paid Debit
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${
                          tx.isEssential
                            ? 'text-blue-800 bg-blue-50 border border-blue-200'
                            : 'text-[#64748b] bg-[#f6f4ee]'
                        }`}
                      >
                        {tx.isEssential ? 'ESSENTIAL' : 'DISCRETIONARY'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono">
                      <span
                        className={`font-black text-sm ${
                          isIncome
                            ? 'text-emerald-700'
                            : isCommitment && !tx.isPaid
                            ? 'text-amber-700'
                            : 'text-[#12141a]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {isCommitment && !tx.isPaid && (
                          <button
                            onClick={() => {
                              onMarkCommitmentPaid(tx.id);
                              onShowToast(`Settled: ${tx.title}`);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md px-2.5 py-1 text-[11px] font-semibold cursor-pointer"
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
                          className="text-[#8c95a6] hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
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
          <div className="w-full max-w-lg bg-white border border-[#e8e5dc] rounded-2xl shadow-2xl p-6 text-left text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede9df] mb-4">
              <h3 className="font-heading font-black text-lg text-[#12141a]">
                Record New Transaction
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8c95a6] hover:text-[#12141a] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#12141a] mb-1">
                  Title / Item *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Canteen dinner, Xerox, WiFi share"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-3 py-2 text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12141a] mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 250"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-3 py-2 font-mono text-sm text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12141a] mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TransactionType)}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-2.5 py-2 text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none cursor-pointer"
                  >
                    <option value="expense">Paid Expense (Immediate debit)</option>
                    <option value="commitment">Upcoming Commitment (Reserved bill)</option>
                    <option value="income">Income / Stipend (+ Credit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12141a] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-2.5 py-2 text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none cursor-pointer"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12141a] mb-1">Day of Expense</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-2.5 py-2 text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        Day {d} {d === currentDay ? '(Today)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#f6f4ee] p-3 rounded-lg border border-[#e8e5dc]">
                <input
                  type="checkbox"
                  id="is-essential-cb"
                  checked={newIsEssential}
                  onChange={(e) => setNewIsEssential(e.target.checked)}
                  className="accent-[#12141a] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="is-essential-cb" className="text-xs text-[#12141a] cursor-pointer">
                  Mark as Essential (e.g. food staple, medicine, hostel bill)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12141a] mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Split with Ankit, payment via UPI"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#fbfaf7] border border-[#d6d2c4] rounded-lg px-3 py-2 text-[#12141a] focus:bg-white focus:border-[#12141a] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ede9df]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#f6f4ee] text-[#5a6272] hover:text-[#12141a] rounded-lg cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12141a] hover:bg-black text-[#ccff00] font-semibold rounded-lg cursor-pointer"
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
