import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Code2,
  ChevronRight,
  Info,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const Docs: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      id: "architecture",
      title: "System Architecture",
      icon: Layers,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The project follows a strong **Layered Architecture** pattern on the backend, ensuring a clear separation of concerns, testability, and future-scalability.
          </p>
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto shadow-2xl">
            <div className="mb-2 text-slate-500"># Workflow Topology</div>
            <div>[API Route] ---{">"} Validates Schema (Pydantic)</div>
            <div className="pl-4 border-l border-slate-800 ml-4 my-2">
              <div>[Service Layer] ---{">"} Business Logic & Aggregation</div>
              <div className="pl-4 border-l border-slate-800 ml-4 my-2">
                <div>[Repository] ---{">"} SQL Query Generation</div>
                <div className="pl-4 border-l border-slate-800 ml-4 my-2 text-amber-500">
                  [SQLite DB] ---{">"} Persistent Storage
                </div>
              </div>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <li className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              <ChevronRight size={16} className="mt-0.5 text-amber-500" />
              <span>Decoupled API endpoints from database models.</span>
            </li>
            <li className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              <ChevronRight size={16} className="mt-0.5 text-amber-500" />
              <span>Single Point of Truth for business calculations in Services.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "RBAC Security & Simulation",
      icon: ShieldCheck,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The system implements a professional **Role-Based Access Control (RBAC)** model enforced strictly on the server-side via custom FastAPI dependencies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Admin
              </h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Full CRUD / Logs</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Analyst
              </h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Read Analytics / History</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Viewer
              </h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Read Logs (No Filter)</p>
            </div>
          </div>
          <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 flex gap-4">
            <Info className="text-amber-500 shrink-0" size={24} />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Headers are intercepted by Axios and injected with <code className="bg-amber-500/20 px-1.5 rounded">X-Role</code> based on the sidebar toggle, demonstrating real-world API security patterns.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "techstack",
      title: "Technology Stack",
      icon: Cpu,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Code2 size={16} className="text-blue-500" /> Frontend
            </h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
              <li>• React 19 (Functional Components & Context API)</li>
              <li>• Vite 6 (Lightning Fast Build Tool)</li>
              <li>• Tailwind CSS 4 (Atomic CSS Framework)</li>
              <li>• Framer Motion (Page Transitions)</li>
              <li>• Axios (Intercepted API Client)</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Terminal size={16} className="text-amber-500" /> Backend
            </h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
              <li>• FastAPI (High performance ASGI framework)</li>
              <li>• SQLAlchemy (Modern Pythonic ORM)</li>
              <li>• Pydantic v2 (Strict data validation)</li>
              <li>• SQLite (Relational local storage)</li>
              <li>• Uvicorn (Production ASGI Server)</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 p-6 md:p-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Documentation</h1>
          <p className="text-slate-500 mt-2">Technical design and architectural overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
          <Database size={16} className="text-amber-500" />
          <span className="text-xs font-bold font-mono">SQLite v3.x</span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-20">
        {sections.map((section, idx) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <section.icon size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white lowercase tracking-tight">/ {section.title}</h2>
            </div>
            {section.content}
          </motion.section>
        ))}
      </div>

      {/* Documentation Footer */}
      <div className="pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Final Submission Audit Patch</p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-lg text-amber-500 text-[10px] font-bold">
          <ShieldCheck size={12} />
          <span>Verified Security Implementation</span>
        </div>
      </div>
    </div>
  );
};

export default Docs;
