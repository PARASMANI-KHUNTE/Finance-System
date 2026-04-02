import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  PieChart, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth, type Role } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { role, setRole } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-emerald-500 text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col px-4 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-xl">EF</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Editorial Finance</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  "group-hover:text-emerald-400"
                )} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Role Switcher (Simulation) */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="px-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                <ShieldCheck size={14} />
                <span>Simulate Role</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(['admin', 'analyst', 'viewer'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm text-left capitalize transition-all",
                      role === r 
                        ? "bg-slate-800 text-white font-medium ring-1 ring-emerald-500/50" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
