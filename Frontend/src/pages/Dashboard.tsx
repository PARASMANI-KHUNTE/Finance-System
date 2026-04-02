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
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const stats = [
    { title: 'Total Balance', value: data?.balance || 0, icon: Wallet, color: 'emerald' },
    { title: 'Total Income', value: data?.total_income || 0, icon: TrendingUp, color: 'blue' },
    { title: 'Total Expenses', value: data?.total_expense || 0, icon: TrendingDown, color: 'rose' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Hello, tracking your finances in real-time.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl overflow-hidden hover:border-slate-700 transition-all"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-400",
                stat.color === 'blue' && "bg-blue-500/10 text-blue-400",
                stat.color === 'rose' && "bg-rose-500/10 text-rose-400"
              )}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  <span className="text-slate-500 text-xl font-normal mr-1">$</span>
                  {stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            {/* Subtle Gradient Glow */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 group-hover:scale-110 transition-transform",
              stat.color === 'emerald' && "bg-emerald-500/20",
              stat.color === 'blue' && "bg-blue-500/20",
              stat.color === 'rose' && "bg-rose-500/20"
            )} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Transactions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium px-4 py-2 hover:bg-emerald-500/5 rounded-lg transition-all"
            >
              View All
            </button>
          </div>

          <div className="space-y-5">
            {data?.recent_transactions.length ? (
              data.recent_transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      tx.type === 'income' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                      {tx.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate max-w-[150px]">{tx.category}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold text-lg",
                      tx.type === 'income' ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em] mt-0.5">Approved</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <p className="text-slate-400 italic">No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PieChart size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Expense Allocation</h2>
          </div>

          <div className="space-y-6">
            {data?.category_breakdown.length ? (
              data.category_breakdown.map((cat, idx) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="text-slate-500">${cat.total.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cat.total / (data?.total_expense || cat.total)) * 100, 100)}%` }}
                      transition={{ delay: 0.3 + (idx * 0.1), duration: 1 }}
                      className={cn(
                        "h-full rounded-full",
                        idx === 0 && "bg-emerald-500",
                        idx === 1 && "bg-blue-500",
                        idx === 2 && "bg-purple-500",
                        idx > 2 && "bg-slate-600"
                      )} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <p className="text-slate-400 italic">Start tracking to see analysis</p>
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
