import React from 'react';

export default function ResumeThumbnail({ template }) {
  // We determine layout based on template.layout which we set earlier.
  // "flex flex-col" -> single column
  // "grid-cols-2" -> 50/50 two columns
  // "grid-cols-3" -> 33/66 split (sidebar)

  const isDark = template.image.includes('#0f172a') || template.image.includes('#1e293b') || template.image.includes('#000000') || template.image.includes('#171717');
  
  const baseTextColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const headingColor = isDark ? 'text-white' : 'text-black';
  const mutedTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  
  // Render dummy experience items
  const renderExperience = (count = 2) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mb-1.5">
        <div className="flex justify-between items-baseline mb-0.5">
          <div className={`text-[6px] font-bold ${headingColor}`}>Senior Position</div>
          <div className={`text-[4px] ${mutedTextColor}`}>2020 - Present</div>
        </div>
        <div className={`text-[5px] ${template.textColor} font-medium mb-0.5 opacity-80`}>Company Name</div>
        <ul className={`text-[4px] ${baseTextColor} leading-tight pl-2 list-disc opacity-70`}>
          <li>Led a team of developers to build scalable applications.</li>
          <li>Improved system performance by 40% using modern tech.</li>
        </ul>
      </div>
    ));
  };

  // Render dummy education
  const renderEducation = () => (
    <div className="mb-1.5">
      <div className={`text-[6px] font-bold ${headingColor}`}>University of Technology</div>
      <div className={`text-[5px] ${template.textColor} font-medium opacity-80`}>B.S. in Computer Science</div>
      <div className={`text-[4px] ${mutedTextColor}`}>2016 - 2020</div>
    </div>
  );

  // Render dummy skills
  const renderSkills = () => (
    <div className="flex flex-wrap gap-1 mt-1">
      {['React', 'Node.js', 'Tailwind CSS', 'Figma', 'TypeScript', 'MongoDB'].map(skill => (
        <span key={skill} className={`text-[3.5px] px-1 py-0.5 rounded-sm ${template.accent} text-white`}>
          {skill}
        </span>
      ))}
    </div>
  );

  const renderHeader = () => (
    <div className={`pb-2 mb-2 border-b ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <div className={`text-[12px] font-extrabold uppercase tracking-wider ${headingColor}`}>Alex Morgan</div>
      <div className={`text-[6px] ${template.textColor} font-semibold mb-1 opacity-90`}>Professional Title</div>
      <div className={`text-[4px] ${mutedTextColor} flex gap-2`}>
        <span>contact@email.com</span>
        <span>•</span>
        <span>+1 (555) 123-4567</span>
        <span>•</span>
        <span>New York, NY</span>
      </div>
    </div>
  );

  if (template.layout === 'flex flex-col') {
    return (
      <div className="absolute inset-2 p-3 bg-white/5 backdrop-blur-sm shadow-sm rounded-lg overflow-hidden flex flex-col transition-all duration-300">
        {renderHeader()}
        <div className="flex-1">
          <div className={`text-[7px] font-bold ${headingColor} mb-1 uppercase tracking-wide`}>Summary</div>
          <p className={`text-[4px] ${baseTextColor} leading-relaxed mb-2 opacity-80`}>
            Results-driven professional with 5+ years of experience in delivering high-quality solutions. Proven track record of improving metrics and leading successful teams.
          </p>

          <div className={`text-[7px] font-bold ${headingColor} mb-1 uppercase tracking-wide`}>Experience</div>
          {renderExperience(3)}

          <div className={`text-[7px] font-bold ${headingColor} mt-2 mb-1 uppercase tracking-wide`}>Education</div>
          {renderEducation()}
        </div>
      </div>
    );
  }

  if (template.layout === 'grid-cols-2') {
    return (
      <div className="absolute inset-2 p-3 bg-white/5 backdrop-blur-sm shadow-sm rounded-lg overflow-hidden flex flex-col transition-all duration-300">
        {renderHeader()}
        <div className="flex flex-1 gap-2">
          <div className="w-1/2">
            <div className={`text-[7px] font-bold ${headingColor} mb-1 uppercase tracking-wide`}>Experience</div>
            {renderExperience(3)}
          </div>
          <div className="w-1/2">
            <div className={`text-[7px] font-bold ${headingColor} mb-1 uppercase tracking-wide`}>Summary</div>
            <p className={`text-[4px] ${baseTextColor} leading-relaxed mb-2 opacity-80`}>
              Results-driven professional with 5+ years of experience in delivering high-quality solutions.
            </p>

            <div className={`text-[7px] font-bold ${headingColor} mb-1 uppercase tracking-wide`}>Skills</div>
            {renderSkills()}
            
            <div className={`text-[7px] font-bold ${headingColor} mt-2 mb-1 uppercase tracking-wide`}>Education</div>
            {renderEducation()}
          </div>
        </div>
      </div>
    );
  }

  // default to grid-cols-3 (sidebar style)
  return (
    <div className="absolute inset-2 shadow-sm rounded-lg overflow-hidden flex transition-all duration-300">
      {/* Sidebar */}
      <div className={`w-1/3 p-2 h-full ${isDark ? 'bg-black/20' : 'bg-black/5'}`}>
        <div className={`w-8 h-8 rounded-full ${template.accent} mx-auto mb-2`} />
        
        <div className={`text-[5px] font-bold ${headingColor} mb-1 uppercase`}>Contact</div>
        <div className={`text-[3.5px] ${baseTextColor} mb-2 leading-tight space-y-0.5 opacity-80`}>
          <div>alex@email.com</div>
          <div>555-123-4567</div>
          <div>New York, NY</div>
        </div>

        <div className={`text-[5px] font-bold ${headingColor} mb-1 uppercase mt-2`}>Skills</div>
        <div className={`text-[4px] ${baseTextColor} leading-tight opacity-80`}>
          <div>JavaScript</div>
          <div>React / Next.js</div>
          <div>Tailwind CSS</div>
          <div>UI/UX Design</div>
        </div>
        
        <div className={`text-[5px] font-bold ${headingColor} mb-1 uppercase mt-2`}>Education</div>
        <div className={`text-[4px] ${baseTextColor} leading-tight opacity-80`}>
          <div className="font-bold">B.S. Comp Sci</div>
          <div>Univ of Tech</div>
          <div>2016-2020</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`w-2/3 p-2 h-full ${isDark ? 'bg-white/5' : 'bg-white/50 backdrop-blur-sm'}`}>
        <div className={`text-[12px] font-extrabold uppercase tracking-wider ${headingColor}`}>Alex Morgan</div>
        <div className={`text-[6px] ${template.textColor} font-semibold mb-2 opacity-90`}>Professional Title</div>
        
        <div className={`text-[6px] font-bold ${headingColor} mb-0.5 uppercase tracking-wide border-b ${isDark ? 'border-white/10' : 'border-black/10'} pb-0.5`}>Profile</div>
        <p className={`text-[4px] ${baseTextColor} leading-relaxed mb-2 opacity-80`}>
          Creative and detail-oriented professional with a passion for building beautiful user interfaces.
        </p>

        <div className={`text-[6px] font-bold ${headingColor} mb-0.5 uppercase tracking-wide border-b ${isDark ? 'border-white/10' : 'border-black/10'} pb-0.5`}>Experience</div>
        {renderExperience(2)}
      </div>
    </div>
  );
}
