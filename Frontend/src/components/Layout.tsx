import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  PieChart, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth, type Role } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC = () => {
  const { role, setRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Transactions', icon: History, path: '/history' },
    { label: 'Analytics', icon: PieChart, path: '/analytics' },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center rounded-xl shadow-inner">
          <ShieldCheck size={24} className="drop-shadow-md" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Editorial</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold">Finance</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group",
              isActive 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
               "transition-transform group-hover:scale-110",
            )} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Utilities Base */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        {/* Role Simulator */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/50">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-500 font-bold mb-3 pl-1">Simulate Role</p>
          <div className="flex bg-slate-200 dark:bg-slate-950 p-1 rounded-xl">
            {(['admin', 'analyst', 'viewer'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                  role === r
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                )}
              >
                {r.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle & Logout */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>Theme</span>
          </button>
          
          <button className="flex items-center justify-center p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      
      {/* Mobile Top Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center rounded-lg">
             <ShieldCheck size={18} />
           </div>
           <span className="font-bold text-slate-900 dark:text-white">Editorial</span>
        </div>
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0A0F1C] border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-white dark:bg-[#0A0F1C] border-r border-slate-200 dark:border-slate-800 flex-col shadow-xl z-10 transition-colors duration-300">
        {sidebarContent}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
