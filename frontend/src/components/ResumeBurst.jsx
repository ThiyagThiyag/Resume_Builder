import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { templates } from '../data/templates';
import ResumeThumbnail from './ResumeThumbnail';

export default function ResumeBurst() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Instantly clear the entire burst when scrolling away from the section
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const burstTemplates = templates.slice(0, 10);

  // Targets to spread across the ENTIRE screen
  const targets = [
    { x: -700, y: -400, rotate: -15, scale: 1.2, zIndex: 5 },
    { x: 700, y: -350, rotate: 25, scale: 1.1, zIndex: 4 },
    { x: -500, y: 350, rotate: -25, scale: 1.3, zIndex: 3 },
    { x: 500, y: 400, rotate: 15, scale: 1.15, zIndex: 6 },
    { x: -300, y: -450, rotate: -8, scale: 1, zIndex: 2 },
    { x: 300, y: -420, rotate: 22, scale: 1.05, zIndex: 1 },
    { x: -350, y: 450, rotate: -18, scale: 1.25, zIndex: 7 },
    { x: 350, y: 380, rotate: 8, scale: 1.2, zIndex: 8 },
    { x: -800, y: 0, rotate: -35, scale: 1.1, zIndex: 2 },
    { x: 800, y: -50, rotate: 35, scale: 1.35, zIndex: 3 },
  ];

  return (
    <motion.section 
      ref={containerRef} 
      style={{ opacity: sectionOpacity }}
      className="relative h-[20vh] w-full flex items-center justify-center bg-transparent my-10"
    >
      
      {/* We don't use overflow-hidden because we WANT them to burst completely out of this tiny section and cover the screen */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-40">
        
        {burstTemplates.map((template, index) => {
          const target = targets[index];
          
          // Initial horizontal stack
          // They start perfectly horizontal, overlapping in the center
          const initialX = (index * 30) - 135; 
          
          return (
            <motion.div
              key={template.id}
              className="absolute shadow-[0_15px_40px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden border border-slate-200 bg-white"
              style={{
                zIndex: target.zIndex,
                width: 200, 
                height: 280, // 1:1.4 aspect ratio
              }}
              // Animation triggers automatically when you scroll to this section
              initial={{ 
                x: initialX, 
                y: 0, 
                rotate: 0, 
                scale: 0.3,
                opacity: 0
              }}
              whileInView={{ 
                x: target.x, 
                y: target.y, 
                rotate: target.rotate, 
                scale: target.scale,
                opacity: 1
              }}
              // Reset the animation every time it comes into view
              viewport={{ once: false, margin: "-100px" }}
              transition={{
                duration: 1.2, // Faster base duration
                type: "spring",
                bounce: 0.3,
                delay: index * 0.08 // Tighter staggered effect keeps total time under 2 seconds
              }}
            >
              <div className="w-full h-full pointer-events-none opacity-100" style={{ background: template.image }}>
                <ResumeThumbnail template={template} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
