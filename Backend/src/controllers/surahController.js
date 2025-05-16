const performQuery = require('../utils/database');

const surahController = {
    getAllSurahs: async (req, res) => {
        try {
            const result = await performQuery('SELECT * FROM Surah');
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching surahs' });
        }
    },

    getSurahByName: async (req, res) => {
        const { surah_number } = req.params;
        try {
            const result = await performQuery(
                'SELECT surah_name_arabic FROM Surah WHERE surah_number = @param0',
                [surah_number]
            );
            
            if (result.length > 0) {
                res.json({ name: result[0].surah_name_arabic });
            } else {
                res.json({ success: false, message: 'Surah not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching surah' });
        }
    },

    getSurahVerses: async (req, res) => {
        const { surah_number } = req.params;
        try {
            const result = await performQuery(
                'SELECT * FROM Verse WHERE surah_number = @param0',
                [surah_number]
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching verses' });
        }
    }
};

module.exports = surahController; 