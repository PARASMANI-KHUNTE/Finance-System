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
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const months = data?.monthly_totals || [];
  const maxAmount = Math.max(...months.map(m => Math.max(m.income, m.expense)), 100);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Insights & Analytics
        </h1>
        <p className="text-slate-500 mt-1">Deep dive into your monthly spending patterns.</p>
      </div>

      {/* Monthly Chart Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Monthly Comparison</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400 font-medium">Expense</span>
            </div>
          </div>
        </div>

        <div className="relative h-[300px] flex items-end justify-between gap-4 sm:gap-8 px-4">
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-[0.05] pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full border-t border-white" />
            ))}
          </div>

          {months.length ? months.map((m, idx) => (
            <div key={m.month} className="relative flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-[240px]">
                {/* Income Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.income / maxAmount) * 100}%` }}
                  transition={{ delay: idx * 0.1, duration: 1 }}
                  className="w-1/3 min-w-[12px] bg-emerald-500 rounded-t-lg relative group/bar"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    ${m.income.toLocaleString()}
                  </div>
                </motion.div>
                
                {/* Expense Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.expense / maxAmount) * 100}%` }}
                  transition={{ delay: idx * 0.1 + 0.1, duration: 1 }}
                  className="w-1/3 min-w-[12px] bg-blue-500 rounded-t-lg relative group/bar"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    ${m.expense.toLocaleString()}
                  </div>
                </motion.div>
              </div>
              
              <div className="text-center">
                <p className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">{m.month}</p>
              </div>
            </div>
          )) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <p className="text-slate-400 italic">No monthly data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 group hover:bg-emerald-500/10 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">Financial Efficiency</h3>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            Analyzing your income stream stability against fixed allocation costs helps maintain a higher savings percentage.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold group-hover:gap-4 transition-all">
            <span>Review Growth Strategy</span>
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 group hover:bg-blue-500/10 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">Spending Patterns</h3>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            Detected recurring expenditures. Optimizing these small monthly outflows can lead to significant long-term capital accumulation.
          </p>
          <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
            <span>Explore Cost Optimization</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
