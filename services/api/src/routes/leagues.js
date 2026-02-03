const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const {
  getAllLeagues,
  getLeagueById,
  getLeaguesByProductType,
  createLeague,
  updateLeague,
  deleteLeague
} = require('../controllers/leagueController');

// Public routes
router.get('/', getAllLeagues);
router.get('/by-type/:slug', getLeaguesByProductType);
router.get('/:id', getLeagueById);

// Protected routes (require API key)
router.post('/', apiKeyAuth, createLeague);
router.put('/:id', apiKeyAuth, updateLeague);
router.delete('/:id', apiKeyAuth, deleteLeague);

module.exports = router;
