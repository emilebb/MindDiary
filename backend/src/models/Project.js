const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#6C63FF'
  },
  emoji: {
    type: String,
    default: '🎨'
  },
  viewMode: {
    type: String,
    enum: ['canvas', 'timeline', 'map', 'gallery', 'list', 'flow'],
    default: 'canvas'
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  creativeBlockDetected: {
    type: Boolean,
    default: false
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  stats: {
    ideasCount: { type: Number, default: 0 },
    connections: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
