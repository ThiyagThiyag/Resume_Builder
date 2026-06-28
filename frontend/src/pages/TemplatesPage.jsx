import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { templates } from '../data/templates';
import ResumeThumbnail from '../components/ResumeThumbnail';

export default function TemplatesPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Professional', 'Minimal', 'Creative'];

  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(t => t.category === filter);

  return (
    <motion.div 
      className="min-h-screen bg-background pt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">All Templates</h1>
          <p className="text-xl text-slate-600 mb-8">Browse our complete collection of professionally designed resumes.</p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === cat 
                  ? 'bg-brand text-white shadow-lg shadow-brand/30 border border-brand' 
                  : 'bg-surface border border-border text-slate-500 hover:text-slate-900 hover:border-slate-400 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div 
              key={`${template.name}-${index}`}
              className="group relative cursor-pointer flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
            >
              <div className="p-2 rounded-2xl bg-surface/50 border border-border/50 hover:bg-surface hover:border-brand/50 transition-all duration-300">
                <div className="aspect-[1/1.4] w-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-brand/20 transition-all duration-500 relative" style={{ background: template.image }}>
                  {/* Resume Mockup UI */}
                  <ResumeThumbnail template={template} />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link to={`/builder?templateId=${template.id}`} className="bg-brand text-white px-4 py-2 text-xs rounded-lg font-bold shadow-lg shadow-brand/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center px-1 flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-700 group-hover:text-brand transition-colors truncate w-full">{template.name}</h3>
                <span className="text-[10px] uppercase tracking-wider text-brand font-semibold mt-1 bg-brand/10 px-2 py-0.5 rounded-sm">{template.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No templates found for this category.
          </div>
        )}
      </main>
    </motion.div>
  );
}
