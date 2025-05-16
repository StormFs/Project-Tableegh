const performQuery = require('../utils/database');

const verseCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111,
    43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77,
    227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75,
    85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62,
    55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30,
    52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29,
    19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19,
    5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

const verseController = {
    getRandomVerse: async (req, res) => {
        const surahindex = Math.floor(Math.random() * 114) + 1;
        const totalayahs = verseCounts[surahindex - 1];
        const ayahindex = Math.floor(Math.random() * totalayahs) + 1;
        
        try {
            const result = await performQuery(
                'SELECT * FROM Verse v join Surah s on v.surah_number = s.surah_number WHERE v.surah_number = @param0 AND v.verse_number = @param1',
                [surahindex, ayahindex]
            );
            
            if (result.length > 0) {
                res.json({ verse: result[0] });
            } else {
                res.json({ verse: 'Verse not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching random verse' });
        }
    },

    searchVerses: async (req, res) => {
        const { search } = req.params;
        const lowerCaseSearch = search.toLowerCase();
        
        try {
            const result = await performQuery(
                'SELECT * FROM Verse V Join Surah S on V.Surah_Number = S.Surah_Number WHERE V.English LIKE @param0',
                [`%${lowerCaseSearch}%`]
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error searching verses' });
        }
    }
};

module.exports = verseController; 