const Idea = require('../models/Idea');
const Project = require('../models/Project');

const captureIdea = async (req, res) => {
  try {
    console.log('Capturing idea with data:', req.body);
    console.log('User ID:', req.userId);
    
    const { projectId, content, type, tags, color, emoji } = req.body;

    if (!projectId || !content) {
      return res.status(400).json({ error: 'projectId and content are required' });
    }

    const idea = new Idea({
      projectId,
      userId: req.userId,
      content,
      type: type || 'text',
      tags: tags || [],
      color: color || '#FFFFFF',
      emoji: emoji || null
    });

    await idea.save();
    console.log('Idea saved successfully:', idea._id);

    // Update project stats
    await Project.findByIdAndUpdate(
      projectId,
      { lastActivityDate: new Date() },
      { new: true }
    );

    res.status(201).json(idea);
  } catch (err) {
    console.error('Capture idea error:', err);
    res.status(500).json({ error: 'Failed to capture idea', details: err.message });
  }
};

const getProjectIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};

const updateIdea = async (req, res) => {
  try {
    const { content, tags, color, emoji, status, position, isPinned, aiSuggestions } = req.body;

    const idea = await Idea.findByIdAndUpdate(
      req.params.id,
      {
        content: content || undefined,
        tags: tags || undefined,
        color: color || undefined,
        emoji: emoji || undefined,
        status: status || undefined,
        position: position || undefined,
        isPinned: isPinned !== undefined ? isPinned : undefined,
        aiSuggestions: aiSuggestions || undefined
      },
      { new: true }
    );

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update idea' });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete idea' });
  }
};

const expandIdea = async (req, res) => {
  try {
    const { projectId, content } = req.body;
    const ideaId = req.params.id;

    // Fetch existing idea
    const originalIdea = await Idea.findById(ideaId);
    if (!originalIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Create sub-ideas from expansion
    const subIdeas = [];
    const expansionPoints = content.split('\n').filter(line => line.trim());

    for (const point of expansionPoints) {
      if (point.trim()) {
        const subIdea = new Idea({
          projectId,
          userId: req.userId,
          content: point,
          type: 'text',
          tags: originalIdea.tags,
          color: originalIdea.color,
          aiSuggestions: {
            connections: [ideaId]
          }
        });
        await subIdea.save();
        subIdeas.push(subIdea);
      }
    }

    // Update original idea with connections
    originalIdea.aiSuggestions.connections = subIdeas.map(idea => idea._id);
    await originalIdea.save();

    res.json({
      originalIdea,
      subIdeas
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to expand idea' });
  }
};

module.exports = {
  captureIdea,
  getProjectIdeas,
  updateIdea,
  deleteIdea,
  expandIdea
};
