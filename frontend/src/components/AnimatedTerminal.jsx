import React, { useState, useEffect, useRef } from 'react';

const codeLines = [
  "const resume = new ResumeBuilder();",
  "resume.setName('Alex Developer');",
  "resume.setRole('Full Stack Engineer');",
  "",
  "// Adding experience...",
  "resume.addExperience({",
  "  company: 'Tech Innovators Inc.',",
  "  position: 'Senior Engineer',",
  "  years: '2020 - Present',",
  "  highlights: [",
  "    'Built a scalable microservices architecture',",
  "    'Reduced latency by 40% using Redis caching',",
  "    'Mentored junior developers'",
  "  ]",
  "});",
  "",
  "// Adding skills...",
  "resume.addSkills([",
  "  'React', 'Node.js', 'TypeScript', 'GraphQL'",
  "]);",
  "",
  "// Compiling final output...",
  "const pdfOutput = resume.compile('pdf');",
  "console.log('✓ Resume successfully generated!');",
  "deployToVercel(pdfOutput);"
];

export default function AnimatedTerminal() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) {
      // Reset after a delay to loop continuously
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const currentLine = codeLines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = "";
          }
          newLines[currentLineIndex] += currentLine[currentCharIndex];
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, Math.random() * 30 + 10); // Fast typing speed
      
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = ""; // Ensure empty lines are at least empty strings
          }
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, currentLine === "" ? 200 : 400); // Delay between lines
      
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  return (
    <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-700/50 w-full h-[400px] flex flex-col relative z-10">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1e293b] border-b border-slate-800/50 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-xs font-mono text-slate-400">build_resume.js</div>
      </div>
      <div 
        ref={containerRef}
        className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-y-auto flex-1 text-slate-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {displayedLines.map((line, i) => {
          const safeLine = line || ""; // Guard against undefined
          return (
            <div key={i} className="min-h-[1.5rem] whitespace-pre">
              {safeLine.includes('//') ? (
                <span className="text-slate-500">{safeLine}</span>
              ) : safeLine.includes('✓') ? (
                <span className="text-green-400 font-bold">{safeLine}</span>
              ) : (
                <span>
                  {safeLine.split(/('[^']*')/).map((part, j) => {
                    if (part.startsWith("'") && part.endsWith("'")) {
                      return <span key={j} className="text-green-300">{part}</span>;
                    }
                    if (part === 'const ' || part === 'new ') {
                      return <span key={j} className="text-purple-400">{part}</span>;
                    }
                    return part;
                  })}
                </span>
              )}
            </div>
          );
        })}
        {/* Blinking cursor */}
        {currentLineIndex < codeLines.length && (
          <div className="inline-block w-2.5 h-5 bg-brand animate-pulse ml-1 align-middle rounded-sm"></div>
        )}
      </div>
    </div>
  );
}
