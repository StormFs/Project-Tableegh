const express = require('express');
const router = express.Router();
const hadithController = require('../controllers/hadithController');

router.get('/random', hadithController.getRandomHadith);
router.get('/search/:search', hadithController.searchHadiths);
router.get('/books', hadithController.getHadithBooks);
router.get('/:book_id/chapters', hadithController.getChapters);

module.exports = router; 