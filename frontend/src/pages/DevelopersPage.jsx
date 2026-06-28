import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, GitBranch, Key, Cpu, Zap } from 'lucide-react';

export default function DevelopersPage() {
  return (
    <motion.div 
      className="min-h-screen bg-slate-50 pt-32 pb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header with Futuristic Image */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-24">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold mb-6 border border-slate-300 shadow-sm">
              <Terminal size={16} className="text-brand" /> API v2 Now Available
            </div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Code your career with our <span className="text-gradient">JSON API</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 leading-relaxed mb-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              For the engineers who prefer the terminal. Build, update, and deploy your resume using our comprehensive REST API. Automate everything from rendering PDFs to syncing your GitHub portfolio.
            </motion.p>
          </div>

          <motion.div 
            className="flex-1 relative perspective-1000 w-full"
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ rotateY: -10, rotateX: 5, scale: 1.05 }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-slate-200 bg-white p-2">
              <img src="/developer.webp" alt="Developer Terminal" className="w-full h-auto rounded-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 blur-3xl rounded-full -z-10 mix-blend-multiply"></div>
            </div>
          </motion.div>
        </div>

        {/* Developer Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: <Code2 />, title: "JSON Schema Standard", desc: "Define your entire resume in a strict, typed JSON format. Validate instantly before deployment." },
            { icon: <GitBranch />, title: "CI/CD Integration", desc: "Hook up GitHub Actions to automatically deploy PDF changes whenever you merge to main." },
            { icon: <Key />, title: "API Keys & Webhooks", desc: "Generate secure tokens to update your resume content dynamically from other applications." },
            { icon: <Cpu />, title: "Headless Rendering", desc: "Use our backend engine to render templates directly into React components or raw HTML." },
            { icon: <Terminal />, title: "CLI Tooling", desc: "Install `resumify-cli` to build, preview, and test your resume locally in your terminal." },
            { icon: <Zap />, title: "GraphQL Layer", desc: "Query exactly the specific experience or skills data you need for your personal website." }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 bg-slate-100 text-brand rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
