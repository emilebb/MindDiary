const Project = require('../models/Project');
const Idea = require('../models/Idea');

const createProject = async (req, res) => {
  try {
    const { name, description, emoji, color } = req.body;

    const project = new Project({
      userId: req.userId,
      name,
      description: description || '',
      emoji: emoji || '🎨',
      color: color || '#6C63FF'
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ lastActivityDate: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || project.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Fetch ideas count
    const ideasCount = await Idea.countDocuments({ projectId: project._id });
    project.stats.ideasCount = ideasCount;

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, color, emoji, viewMode, tags } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name || undefined,
        description: description || undefined,
        color: color || undefined,
        emoji: emoji || undefined,
        viewMode: viewMode || undefined,
        tags: tags || undefined,
        lastActivityDate: new Date()
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated ideas
    await Idea.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
