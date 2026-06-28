import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  canvasFormat: {
    type: String,
    required: true,
  },
  selectedTemplateId: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
