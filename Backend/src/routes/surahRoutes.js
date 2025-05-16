const express = require('express');
const router = express.Router();
const surahController = require('../controllers/surahController');

router.get('/', surahController.getAllSurahs);
router.get('/get/name/:surah_number', surahController.getSurahByName);
router.get('/get/:surah_number', surahController.getSurahVerses);

module.exports = router; 