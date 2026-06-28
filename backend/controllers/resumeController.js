import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
  try {
    const { name, resumeData, canvasFormat, selectedTemplateId } = req.body;
    
    const newResume = new Resume({
      name: name || `Resume - ${new Date().toLocaleString()}`,
      resumeData,
      canvasFormat,
      selectedTemplateId
    });

    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resume', error: error.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { name, resumeData, canvasFormat, selectedTemplateId } = req.body;
    
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      { name, resumeData, canvasFormat, selectedTemplateId },
      { new: true, runValidators: true }
    );
    
    if (!updatedResume) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume', error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};
