const express = require('express');
const aiService = require('../utils/aiService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/questions', authMiddleware, async (req, res) => {
  try {
    const { topic, context } = req.body;
    const questions = await aiService.generateCreativeQuestions(topic, context);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

router.post('/expand', authMiddleware, async (req, res) => {
  try {
    const { content, question } = req.body;
    const expansion = await aiService.expandIdeaAI(content, question);
    res.json(expansion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to expand idea' });
  }
});

router.post('/mood', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const mood = await aiService.detectCreativeMood(content);
    res.json({ mood });
  } catch (err) {
    res.status(500).json({ error: 'Failed to detect mood' });
  }
});

router.post('/exercise', authMiddleware, async (req, res) => {
  try {
    const { blockType } = req.body;
    const exercise = await aiService.generateCreativeExercise(blockType);
    res.json({ exercise });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate exercise' });
  }
});

router.post('/connections', authMiddleware, async (req, res) => {
  try {
    const { mainIdea, otherIdeas } = req.body;
    const connections = await aiService.findIdeaConnections(mainIdea, otherIdeas);
    res.json({ connections });
  } catch (err) {
    res.status(500).json({ error: 'Failed to find connections' });
  }
});

router.post('/mindmap', authMiddleware, async (req, res) => {
  try {
    const { centralIdea, mode, depth } = req.body;
    const mindMap = await aiService.generateMindMap(centralIdea, mode, depth);
    res.json(mindMap);
  } catch (err) {
    console.error('Mind map generation error:', err);
    res.status(500).json({ error: 'Failed to generate mind map' });
  }
});

router.post('/analyze-image', authMiddleware, async (req, res) => {
  try {
    const { image, context } = req.body;
    const analysis = await aiService.analyzeImageForIdeas(image, context);
    res.json(analysis);
  } catch (err) {
    console.error('Image analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;
