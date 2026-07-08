import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Star, Users, Briefcase, Zap } from 'lucide-react';
import { templates } from '../data/templates';
import ResumeThumbnail from '../components/ResumeThumbnail';
import AnimatedTerminal from '../components/AnimatedTerminal';
import ResumeBurst from '../components/ResumeBurst';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <motion.div 
      className="min-h-screen pt-24 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand z-[9999]"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Animated Background Orbs */}
      <motion.div
        className="fixed top-20 left-10 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] pointer-events-none -z-10"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="fixed bottom-20 right-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-10 pb-12 md:pt-16 md:pb-16 flex flex-col md:flex-row items-center gap-12 relative">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/20 text-brand font-semibold mb-8 shadow-sm backdrop-blur-sm"
            >
              <Zap size={16} className="text-yellow-500" /> Resumify 2.0 is Live
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight flex flex-wrap justify-center md:justify-start gap-x-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {["Build", "a", "winning", "resume", "in"].map((word, i) => (
                <motion.span 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span 
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.5 } }
                }}
                className="text-gradient inline-block"
              >
                minutes
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto md:mx-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stand out from the crowd with our dynamic, interactive resume builder.
              Crafted for modern professionals who want to make an impact.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/builder" className="btn-primary w-full sm:w-auto group inline-flex justify-center items-center">
                Create Your Resume <ChevronRight className="inline-block ml-1 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link to="/templates" className="btn-secondary w-full sm:w-auto inline-flex justify-center items-center">
                View Templates
              </Link>
            </motion.div>
          </div>

          {/* Hero Terminal */}
          <motion.div
            className="flex-1 w-full max-w-lg md:max-w-none relative z-10"
            initial={{ opacity: 0, scale: 0.8, rotateY: 25 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: "spring", delay: 0.3 }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
              transition={{ type: "spring" }}
            >
              <AnimatedTerminal />
            </motion.div>
            {/* Floating aesthetic elements */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
          </motion.div>
        </section>

        <ResumeBurst />

        {/* How It Works Section */}
        <section className="py-10 md:py-12 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-base text-slate-600 max-w-2xl mx-auto">Three simple steps to generate a pristine, ATS-friendly resume powered by artificial intelligence.</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div
                className="flex-1 space-y-8"
                style={{ y: y1 }}
              >
                {[
                  { step: '01', title: 'Connect Data', desc: 'Import from LinkedIn, GitHub, or paste your raw text. Our AI parses everything instantly.' },
                  { step: '02', title: 'Select Template', desc: 'Choose from our library of 24+ professional layouts designed by recruiters.' },
                  { step: '03', title: 'Generate & Export', desc: 'Review the AI-enhanced output, customize the design, and download as PDF.' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 relative overflow-hidden"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand/5 to-purple-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-brand/10 transition-all duration-500"></div>
                    <div className="text-4xl font-black text-slate-100 group-hover:text-brand/10 transition-colors absolute -top-2 -left-2 -z-10">{item.step}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex-1 relative perspective-1000"
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white"
                  whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img src="/how_it_works.webp" alt="AI Processing" className="w-full h-auto" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Templates Showcase Section */}
        {/* <section className="bg-slate-900 py-10 md:py-12 border-t border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex justify-between items-end mb-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-3 text-white">Stunning Templates</h2>
                <p className="text-base text-slate-400">Designed by HR experts, tailored for your industry.</p>
              </motion.div>
              <Link to="/templates" className="hidden md:flex items-center gap-2 text-brand hover:text-brand-hover font-semibold transition-colors">
                View all templates <ChevronRight size={20} />
              </Link>
            </div>

            <div className="flex justify-center items-center h-[500px] perspective-[2000px] mb-12">
              {templates.slice(0, 5).map((template, index) => {
                const isCenter = index === 2;
                const offset = index - 2;

                return (
                  <motion.div
                    key={template.id}
                    className="absolute w-[280px] md:w-[320px] cursor-pointer group"
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    animate={{
                      x: offset * 180,
                      z: isCenter ? 150 : -Math.abs(offset) * 150,
                      rotateY: -offset * 15,
                      scale: isCenter ? 1.1 : 0.9,
                      opacity: isCenter ? 1 : 0.5,
                    }}
                    whileHover={isCenter ? { scale: 1.15, z: 200 } : {}}
                    transition={{ duration: 0.6, type: "spring" }}
                    style={{ zIndex: isCenter ? 10 : 5 - Math.abs(offset) }}
                  >
                    <div className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-sm group-hover:border-brand/50 transition-colors duration-300">
                      <div className="aspect-[1/1.4] w-full rounded-xl overflow-hidden shadow-2xl relative" style={{ background: template.image }}>
                        <ResumeThumbnail template={template} />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <Link to={`/builder?templateId=${template.id}`} className="bg-brand text-white px-6 py-2 rounded-lg font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                            Use Template
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center px-1">
                      <h3 className={`text-lg font-bold transition-colors ${isCenter ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{template.name}</h3>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section> */}

        {/* Advanced Capabilities Teaser */}
        <section className="bg-slate-50 py-10 md:py-12 border-t border-border/50 relative">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-4 text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              More than just a builder
            </motion.h2>
            <motion.p
              className="text-base text-slate-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Discover holographic template projections, automated CI/CD API deployments, and a robust suite of futuristic tools.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/features" className="btn-primary inline-flex justify-center items-center">
                Explore All Features
              </Link>
              <Link to="/developers" className="btn-secondary inline-flex justify-center items-center">
                Developer API
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section (Moved Lower & Compact) */}
        <section className="border-y border-slate-200/50 bg-white/50 backdrop-blur-md py-6 relative z-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: <Users className="text-blue-500 mx-auto mb-1" size={20} />, count: "100k+", label: "Active Users" },
              { icon: <Briefcase className="text-purple-500 mx-auto mb-1" size={20} />, count: "50k+", label: "Hired Candidates" },
              { icon: <Star className="text-yellow-500 mx-auto mb-1" size={20} />, count: "4.9/5", label: "User Rating" },
              { icon: <CheckCircle2 className="text-green-500 mx-auto mb-1" size={20} />, count: "24+", label: "Pro Templates" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {stat.icon}
                <div className="text-xl font-bold text-slate-900 leading-tight">{stat.count}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-12 text-center">
          <motion.div
            className="bg-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-500/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 relative z-10">Ready to land your dream job?</h2>
            <p className="text-slate-600 text-base mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of users who have successfully transformed their careers.
            </p>
            <Link to="/builder" className="btn-primary relative z-10 inline-block">
              Get Started for Free
            </Link>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}
