import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface MonthlyTotal {
  month: string;
  income: number;
  expense: number;
}

interface SummaryData {
  monthly_totals: MonthlyTotal[];
}

const Analytics: React.FC = () => {
  const { role } = useAuth();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchSummary();
  }, [role]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );

  const months = data?.monthly_totals || [];
  const maxAmount = Math.max(...months.map(m => Math.max(m.income, m.expense)), 100);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Insights & Analytics
        </h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Deep dive into your monthly spending patterns.</p>
      </div>

      {/* Monthly Chart Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-6 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Monthly Comparison</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Expense</span>
            </div>
          </div>
        </div>

        <div className="relative h-[250px] sm:h-[300px] flex items-end justify-between gap-2 sm:gap-8 px-2 sm:px-4">
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full border-t border-slate-900 dark:border-white" />
            ))}
          </div>

          {months.length ? months.map((m, idx) => (
            <div key={m.month} className="relative flex-1 flex flex-col items-center gap-3 sm:gap-4 group">
              <div className="w-full flex items-end justify-center gap-0.5 sm:gap-2 h-[200px] sm:h-[240px]">
                {/* Income Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.income / maxAmount) * 100}%` }}
                  transition={{ delay: idx * 0.1, duration: 1 }}
                  className="w-1/3 min-w-[8px] sm:min-w-[12px] bg-amber-500 rounded-t-md sm:rounded-t-lg relative group/bar"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    ${m.income.toLocaleString()}
                  </div>
                </motion.div>
                
                {/* Expense Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.expense / maxAmount) * 100}%` }}
                  transition={{ delay: idx * 0.1 + 0.1, duration: 1 }}
                  className="w-1/3 min-w-[8px] sm:min-w-[12px] bg-slate-300 dark:bg-slate-600 rounded-t-md sm:rounded-t-lg relative group/bar"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    ${m.expense.toLocaleString()}
                  </div>
                </motion.div>
              </div>
              
              <div className="text-center">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{m.month}</p>
              </div>
            </div>
          )) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <p className="text-slate-500 dark:text-slate-400 italic text-sm">No monthly data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-3xl p-6 sm:p-8 group hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-all shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">Financial Efficiency</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm sm:text-base">
            Analyzing your income stream stability against fixed allocation costs helps maintain a higher savings percentage.
          </p>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold group-hover:gap-4 transition-all text-sm sm:text-base cursor-pointer">
            <span>Review Growth Strategy</span>
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 group hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-400 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">Spending Patterns</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm sm:text-base">
            Detected recurring expenditures. Optimizing these small monthly outflows can lead to significant long-term capital accumulation.
          </p>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400 font-bold group-hover:gap-4 transition-all text-sm sm:text-base cursor-pointer">
            <span>Explore Cost Optimization</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
