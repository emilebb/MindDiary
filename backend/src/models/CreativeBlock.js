const mongoose = require('mongoose');

const creativeBlockSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockType: {
    type: String,
    enum: ['inactivity', 'repetition', 'stagnation', 'decision-paralysis'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  description: {
    type: String,
    default: ''
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  interventionSuggestions: [{
    type: {
      type: String,
      enum: ['questions', 'exercise', 'connections', 'inspiration', 'template']
    },
    content: String,
    accepted: { type: Boolean, default: false },
    rejectedAt: Date
  }],
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  ideasCreatedAfter: [mongoose.Schema.Types.ObjectId],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CreativeBlock', creativeBlockSchema);
