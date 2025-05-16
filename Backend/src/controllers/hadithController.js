const performQuery = require('../utils/database');

const HadithCounts = [7276, 7562, 3956, 5274, 4341, 5761, 6293];

const hadithController = {
    getRandomHadith: async (req, res) => {
        const Book = Math.floor(Math.random() * 7 + 1);
        const TotalHs = HadithCounts[Book - 1];
        const HadithNumber = Math.floor(Math.random() * TotalHs + 1);
        
        try {
            const result = await performQuery(
                'SELECT * FROM Hadith H Join Hadith_Book HB on HB.book_id = H.book_id WHERE H.hadith_id = @param0 AND H.book_id = @param1',
                [HadithNumber, Book]
            );
            
            if (result.length > 0) {
                res.json({ hadith: result[0] });
            } else {
                res.json({ hadith: 'Hadith Not Found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching random hadith' });
        }
    },

    searchHadiths: async (req, res) => {
        const { search } = req.params;
        const lowerCaseSearch = search.toLowerCase();
        
        try {
            const result = await performQuery(
                `SELECT * FROM Hadith H 
                JOIN Hadith_Book HB ON H.book_id = HB.book_id
                WHERE LOWER(H.english) LIKE @param0 OR LOWER(H.sanad) LIKE @param0`,
                [`%${lowerCaseSearch}%`]
            );
            
            res.json({
                results: result,
                total: result.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error searching hadiths' });
        }
    },

    getHadithBooks: async (req, res) => {
        try {
            const result = await performQuery('SELECT * FROM Hadith_Book');
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching hadith books' });
        }
    },

    getChapters: async (req, res) => {
        const { book_id } = req.params;
        try {
            const result = await performQuery(
                'SELECT DISTINCT chapter, sanad FROM Hadith WHERE book_id = @param0',
                [book_id]
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching chapters' });
        }
    }
};

module.exports = hadithController; 