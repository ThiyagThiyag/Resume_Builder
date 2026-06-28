import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layout, Download, Settings, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Layout size={32} />,
      title: "Holographic Templates",
      description: "Choose from dozens of professionally designed templates that adapt to your content."
    },
    {
      icon: <Sparkles size={32} />,
      title: "AI-Powered Writing",
      description: "Get smart suggestions and rewrite your bullet points instantly using advanced NLP."
    },
    {
      icon: <Download size={32} />,
      title: "Universal Export",
      description: "Download as PDF, Web page, or export directly to JSON Resume standard."
    },
    {
      icon: <Settings size={32} />,
      title: "Micro-Tuning",
      description: "Adjust margins, line-heights, and font weights with sub-pixel precision."
    },
    {
      icon: <Zap size={32} />,
      title: "Real-time Sync",
      description: "Changes reflect instantly across all your devices without refreshing."
    },
    {
      icon: <Shield size={32} />,
      title: "Privacy First",
      description: "Your data is encrypted end-to-end. We never sell your resume data."
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-background pt-32 pb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header with 3D Image */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Next-generation <span className="text-gradient">Features</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-600 leading-relaxed mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We completely reimagined what a resume builder should be. Packed with futuristic tools, AI assistance, and seamless design systems to help you land your dream job faster.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/templates" className="btn-primary inline-block">Explore Templates</Link>
            </motion.div>
          </div>

          <motion.div 
            className="flex-1 relative perspective-1000"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-slate-200 bg-white/50 p-2 backdrop-blur-md">
              <img src="/feature.webp" alt="Futuristic Features" className="w-full h-auto rounded-2xl" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/30 blur-3xl rounded-full -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full -z-10"></div>
            </div>
          </motion.div>
        </div>

        {/* 3D Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group perspective-1000"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="h-full bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 relative overflow-hidden"
                whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glowing Background Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/10 to-purple-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-brand/20 transition-all duration-500"></div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center rounded-2xl mb-6 text-brand shadow-inner border border-white relative z-10 transform translate-z-12 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 relative z-10 transform translate-z-8">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed relative z-10 transform translate-z-4">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
