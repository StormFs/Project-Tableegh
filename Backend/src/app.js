const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const surahRoutes = require('./routes/surahRoutes');
const verseRoutes = require('./routes/verseRoutes');
const hadithRoutes = require('./routes/hadithRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surah', surahRoutes);
app.use('/api/verse', verseRoutes);
app.use('/api/hadith', hadithRoutes);
app.use('/api/likes', likeRoutes);

// Error handling
app.use(errorHandler);

module.exports = app; 