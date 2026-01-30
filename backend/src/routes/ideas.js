const express = require('express');
const ideaController = require('../controllers/ideaController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, ideaController.captureIdea);
router.get('/project/:projectId', authMiddleware, ideaController.getProjectIdeas);
router.put('/:id', authMiddleware, ideaController.updateIdea);
router.delete('/:id', authMiddleware, ideaController.deleteIdea);
router.post('/:id/expand', authMiddleware, ideaController.expandIdea);

module.exports = router;
