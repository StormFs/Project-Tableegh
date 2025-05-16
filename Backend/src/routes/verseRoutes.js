const express = require('express');
const router = express.Router();
const verseController = require('../controllers/verseController');

router.get('/random', verseController.getRandomVerse);
router.get('/search/:search', verseController.searchVerses);

module.exports = router; 