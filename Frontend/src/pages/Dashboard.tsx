import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Clock,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SummaryData {
  total_income: number;
  total_expense: number;
  balance: number;
  category_breakdown: { category: string; total: number }[];
  recent_transactions: any[];
}

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [role]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );

  const stats = [
    { title: 'Total Balance', value: data?.balance || 0, icon: Wallet, color: 'amber' },
    { title: 'Total Income', value: data?.total_income || 0, icon: TrendingUp, color: 'blue' },
    { title: 'Total Expenses', value: data?.total_expense || 0, icon: TrendingDown, color: 'slate' },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Hello, tracking your finances in real-time.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/25 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                stat.color === 'amber' && "bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
                stat.color === 'blue' && "bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
                stat.color === 'slate' && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  <span className="text-slate-400 dark:text-slate-500 text-xl font-normal mr-1">$</span>
                  {stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-lg transition-all"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {data?.recent_transactions.length ? (
              data.recent_transactions.map((tx: any) => (
                <div key={tx.id} className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      tx.type === 'income' ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-slate-200 dark:bg-rose-500/10 text-slate-600 dark:text-rose-400"
                    )}>
                      {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px] text-sm sm:text-base">{tx.category}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold text-base sm:text-lg",
                      tx.type === 'income' ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-200"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] mt-0.5">Approved</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <p className="text-slate-400 italic text-sm">No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <PieChart size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Expense Allocation</h2>
          </div>

          <div className="space-y-6">
            {data?.category_breakdown.length ? (
              data.category_breakdown.map((cat, idx) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.category}</span>
                    <span className="text-slate-500">${cat.total.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cat.total / (data?.total_expense || cat.total)) * 100, 100)}%` }}
                      transition={{ delay: 0.3 + (idx * 0.1), duration: 1 }}
                      className={cn(
                        "h-full rounded-full",
                        idx === 0 && "bg-amber-500",
                        idx === 1 && "bg-slate-400",
                        idx === 2 && "bg-blue-500",
                        idx > 2 && "bg-slate-300 dark:bg-slate-600"
                      )} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <p className="text-slate-400 italic text-sm">Start tracking to see analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchSummary()}
      />
    </div>
  );
};

export default Dashboard;
