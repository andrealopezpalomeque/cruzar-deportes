const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
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
router.post('/', requireAuth, createLeague);
router.put('/:id', requireAuth, updateLeague);
router.delete('/:id', requireAuth, deleteLeague);

module.exports = router;
