const performQuery = require('../utils/database');

const likeController = {
    addSurahLike: async (req, res) => {
        const { username, surah_number } = req.body;
        try {
            const user_id = await performQuery(
                'SELECT user_id FROM Users WHERE username = @param0',
                [username]
            );

            const check_like = await performQuery(
                'SELECT * FROM Liked_Surah WHERE surah_number = @param0 AND user_id = @param1',
                [surah_number, user_id[0].user_id]
            );

            if (check_like.length > 0) {
                await performQuery(
                    'DELETE FROM Liked_Surah WHERE surah_number = @param0 AND user_id = @param1',
                    [surah_number, user_id[0].user_id]
                );
                res.json({ success: true, message: 'Like removed successfully' });
            } else {
                await performQuery(
                    'INSERT INTO Liked_Surah (surah_number, user_id) OUTPUT Inserted.user_id VALUES (@param0, @param1)',
                    [surah_number, user_id[0].user_id]
                );
                res.json({ success: true, message: 'Like added successfully' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error managing surah like' });
        }
    },

    getLikedSurahs: async (req, res) => {
        const { username } = req.params;
        try {
            const user_id = await performQuery(
                'SELECT user_id FROM Users WHERE username = @param0',
                [username]
            );

            if (user_id.length > 0) {
                const result = await performQuery(
                    'SELECT surah_number FROM Liked_Surah WHERE user_id = @param0',
                    [user_id[0].user_id]
                );
                res.json(result);
            } else {
                res.json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching liked surahs' });
        }
    },

    addVerseLike: async (req, res) => {
        const { username, verse_number, surah_number } = req.body;
        try {
            const user_id = await performQuery(
                'SELECT user_id FROM Users WHERE username = @param0',
                [username]
            );

            const check_like = await performQuery(
                'SELECT * FROM Liked_Verse WHERE surah_number = @param0 AND verse_number = @param1 AND user_id = @param2',
                [surah_number, verse_number, user_id[0].user_id]
            );

            if (check_like.length > 0) {
                await performQuery(
                    'DELETE FROM Liked_Verse WHERE surah_number = @param0 AND verse_number = @param1 AND user_id = @param2',
                    [surah_number, verse_number, user_id[0].user_id]
                );
                res.json({ success: true, message: 'Like removed successfully' });
            } else {
                await performQuery(
                    'INSERT INTO Liked_Verse (surah_number, verse_number, user_id) OUTPUT Inserted.user_id VALUES (@param0, @param1, @param2)',
                    [surah_number, verse_number, user_id[0].user_id]
                );
                res.json({ success: true, message: 'Like added successfully' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error managing verse like' });
        }
    }
};

module.exports = likeController; 