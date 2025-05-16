const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/surah', likeController.addSurahLike);
router.get('/surah/:username', likeController.getLikedSurahs);
router.post('/verse', likeController.addVerseLike);

module.exports = router; 