import React, { useRef, useState, useEffect } from 'react';
import { Wand2, Loader2, Sparkles, Move, Trash2 } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

export default function ResumePreview({ template, data, onEdit, onRemove, onReorder, onSectionToggle, onSectionReorder }) {
  const isDark = template.image.includes('#0f172a') || template.image.includes('#1e293b') || template.image.includes('#000000') || template.image.includes('#171717');
  
  const baseTextColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const headingColor = isDark ? 'text-white' : 'text-black';
  const mutedTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const borderColor = isDark ? 'border-white/10' : 'border-black/10';

  const themeStyle = data.theme || {
    color: '#4f46e5',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    spacing: 'normal'
  };

  const getSpacingClass = () => {
    switch(themeStyle.spacing) {
      case 'compact': return 'gap-2';
      case 'relaxed': return 'gap-8';
      case 'normal':
      default: return 'gap-4';
    }
  };

  const gapClass = getSpacingClass();

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onEdit('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const EditableText = ({ text, fieldPath, placeholder, className, isMultiline }) => (
    <span 
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onEdit(fieldPath, e.currentTarget.textContent)}
      className={`outline-none hover:bg-black/5 focus:bg-black/10 dark:hover:bg-white/10 dark:focus:bg-white/20 px-1 -mx-1 rounded transition-colors cursor-text inline-block min-w-[20px] empty:before:content-[attr(data-placeholder)] empty:before:opacity-50 empty:before:italic empty:before:pointer-events-none ${className || ''}`}
      style={{ whiteSpace: isMultiline ? 'pre-wrap' : 'normal' }}
      data-placeholder={placeholder}
    >
      {text}
    </span>
  );

  const [activeAiSection, setActiveAiSection] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async (sectionId) => {
    setIsGenerating(true);
    // Simulate AI API call
    setTimeout(() => {
      // Find the corresponding text field path and update it with mock AI data
      let fieldPath = sectionId;
      if (sectionId === 'experience' || sectionId === 'education' || sectionId === 'projects') {
        fieldPath = `${sectionId}.0.desc`;
      } else if (sectionId === 'summary' || sectionId === 'skills' || sectionId === 'custom') {
        fieldPath = sectionId === 'custom' ? 'customBlock' : sectionId;
      }
      
      onEdit(fieldPath, `✨ [AI Generated]: Enhanced and optimized text for your ${sectionId} section. This text was automatically written by the AI assistant to sound more professional and impactful. ✨`);
      setIsGenerating(false);
      setActiveAiSection(null);
    }, 1500);
  };

  const DraggableSection = ({ sectionId, children }) => {
    const dragControls = useDragControls();
    if (!data.sectionVisibility || !data.sectionVisibility[sectionId]) return null;

    return (
      <motion.div 
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        className={`relative group/section border-2 p-4 -mx-4 rounded-xl transition-all mb-4 border-transparent hover:border-indigo-500 hover:border-dashed hover:bg-indigo-50/30`}
        onMouseLeave={() => {
          if(activeAiSection !== sectionId) setActiveAiSection(null);
        }}
      >
        {/* Hover Controls for Section (Canva Style Toolbar) */}
        <div className={`absolute -top-10 right-0 bg-white shadow-xl rounded-lg border border-slate-200 p-1 flex items-center gap-1 z-50 transition-all transform origin-bottom ${activeAiSection === sectionId ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none group-hover/section:opacity-100 group-hover/section:scale-100 group-hover/section:pointer-events-auto'}`}>
          <div className="relative">
            <button 
              onClick={() => setActiveAiSection(activeAiSection === sectionId ? null : sectionId)}
              className={`bg-indigo-50 border border-indigo-100 shadow-md rounded-md p-1.5 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors ${activeAiSection === sectionId ? 'bg-indigo-500 text-white' : ''}`}
              title={`AI Magic Rewrite for ${sectionId}`}
            >
              <Wand2 size={16} />
            </button>
            
            {/* AI Popover */}
            {activeAiSection === sectionId && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col text-sm text-left">
                <div className="px-3 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wide">
                  <Sparkles size={14} /> AI Assistant
                </div>
                <button 
                  onClick={() => handleAiGenerate(sectionId)}
                  disabled={isGenerating}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
                  Improve Writing
                </button>
                <button 
                  onClick={() => handleAiGenerate(sectionId)}
                  disabled={isGenerating}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 disabled:opacity-50"
                >
                  Make Professional
                </button>
                <button 
                  onClick={() => handleAiGenerate(sectionId)}
                  disabled={isGenerating}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
                >
                  Fix Grammar
                </button>
              </div>
            )}
          </div>

          <div 
            className="bg-white border border-slate-200 shadow-md rounded-md p-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" 
            title={`Drag to move ${sectionId}`}
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: "none" }}
          >
            <Move size={16} />
          </div>
          <button onClick={() => onSectionToggle(sectionId)} className="bg-red-50 border border-red-100 shadow-md rounded-md p-1.5 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title={`Delete ${sectionId} section`}>
            <Trash2 size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    );
  };

  const renderAvatar = (sizeClasses = "w-20 h-20 mb-8") => (
    <div 
      className={`${sizeClasses} rounded-full shadow-md cursor-pointer relative overflow-hidden group/avatar flex items-center justify-center border-2 border-white/20 hover:border-brand/50 transition-colors bg-black/10`}
      onClick={() => fileInputRef.current?.click()}
    >
      {data.image ? (
        <img src={data.image} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full ${template.accent} flex items-center justify-center`}>
          <span className="text-white/70 text-xs font-bold text-center px-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity">Add Photo</span>
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />
    </div>
  );
  
  const DraggableItem = ({ children, onRemove, isTimeline, index, arrayLength, template }) => {
    const dragControls = useDragControls();
    return (
      <motion.div 
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        className={`mb-6 relative group/item border-2 border-transparent hover:border-indigo-500 hover:border-dashed hover:bg-indigo-50/30 p-2 pt-8 -mx-2 rounded-xl transition-all ${isTimeline ? 'pl-8' : ''}`}
      >
        {isTimeline && (
          <>
            <div className={`absolute left-[7px] top-[40px] bottom-[-40px] w-px ${template.accent} opacity-30 ${index === arrayLength - 1 ? 'hidden' : ''}`} />
            <div className={`absolute left-0 top-[44px] w-[15px] h-[15px] rounded-full border-4 border-white shadow-sm ${template.accent}`} />
          </>
        )}
        
        {/* Canva Style Toolbar */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md border border-slate-200 p-1 flex items-center gap-1 z-50 transition-all opacity-0 scale-95 pointer-events-none group-hover/item:opacity-100 group-hover/item:scale-100 group-hover/item:pointer-events-auto">
          <div 
            className="bg-white border border-slate-200 shadow-sm rounded-md p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600" 
            title="Drag to move"
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: "none" }}
          >
            <Move size={14} />
          </div>
          <button onClick={onRemove} className="bg-red-50 border border-red-100 shadow-sm rounded-md p-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
        {children}
      </motion.div>
    );
  };

  const renderExperience = () => {
    const experienceData = (data.experience && data.experience.length > 0) 
      ? data.experience 
      : [{ title: '', company: '', date: '', desc: '' }];

    const isTimeline = template.layout?.includes('timeline');

    return experienceData.map((exp, i) => {
      const itemId = `exp-${i}`;
      return (
      <DraggableItem key={itemId} onRemove={() => onRemove(i, 'experience')} isTimeline={isTimeline} index={i} arrayLength={experienceData.length} template={template}>

        <div className="flex justify-between items-baseline mb-1">
          <div className={`text-base font-bold ${headingColor}`}>
            <EditableText text={exp.title} fieldPath={`experience.${i}.title`} placeholder="Job Title" />
          </div>
          <div className={`text-sm ${mutedTextColor}`}>
            <EditableText text={exp.date} fieldPath={`experience.${i}.date`} placeholder="Date Range" />
          </div>
        </div>
        <div className={`text-sm ${template.textColor} font-medium mb-2 opacity-80`}>
          <EditableText text={exp.company} fieldPath={`experience.${i}.company`} placeholder="Company Name" />
        </div>
        
        <div className={`text-xs ${baseTextColor} leading-relaxed opacity-80 pl-4 border-l-2 ${borderColor}`}>
          <EditableText 
            text={exp.desc} 
            fieldPath={`experience.${i}.desc`} 
            placeholder="Describe your responsibilities and achievements..." 
            isMultiline={true} 
            className="w-full"
          />
        </div>
      </DraggableItem>
      );
    });
  };

  const renderEducation = () => {
    const educationData = (data.education && data.education.length > 0) 
      ? data.education 
      : [{ school: '', degree: '', date: '' }];

    const isTimeline = template.layout?.includes('timeline');

    return educationData.map((edu, i) => {
      const itemId = `edu-${i}`;
      return (
      <DraggableItem key={itemId} onRemove={() => onRemove(i, 'education')} isTimeline={isTimeline} index={i} arrayLength={educationData.length} template={template}>

        <div className={`text-base font-bold ${headingColor}`}>
          <EditableText text={edu.school} fieldPath={`education.${i}.school`} placeholder="School/University" />
        </div>
        <div className={`text-sm ${template.textColor} font-medium opacity-80 mb-1`}>
          <EditableText text={edu.degree} fieldPath={`education.${i}.degree`} placeholder="Degree or Certification" />
        </div>
        <div className={`text-sm ${mutedTextColor}`}>
          <EditableText text={edu.date} fieldPath={`education.${i}.date`} placeholder="Year" />
        </div>
      </DraggableItem>
      );
    });
  };

  const renderProjects = () => {
    const projectsData = (data.projects && data.projects.length > 0) 
      ? data.projects 
      : [{ name: '', link: '', desc: '' }];

    return projectsData.map((proj, i) => {
      const itemId = `proj-${i}`;
      return (
      <DraggableItem key={itemId} onRemove={() => onRemove(i, 'projects')} isTimeline={false}>

        <div className="flex justify-between items-baseline mb-1">
          <div className={`text-base font-bold ${headingColor}`}>
            <EditableText text={proj.name} fieldPath={`projects.${i}.name`} placeholder="Project Name" />
          </div>
          <div className={`text-sm ${template.textColor} font-medium mb-2 opacity-80`}>
            <EditableText text={proj.link} fieldPath={`projects.${i}.link`} placeholder="Project Link" />
          </div>
        </div>
        
        <div className={`text-xs ${baseTextColor} leading-relaxed opacity-80 pl-4 border-l-2 ${borderColor}`}>
          <EditableText 
            text={proj.desc} 
            fieldPath={`projects.${i}.desc`} 
            placeholder="Describe the project..." 
            isMultiline={true} 
            className="w-full"
          />
        </div>
      </DraggableItem>
      );
    });
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-2 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.summary} fieldPath="headings.summary" placeholder="Summary" />
            </div>
            <div className={`text-sm ${baseTextColor} leading-relaxed opacity-90`}>
              <EditableText text={data.summary} fieldPath="summary" placeholder="Write a brief professional summary..." isMultiline={true} className="w-full" />
            </div>
          </>
        );
      case 'experience':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-4 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.experience} fieldPath="headings.experience" placeholder="Experience" />
            </div>
            {renderExperience()}
          </>
        );
      case 'education':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-4 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.education} fieldPath="headings.education" placeholder="Education" />
            </div>
            {renderEducation()}
          </>
        );
      case 'projects':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-4 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.projects} fieldPath="headings.projects" placeholder="Projects" />
            </div>
            {renderProjects()}
          </>
        );
      case 'skills':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-2 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.skills} fieldPath="headings.skills" placeholder="Skills" />
            </div>
            <div className="w-full">
              <EditableText 
                text={data.skills} 
                fieldPath="skills" 
                placeholder="Type your skills here, separated by commas" 
                isMultiline={true}
                className={`text-sm ${baseTextColor} w-full opacity-90`}
              />
            </div>
          </>
        );
      case 'custom':
        return (
          <>
            <div className={`text-lg font-bold ${headingColor} mb-2 uppercase tracking-wide`} style={{ color: themeStyle.color }}>
              <EditableText text={data.headings?.custom} fieldPath="headings.custom" placeholder="Custom Section" />
            </div>
            <div className="w-full">
              <EditableText 
                text={data.customBlock} 
                fieldPath="customBlock" 
                placeholder="Type your custom content here..." 
                isMultiline={true}
                className={`text-sm ${baseTextColor} w-full opacity-90 leading-relaxed`}
              />
            </div>
          </>
        );
      case 'image':
        return (
          <div className="flex justify-center mb-6">
            {renderAvatar("w-40 h-40 shrink-0")}
          </div>
        );
      default:
        return null;
    }
  };

  const renderHeader = () => (
    <div className={`pb-6 mb-6 border-b ${borderColor} flex justify-between items-start`}>
      <div className="flex-1">
        <div className={`text-4xl font-extrabold uppercase tracking-wider ${headingColor} mb-2`}>
          <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
        </div>
        <div className={`text-xl font-semibold mb-4 opacity-90`} style={{ color: themeStyle.color }}>
          <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
        </div>
        <div className={`text-sm ${mutedTextColor} flex flex-wrap items-center gap-x-3 gap-y-1`}>
          <EditableText text={data.email} fieldPath="email" placeholder="Email Address" />
          <span className="opacity-40">•</span>
          <EditableText text={data.phone} fieldPath="phone" placeholder="Phone Number" />
          <span className="opacity-40">•</span>
          <EditableText text={data.location} fieldPath="location" placeholder="City, Country" />
        </div>
      </div>
      {renderAvatar("w-24 h-24 shrink-0")}
    </div>
  );

  const renderRows = (rows) => {
    return rows.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4 w-full">
        {row.map(section => (
          <div key={section} className="flex-1 min-w-0">
            <DraggableSection sectionId={section}>
              {renderSectionContent(section)}
            </DraggableSection>
          </div>
        ))}
      </div>
    ));
  };

  // Parse order array, fallback to default if not defined
  const order = data.sectionOrder || [['summary'], ['experience'], ['education'], ['skills']];

  // Layout 1: The Classic Manager (classic-split)
  if (template.layout === 'classic-split') {
    const leftAllowed = ['contact', 'education', 'skills', 'languages'];
    const leftRows = order.map(row => row.filter(s => leftAllowed.includes(s))).filter(row => row.length > 0);
    const rightRows = order.map(row => row.filter(s => !leftAllowed.includes(s))).filter(row => row.length > 0);

    return (
      <div 
        className={`w-full h-full p-10 md:p-14 transition-colors duration-500 flex flex-col ${themeStyle.fontFamily} ${themeStyle.fontSize}`} 
        style={{ background: template.image, '--theme-color': themeStyle.color }}
      >
        <div className="flex flex-col items-center text-center pb-6 border-b-2 border-slate-300 mb-8">
          <div className={`text-5xl font-extrabold uppercase tracking-[0.2em] ${headingColor} mb-3`}>
            <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
          </div>
          <div className={`text-xl font-medium tracking-widest uppercase opacity-80`} style={{ color: themeStyle.color }}>
            <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
          </div>
        </div>

        <div className={`flex flex-1 ${gapClass === 'gap-8' ? 'gap-12' : 'gap-10'}`}>
          <div className={`w-[35%] flex flex-col ${gapClass} pr-6 border-r border-slate-200`}>
            {/* Hardcoded contact for this specific layout to match image 1 */}
            <div className="mb-6">
               <div className={`text-lg font-bold ${headingColor} mb-4 uppercase tracking-wide`} style={{ color: themeStyle.color }}>CONTACT</div>
               <div className={`text-sm ${baseTextColor} space-y-3`}>
                 <div className="flex items-center gap-3"><span className="opacity-50">📞</span> <EditableText text={data.phone} fieldPath="phone" placeholder="Phone" /></div>
                 <div className="flex items-center gap-3"><span className="opacity-50">✉️</span> <EditableText text={data.email} fieldPath="email" placeholder="Email" /></div>
                 <div className="flex items-center gap-3"><span className="opacity-50">📍</span> <EditableText text={data.location} fieldPath="location" placeholder="Location" /></div>
               </div>
            </div>
            {renderRows(leftRows)}
          </div>
          <div className={`w-[65%] flex flex-col ${gapClass}`}>
            {renderRows(rightRows)}
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: The Blue Corporate (sidebar-blue)
  if (template.layout === 'sidebar-blue') {
    const mainAllowed = ['summary', 'experience', 'projects', 'custom'];
    const mainRows = order.map(row => row.filter(s => mainAllowed.includes(s))).filter(row => row.length > 0);
    const sideRows = order.map(row => row.filter(s => !mainAllowed.includes(s))).filter(row => row.length > 0);

    return (
      <div 
        className={`w-full h-full transition-colors duration-500 flex ${themeStyle.fontFamily} ${themeStyle.fontSize}`} 
        style={{ background: '#ffffff', '--theme-color': themeStyle.color }}
      >
        <div className={`w-[35%] p-8 h-full ${template.accent} text-slate-900 border-r border-slate-200 shadow-[inset_-4px_0_15px_rgba(0,0,0,0.05)]`}>
          <div className="bg-white p-2 rounded-xl shadow-lg mb-8 inline-block">
             {renderAvatar("w-32 h-32 rounded-lg")}
          </div>
          
          <div className="mb-8 bg-white/40 p-4 rounded-xl shadow-sm border border-white/50">
            <div className={`text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider`}>Contact</div>
            <div className={`text-sm text-slate-800 space-y-3 font-medium`}>
              <EditableText text={data.location} fieldPath="location" placeholder="City, Country" />
              <div className="pt-2 border-t border-slate-900/10">
                <span className="opacity-60 block text-xs">Mobile:</span>
                <EditableText text={data.phone} fieldPath="phone" placeholder="(555) 123-4567" />
              </div>
              <div className="pt-2 border-t border-slate-900/10">
                <span className="opacity-60 block text-xs">Email:</span>
                <EditableText text={data.email} fieldPath="email" placeholder="email@example.com" />
              </div>
            </div>
          </div>

          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/50">
             <div className="flex flex-col gap-6">
                {renderRows(sideRows)}
             </div>
          </div>
        </div>

        <div className={`w-[65%] p-10 h-full flex flex-col bg-white`}>
          <div className="mb-10 pb-6 border-b-4 border-blue-400">
            <div className={`text-4xl font-extrabold uppercase tracking-wide text-slate-900 mb-2`}>
              <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
            </div>
            <div className={`text-xl font-bold opacity-80 text-blue-600`}>
              <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
            </div>
          </div>
          <div className={`flex-1 flex flex-col ${gapClass}`}>
            {renderRows(mainRows)}
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: The Warm Executive (sidebar-brown-diamond)
  if (template.layout === 'sidebar-brown-diamond') {
    const mainAllowed = ['summary', 'experience', 'projects', 'custom'];
    const mainRows = order.map(row => row.filter(s => mainAllowed.includes(s))).filter(row => row.length > 0);
    const sideRows = order.map(row => row.filter(s => !mainAllowed.includes(s))).filter(row => row.length > 0);

    return (
      <div 
        className={`w-full h-full transition-colors duration-500 flex font-serif ${themeStyle.fontSize}`} 
        style={{ background: '#f8f9fa', '--theme-color': themeStyle.color }}
      >
        <div className={`w-[35%] p-8 h-full ${template.accent} text-orange-50 relative overflow-hidden`}>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-tr-[100px]" />

          <div className="relative z-10">
            <div className="flex justify-center mb-10 mt-4">
              <div 
                className="w-36 h-36 bg-white p-1 shadow-2xl transition-transform hover:scale-105"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              >
                <div 
                   className="w-full h-full bg-slate-200 overflow-hidden cursor-pointer"
                   style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                   onClick={() => fileInputRef.current?.click()}
                >
                  {data.image ? (
                    <img src={data.image} alt="Profile" className="w-full h-full object-cover scale-125" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-900/50">
                      <span className="text-white/70 text-xs font-bold text-center px-4">Add Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <div className={`text-sm font-bold text-orange-200 mb-4 uppercase tracking-[0.2em]`}>Contact</div>
              <div className={`text-sm text-orange-50 space-y-4 font-sans`}>
                <div className="flex items-center gap-3 border-b border-orange-700/50 pb-2"><span className="w-8 h-8 rounded-full bg-orange-700/50 flex items-center justify-center">📞</span> <EditableText text={data.phone} fieldPath="phone" placeholder="Phone" /></div>
                <div className="flex items-center gap-3 border-b border-orange-700/50 pb-2"><span className="w-8 h-8 rounded-full bg-orange-700/50 flex items-center justify-center">✉️</span> <EditableText text={data.email} fieldPath="email" placeholder="Email" /></div>
                <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-orange-700/50 flex items-center justify-center">📍</span> <EditableText text={data.location} fieldPath="location" placeholder="Location" /></div>
              </div>
            </div>

            <div className="flex flex-col gap-8 font-sans">
              {renderRows(sideRows)}
            </div>
          </div>
        </div>

        <div className={`w-[65%] p-10 h-full flex flex-col bg-white/80`}>
          <div className="mb-8 pb-6 border-b border-orange-900/20 text-center">
            <div className={`text-5xl font-bold tracking-tight text-slate-900 mb-2 font-sans`}>
              <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
            </div>
            <div className={`text-lg font-medium italic text-orange-800`}>
              <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
            </div>
          </div>
          <div className={`flex-1 flex flex-col ${gapClass} font-sans`}>
            {renderRows(mainRows)}
          </div>
        </div>
      </div>
    );
  }

  // Layout 4: The Bold Timeline (header-split-timeline)
  if (template.layout === 'header-split-timeline') {
    const leftAllowed = ['summary', 'education', 'skills'];
    const leftRows = order.map(row => row.filter(s => leftAllowed.includes(s))).filter(row => row.length > 0);
    const rightRows = order.map(row => row.filter(s => !leftAllowed.includes(s))).filter(row => row.length > 0);

    return (
      <div 
        className={`w-full h-full transition-colors duration-500 flex flex-col ${themeStyle.fontFamily} ${themeStyle.fontSize}`} 
        style={{ background: '#e5e7eb', '--theme-color': themeStyle.color }}
      >
        <div className="h-[200px] w-full flex">
           <div className="w-[30%] h-full bg-slate-200 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                 {renderAvatar("w-40 h-40 border-4 border-white shadow-xl")}
              </div>
           </div>
           <div className={`w-[70%] h-full ${template.accent} flex flex-col justify-center px-10`}>
              <div className={`text-4xl font-extrabold uppercase tracking-widest text-white mb-2`}>
                <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
              </div>
              <div className={`text-xl font-light tracking-[0.3em] text-slate-300 uppercase`}>
                <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
              </div>
           </div>
        </div>

        <div className="flex-1 flex bg-slate-100">
           <div className="w-[35%] p-10 bg-slate-200/50">
             <div className="flex flex-col gap-8">
                {renderRows(leftRows)}
             </div>
           </div>
           <div className="w-[65%] p-10 bg-white">
             <div className="grid grid-cols-2 gap-4 mb-8 pb-6 border-b border-slate-200 text-sm">
                <div className="flex items-center gap-3"><span className="p-2 bg-slate-900 text-white rounded">📞</span> <EditableText text={data.phone} fieldPath="phone" placeholder="Phone" /></div>
                <div className="flex items-center gap-3"><span className="p-2 bg-slate-900 text-white rounded">✉️</span> <EditableText text={data.email} fieldPath="email" placeholder="Email" /></div>
                <div className="flex items-center gap-3 col-span-2"><span className="p-2 bg-slate-900 text-white rounded">📍</span> <EditableText text={data.location} fieldPath="location" placeholder="Location" /></div>
             </div>
             <div className={`flex flex-col ${gapClass}`}>
                {renderRows(rightRows)}
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Layout 5: The Modern Accent (accent-strip-timeline)
  if (template.layout === 'accent-strip-timeline') {
    return (
      <div 
        className={`w-full h-full transition-colors duration-500 flex ${themeStyle.fontFamily} ${themeStyle.fontSize}`} 
        style={{ background: '#ffffff', '--theme-color': themeStyle.color }}
      >
        <div className={`w-12 h-full ${template.accent} shrink-0 shadow-lg z-10 relative`} />
        
        <div className="flex-1 flex flex-col p-12 pl-16 relative">
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-8">
            <div>
              <div className={`text-5xl font-bold text-blue-900 mb-2`}>
                <EditableText text={data.name} fieldPath="name" placeholder="Your Name" />
              </div>
              <div className={`text-xl font-semibold opacity-60 text-slate-600`}>
                <EditableText text={data.role} fieldPath="role" placeholder="Professional Title" />
              </div>
            </div>
            <div className="text-right text-sm text-slate-600 space-y-1">
              <div className="flex justify-end items-center gap-2"><EditableText text={data.location} fieldPath="location" placeholder="Location" /> 📍</div>
              <div className="flex justify-end items-center gap-2"><EditableText text={data.phone} fieldPath="phone" placeholder="Phone" /> 📞</div>
              <div className="flex justify-end items-center gap-2"><EditableText text={data.email} fieldPath="email" placeholder="Email" /> ✉️</div>
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-xl mb-8 border border-blue-100 text-slate-700 italic">
             <EditableText text={data.summary} fieldPath="summary" placeholder="Write a brief professional summary..." isMultiline={true} className="w-full" />
          </div>

          <div className={`flex-1 flex flex-col ${gapClass}`}>
            {renderRows(order.filter(row => !row.includes('summary')))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
