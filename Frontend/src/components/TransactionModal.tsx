import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialData 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        type: initialData.type,
        category: initialData.category,
        notes: initialData.notes || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      if (initialData) {
        await api.put(`/transactions/${initialData.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {initialData ? 'Update Record' : 'Log Transaction'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800/50">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all",
                      formData.type === t 
                        ? "bg-slate-800 text-white shadow-lg" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Amount ($)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className={cn(
                        "w-full bg-slate-950 border rounded-xl py-3 px-4 text-white focus:outline-none transition-all",
                        errors.amount ? "border-rose-500 ring-4 ring-rose-500/10" : "border-slate-800 focus:border-emerald-500"
                      )}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    {errors.amount && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 group">
                        <AlertCircle size={18} />
                      </div>
                    )}
                  </div>
                  {errors.amount && <p className="text-xs text-rose-500 pl-1">{errors.amount}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Salary, Utilities, Subscriptions"
                    className={cn(
                      "w-full bg-slate-950 border rounded-xl py-3 px-4 text-white focus:outline-none transition-all",
                      errors.category ? "border-rose-500" : "border-slate-800 focus:border-emerald-500"
                    )}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                  {errors.category && <p className="text-xs text-rose-500 pl-1">{errors.category}</p>}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description (Opt)</label>
                  <textarea 
                    placeholder="Add a memo..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-all min-h-[100px] resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 text-white">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-2 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : (
                    <>
                      <Save size={20} />
                      <span>{initialData ? 'Update Record' : 'Save Record'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
