import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldCheck, 
  LogIn, 
  ArrowRight,
  Wallet,
  Globe,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Intelligent Tracking",
      desc: "Log income and expenses with precise categorization and real-time balance updates.",
      icon: Wallet,
      color: "amber"
    },
    {
      title: "Advanced Analytics",
      desc: "Visualize your financial growth through deep-dive monthly charts and allocation insights.",
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Enterprise RBAC",
      desc: "Simulate multi-user roles like Admin, Analyst, and Viewer with server-side enforcement.",
      icon: ShieldCheck,
      color: "slate"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 h-20 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center rounded-xl shadow-inner">
              <ShieldCheck size={24} className="drop-shadow-md" />
            </div>
            <span className="text-xl font-bold tracking-tight">Editorial Finance</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 border border-amber-500/20"
          >
            <Zap size={14} className="fill-amber-500" />
            <span>Next-Gen Finance Tracking</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 bg-clip-text text-transparent leading-[1.1]"
          >
            Manage Your Assets <br className="hidden lg:block" />
            With Absolute <span className="text-amber-500 font-serif italic">Clarity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Experience the most minimalist yet powerful tool to audit your cashflow, analyze spending, and ensure financial security. Built for developers by developers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-2xl shadow-amber-500/30 transition-all active:scale-95 text-lg flex items-center justify-center gap-2 group"
            >
              <span>Get Started Now</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/docs')}
              className="w-full sm:w-auto px-10 py-5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold rounded-2xl transition-all text-lg flex items-center justify-center gap-2"
            >
              <span>Read Documentation</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-[40px] hover:border-amber-500/50 transition-all shadow-sm flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 ${
                  f.color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600' :
                  f.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-950/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8 grayscale opacity-50">
            <Globe className="text-slate-500" />
            <span className="text-sm font-bold tracking-widest uppercase">Empowering Modern Finance</span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2026 Editorial Finance. Designed for Professional Portfolio Assignments.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
