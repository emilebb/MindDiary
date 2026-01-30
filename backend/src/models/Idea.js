const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'voice', 'image', 'drawing', 'mixed'],
    default: 'text'
  },
  tags: [{
    type: String
  }],
  color: {
    type: String,
    default: '#FFFFFF'
  },
  emoji: {
    type: String,
    default: null
  },
  media: {
    type: {
      type: String, // 'image', 'audio', 'video'
      enum: ['image', 'audio', 'video'],
      default: undefined
    },
    url: String,
    filename: String
  },
  aiSuggestions: {
    expansion: { type: String, default: null },
    questions: [String],
    connections: [mongoose.Schema.Types.ObjectId], // IDs of related ideas
    mood: { type: String, default: null }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'organized', 'developed', 'archived'],
    default: 'draft'
  },
  isPinned: {
    type: Boolean,
    default: false
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

ideaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Idea', ideaSchema);
