import React, { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit3,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

const TransactionHistory: React.FC = () => {
  const { role } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (role !== 'viewer') {
        if (search) params.search = search;
        if (type) params.type = type;
        if (category) params.category = category;
      }

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, type, category, role]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert('Failed to delete transaction');
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Transaction Logs</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Audit each financial activity record.</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group flex-1 w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search memo..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={role === 'viewer'}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-3 rounded-2xl border transition-all shadow-sm",
              showFilters ? "bg-amber-500 border-amber-500 text-white" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
            disabled={role === 'viewer'}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && role !== 'viewer' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 shadow-sm"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Type</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</label>
              <input 
                type="text"
                placeholder="e.g. Shopping"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-3 mt-4 sm:mt-0">
              <button 
                onClick={() => { setType(''); setCategory(''); setSearch(''); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 sm:px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction</th>
                <th className="px-6 sm:px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 sm:px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 sm:px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 sm:px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transactions.length ? transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {tx.type === 'income' ? (
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <ArrowUpCircle size={20} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-rose-500/10 text-slate-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                          <ArrowDownCircle size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white capitalize text-sm sm:text-base">{tx.type}</p>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-[150px] sm:max-w-[200px] truncate">{tx.notes || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 sm:px-8 py-4 sm:py-6">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 sm:px-8 py-4 sm:py-6 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 sm:px-8 py-4 sm:py-6">
                    <span className={cn(
                      "font-bold text-base sm:text-lg whitespace-nowrap",
                      tx.type === 'income' ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 sm:px-8 py-4 sm:py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {role === 'admin' ? (
                        <>
                          <button 
                            onClick={() => handleEdit(tx)}
                            className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <button className="p-2 text-slate-300 dark:text-slate-700 hover:text-slate-400 dark:hover:text-slate-500 transition-all cursor-not-allowed">
                          <MoreVertical size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">
                    {loading ? (
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                      </div>
                    ) : 'No transactions recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 sm:px-8 py-4 sm:py-6 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-900 dark:text-white font-medium">{(page - 1) * limit + 1}</span> to <span className="text-slate-900 dark:text-white font-medium">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 dark:text-white font-medium">{total}</span> results
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2 self-center sm:self-auto">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-sm font-bold transition-all",
                    page === i + 1 
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSuccess={() => fetchTransactions()}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default TransactionHistory;
