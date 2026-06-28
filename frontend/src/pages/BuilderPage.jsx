import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Download, Plus, X, File, LayoutTemplate, Monitor, Smartphone, Tablet, FileText, ChevronLeft, Save, FolderOpen, AlertTriangle, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import ResumePreview from '../components/ResumePreview';
import { templates } from '../data/templates';

const defaultResumeData = {
  name: 'Alex Morgan',
  role: 'Full Stack Engineer',
  email: 'alex.morgan@email.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  summary: 'Results-driven professional with 5+ years of experience in delivering high-quality web applications. Proven track record of improving system metrics, architecting scalable solutions, and leading successful development teams from concept to deployment.',
  image: null,
  sectionVisibility: { summary: true, experience: true, education: true, skills: true },
  sectionOrder: [['summary'], ['experience'], ['education'], ['skills']],
  headings: { summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills', contact: 'Contact', custom: 'Custom Section' },
  theme: { color: '#4f46e5', fontFamily: 'font-sans', fontSize: 'text-base', spacing: 'normal' },
  experience: [
    { title: 'Senior Software Engineer', company: 'Tech Solutions Inc.', date: '2020 - Present', desc: '• Led a team of 5 developers to build scalable enterprise applications.\n• Improved database query performance by 40% using modern ORM techniques.' },
    { title: 'Frontend Developer', company: 'Creative Agency', date: '2017 - 2020', desc: '• Developed responsive, pixel-perfect user interfaces using React and Tailwind CSS.' }
  ],
  education: [
    { degree: 'B.S. in Computer Science', school: 'University of Technology', date: '2013 - 2017' }
  ],
  skills: 'JavaScript, TypeScript, React, Node.js, Tailwind CSS, MongoDB, PostgreSQL, Git'
};

const TemplateCard = ({ template, onClick, resumeData, noop }) => {
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.2);

  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / 800);
      }
    };
    
    // Initial scale
    updateScale();
    
    // Create a ResizeObserver to watch the container's width changes
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-white border-2 border-slate-200 hover:border-brand p-3 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden"
    >
       <div 
         ref={containerRef}
         className="w-full aspect-[21/29.7] rounded-lg mb-3 shadow-sm border border-slate-100 relative overflow-hidden bg-white"
       >
         <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
         
         <div 
           className="absolute top-0 left-0 w-[800px] h-[1131px] pointer-events-none origin-top-left flex flex-col" 
           style={{ transform: `scale(${scale})` }}
         >
           <ResumePreview 
             template={template} 
             data={resumeData} 
             onEdit={noop}
             onRemove={noop}
             onReorder={noop}
             onSectionToggle={noop}
             onSectionReorder={noop}
           />
         </div>
       </div>
       <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{template.name}</h4>
    </div>
  );
};

export default function BuilderPage() {
  const [zoom, setZoom] = useState(1);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [modalStep, setModalStep] = useState('selectType');
  const [templateFilter, setTemplateFilter] = useState(null);
  const [canvasFormat, setCanvasFormat] = useState(() => {
    try {
      const saved = localStorage.getItem('autosave_resume');
      if (saved) return JSON.parse(saved).canvasFormat;
    } catch(e) {}
    return null;
  });
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    try {
      const saved = localStorage.getItem('autosave_resume');
      if (saved) return JSON.parse(saved).selectedTemplateId;
    } catch(e) {}
    return null;
  });
  
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('autosave_resume');
      if (saved) return JSON.parse(saved).resumeData || defaultResumeData;
    } catch(e) {}
    return defaultResumeData;
  });

  const [activeResumeId, setActiveResumeId] = useState(() => {
    try {
      const saved = localStorage.getItem('autosave_resume');
      if (saved) return JSON.parse(saved).activeResumeId;
    } catch(e) {}
    return null;
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const [showConfirmChangeModal, setShowConfirmChangeModal] = useState(false);
  const [pendingFormatChange, setPendingFormatChange] = useState(null);
  
  const [showSavedItemsModal, setShowSavedItemsModal] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [exportingItem, setExportingItem] = useState(null);

  React.useEffect(() => {
    if (showSavedItemsModal) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes`)
        .then(res => res.json())
        .then(data => setSavedItems(data))
        .catch(err => console.error("Error fetching resumes:", err));
    }
  }, [showSavedItemsModal]);

  React.useEffect(() => {
    if (canvasFormat || selectedTemplateId) {
      localStorage.setItem('autosave_resume', JSON.stringify({
        resumeData,
        canvasFormat,
        selectedTemplateId,
        activeResumeId
      }));
    }
  }, [resumeData, canvasFormat, selectedTemplateId, activeResumeId]);

  const handleEdit = (fieldPath, value) => {
    setResumeData(prev => {
      const newData = { ...prev };
      const keys = fieldPath.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSaveSnapshot = async () => {
    const payload = {
      name: `Resume - ${new Date().toLocaleString()}`,
      resumeData,
      canvasFormat,
      selectedTemplateId
    };

    try {
      let response;
      if (activeResumeId) {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/${activeResumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      if (response.ok) {
        const savedDoc = await response.json();
        setActiveResumeId(savedDoc._id);
        
        setToastMessage("Resume saved successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleLoadSnapshot = (item) => {
    setResumeData(item.resumeData);
    setCanvasFormat(item.canvasFormat);
    setSelectedTemplateId(item.selectedTemplateId ? Number(item.selectedTemplateId) : null);
    setActiveResumeId(item._id);
    setShowSavedItemsModal(false);
  };

  const handleDeleteSnapshot = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved resume?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSavedItems(prev => prev.filter(item => item._id !== id));
        if (activeResumeId === id) setActiveResumeId(null);
        setToastMessage("Resume deleted.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleExportSnapshot = (e, item) => {
    e.stopPropagation();
    setExportingItem(item);
  };

  React.useEffect(() => {
    if (exportingItem) {
      setTimeout(async () => {
        const element = document.getElementById('pdf-export-container');
        if (!element) {
          setExportingItem(null);
          return;
        }
        
        try {
          const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${exportingItem.name || 'resume'}.pdf`);
          
          setExportingItem(null);
          setToastMessage("PDF Exported successfully!");
          setTimeout(() => setToastMessage(null), 3000);
        } catch (error) {
          console.error("PDF Generation Error:", error);
          setExportingItem(null);
          setErrorToast("Error generating PDF. Please try again.");
          setTimeout(() => setErrorToast(null), 5000);
        }
      }, 500); // Wait for DOM to render the full size preview
    }
  }, [exportingItem]);

  // Responsive zoom handling
  React.useEffect(() => {
    if (!canvasFormat) return;
    
    const calculateInitialZoom = () => {
      const windowWidth = window.innerWidth;
      const padding = windowWidth < 768 ? 40 : 120; // Safe area padding for mobile vs desktop
      const availableWidth = windowWidth - padding;
      
      let targetWidth = 800;
      if (canvasFormat === 'desktop') targetWidth = 1280;
      if (canvasFormat === 'tablet') targetWidth = 768;
      if (canvasFormat === 'mobile') targetWidth = 375;

      if (availableWidth < targetWidth) {
        setZoom(Number((availableWidth / targetWidth).toFixed(2)));
      } else {
        setZoom(1);
      }
    };

    calculateInitialZoom();
    window.addEventListener('resize', calculateInitialZoom);
    return () => window.removeEventListener('resize', calculateInitialZoom);
  }, [canvasFormat]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2)); // Allow smaller zoom-out for very small devices

  const closeAddPageModal = () => {
    setShowAddPageModal(false);
    setTimeout(() => setModalStep('selectType'), 300);
  };

  const handleSelectFormat = (format) => {
    if (canvasFormat) {
      setPendingFormatChange({ format, templateId: null });
      setShowConfirmChangeModal(true);
    } else {
      executeFormatChange(format, null);
    }
  };

  const handleSelectTemplate = (templateId) => {
    if (canvasFormat) {
      setPendingFormatChange({ format: 'a4', templateId });
      setShowConfirmChangeModal(true);
    } else {
      executeFormatChange('a4', templateId);
    }
  };

  const executeFormatChange = (format, templateId) => {
    setCanvasFormat(format);
    setSelectedTemplateId(templateId);
    setResumeData(defaultResumeData); // Reset data when opening a new fresh page
    setActiveResumeId(null);
    closeAddPageModal();
    setShowConfirmChangeModal(false);
    setPendingFormatChange(null);
  };

  const getCanvasStyles = () => {
    switch (canvasFormat) {
      case 'a4': return "w-[800px] h-[1131px]"; 
      case 'desktop': return "w-[1280px] h-[720px]"; 
      case 'tablet': return "w-[768px] h-[1024px]"; 
      case 'mobile': return "w-[375px] h-[812px]"; 
      default: return "";
    }
  };

  const getFormatDisplayName = () => {
    switch (canvasFormat) {
      case 'a4': return "A4 Document";
      case 'desktop': return "Desktop Web";
      case 'tablet': return "Tablet";
      case 'mobile': return "Mobile App";
      default: return "";
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const noop = () => {};

  return (
    <div className="h-screen w-full bg-[#f0f2f5] flex flex-col relative overflow-hidden">
      
      {/* Floating Top Toolbar */}
      <motion.div 
        className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl px-2 md:px-4 py-2 md:py-3 flex items-center justify-between z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={handleZoomOut} className="p-1 md:p-1.5 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-bold px-1 md:px-3 text-slate-700 w-10 md:w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 md:p-1.5 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="bg-brand text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-brand/20 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all text-xs flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Floating Bottom Nav */}
      <motion.div 
        className="absolute bottom-6 left-1/2 bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl shadow-indigo-500/10 rounded-full px-4 py-2 flex items-center justify-center gap-4 w-auto z-40"
        style={{ x: "-50%" }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      >
        <button 
          onClick={() => setShowAddPageModal(true)}
          className="flex items-center gap-2 text-sm font-bold text-brand bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={18} strokeWidth={2.5} /> Add Page
        </button>
        {canvasFormat && (
          <button 
            onClick={handleSaveSnapshot}
            className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors"
          >
            <Save size={18} strokeWidth={2.5} /> Save
          </button>
        )}
        <button 
          onClick={() => setShowSavedItemsModal(true)}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
        >
          <FolderOpen size={18} strokeWidth={2.5} /> Saved Items
        </button>
      </motion.div>

      {/* Main Workspace (Canvas Area) */}
      <div className="flex-1 w-full h-full overflow-auto custom-scrollbar flex items-start justify-center pt-28 pb-28 px-4 md:px-12">
        {canvasFormat ? (
          <motion.div 
            className="flex items-center justify-center origin-top md:origin-center my-auto"
            animate={{ scale: zoom }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            <div className={`${getCanvasStyles()} bg-white shadow-2xl transition-all duration-300 ring-1 ring-slate-900/5 overflow-hidden flex flex-col print-container`}>
              {selectedTemplate ? (
                <div className="w-full h-full flex-1">
                  <ResumePreview 
                    template={selectedTemplate} 
                    data={resumeData} 
                    onEdit={handleEdit}
                    onRemove={noop}
                    onReorder={noop}
                    onSectionToggle={noop}
                    onSectionReorder={noop}
                  />
                </div>
              ) : (
                /* Blank Canvas Content */
                <div className="w-full h-full flex-1"></div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50 mt-10">
            <LayoutTemplate size={64} className="mb-4" />
            <p className="text-lg font-medium">No page selected</p>
            <p className="text-sm">Click 'Add Page' below to start</p>
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      <AnimatePresence>
        {showAddPageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200/50"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 relative">
                
                {(modalStep === 'selectDevice' || modalStep === 'selectSpecificTemplate') && (
                  <button 
                    onClick={() => setModalStep('selectType')}
                    className="absolute left-6 md:left-8 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                <div className={`${(modalStep === 'selectDevice' || modalStep === 'selectSpecificTemplate') ? 'ml-14' : ''} transition-all duration-300`}>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {modalStep === 'selectType' && 'Add New Page'}
                    {modalStep === 'selectDevice' && 'Select Device Format'}
                    {modalStep === 'selectSpecificTemplate' && `${templateFilter} Templates`}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {modalStep === 'selectType' && 'Start fresh or choose from a professionally designed template.'}
                    {modalStep === 'selectDevice' && 'Choose the canvas size and aspect ratio for your new blank page.'}
                    {modalStep === 'selectSpecificTemplate' && 'Select a specific template design to apply to your new page.'}
                  </p>
                </div>

                <button 
                  onClick={closeAddPageModal}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/50 flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  
                  {/* Step 1: Select Type */}
                  {modalStep === 'selectType' && (
                    <motion.div 
                      key="selectType"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    >
                      <div 
                        onClick={() => setModalStep('selectDevice')}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-brand flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <File size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Blank Page</h3>
                        <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed font-medium">Start from scratch with an empty canvas.</p>
                      </div>

                      <div 
                        onClick={() => { setTemplateFilter('Professional'); setModalStep('selectSpecificTemplate'); }}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-brand flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <LayoutTemplate size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Professional</h3>
                        <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed font-medium">Sleek, structured layouts for a corporate look.</p>
                      </div>

                      <div 
                        onClick={() => { setTemplateFilter('Creative'); setModalStep('selectSpecificTemplate'); }}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-brand flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <LayoutTemplate size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Creative</h3>
                        <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed font-medium">Bold designs with focus on typography and space.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1.5: Select Specific Template */}
                  {modalStep === 'selectSpecificTemplate' && (
                    <motion.div 
                      key="selectSpecificTemplate"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                      {templates.filter(t => t.category === templateFilter).map(template => (
                        <TemplateCard 
                          key={template.id} 
                          template={template}
                          resumeData={resumeData}
                          noop={noop}
                          onClick={() => handleSelectTemplate(template.id)}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* Step 2: Select Device */}
                  {modalStep === 'selectDevice' && (
                    <motion.div 
                      key="selectDevice"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                      <div 
                        onClick={() => handleSelectFormat('a4')}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-20 rounded-lg bg-indigo-50 text-brand border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <FileText size={28} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">A4 Document</h3>
                        <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">Print & Resume</p>
                      </div>

                      <div 
                        onClick={() => handleSelectFormat('desktop')}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-24 h-16 rounded-xl bg-indigo-50 text-brand border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <Monitor size={28} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Desktop Web</h3>
                        <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">1920 x 1080</p>
                      </div>

                      <div 
                        onClick={() => handleSelectFormat('tablet')}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-20 rounded-xl bg-indigo-50 text-brand border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <Tablet size={28} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Tablet View</h3>
                        <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">Portrait & Landscape</p>
                      </div>

                      <div 
                        onClick={() => handleSelectFormat('mobile')}
                        className="group cursor-pointer rounded-2xl bg-white border-2 border-slate-200 hover:border-brand p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-12 h-20 rounded-xl bg-indigo-50 text-brand border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                          <Smartphone size={28} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Mobile App</h3>
                        <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">Standard Phone</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Change Modal */}
      <AnimatePresence>
        {showConfirmChangeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden border border-slate-200/50 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Discard Current Page?</h3>
              <p className="text-slate-500 mb-6">Creating a new page will discard your current unsaved changes. This cannot be undone. Are you sure you want to proceed?</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowConfirmChangeModal(false)}
                  className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => executeFormatChange(pendingFormatChange.format, pendingFormatChange.templateId)}
                  className="px-6 py-2 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Discard & Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Saved Items Modal */}
      <AnimatePresence>
        {showSavedItemsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-y-auto custom-scrollbar flex flex-col max-h-[85vh] border border-slate-200/50 relative"
              >
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md flex items-center justify-between p-6 md:p-8 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Saved Items</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Load previously saved resumes.</p>
                </div>
                <button onClick={() => setShowSavedItemsModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 bg-slate-50/50 flex-1">
                {savedItems.length === 0 ? (
                  <div className="text-center text-slate-400 py-10">
                    <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No saved items yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {savedItems.map(item => {
                      const tpl = templates.find(t => String(t.id) === String(item.selectedTemplateId));
                      return (
                        <div key={item._id} className="bg-white rounded-xl border border-slate-200 hover:border-brand hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                          {tpl ? (
                            <div className="w-full aspect-[21/29.7] relative overflow-hidden bg-slate-50 border-b border-slate-100 cursor-pointer @container" onClick={() => handleLoadSnapshot(item)}>
                              <div className="absolute top-0 left-0 w-[800px] h-[1131px] origin-top-left pointer-events-none" style={{ transform: 'scale(calc(100cqw / 800))' }}>
                                <ResumePreview 
                                  template={tpl} 
                                  data={item.resumeData} 
                                  onEdit={noop}
                                  onRemove={noop}
                                  onReorder={noop}
                                  onSectionToggle={noop}
                                  onSectionReorder={noop}
                                />
                              </div>
                              <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <div className="bg-white text-brand px-4 py-2 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                  Click to Load
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full aspect-[21/29.7] flex items-center justify-center bg-slate-50 border-b border-slate-100 text-slate-400 cursor-pointer" onClick={() => handleLoadSnapshot(item)}>
                              <LayoutTemplate size={48} className="opacity-20 group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white text-brand px-4 py-2 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                  Click to Load
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="p-4 flex-1 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-slate-800 line-clamp-1 mb-1" title={item.name}>{item.name}</h4>
                              <p className="text-xs text-slate-500">{item.canvasFormat === 'a4' ? 'A4 Document' : 'Blank Canvas'} • {new Date(item.updatedAt).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => handleExportSnapshot(e, item)} className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-brand rounded-lg transition-colors" title="Export PDF">
                                <Download size={16} />
                              </button>
                              <button onClick={(e) => handleDeleteSnapshot(e, item._id)} className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[70] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2"
          >
            <Save size={18} /> {toastMessage}
          </motion.div>
        )}
        
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[70] bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2"
          >
            <AlertTriangle size={18} /> {errorToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden PDF Export Container */}
      {exportingItem && (
        <div className="fixed top-[-10000px] left-[-10000px] pointer-events-none">
          <div id="pdf-export-container" className="w-[800px] h-[1131px] bg-white">
            {exportingItem.selectedTemplateId && templates.find(t => String(t.id) === String(exportingItem.selectedTemplateId)) ? (
              <ResumePreview 
                template={templates.find(t => String(t.id) === String(exportingItem.selectedTemplateId))} 
                data={exportingItem.resumeData}
                onEdit={noop}
                onRemove={noop}
                onReorder={noop}
                onSectionToggle={noop}
                onSectionReorder={noop}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <LayoutTemplate size={64} className="mb-4 opacity-20" />
                <p>Blank Canvas</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}