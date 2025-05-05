const getChapters = async (req, res) => {
    try {
        const { book_id } = req.params;
        const pool = await sql.connect(config);
        
        const result = await pool.request()
            .input('book_id', sql.Int, book_id)
            .query(`
                SELECT 
                    chapter,
                    sanad,
                    MIN(hadith_id) as first_hadith_id,
                    MAX(hadith_id) as last_hadith_id
                FROM Hadith 
                WHERE book_id = @book_id
                GROUP BY chapter, sanad
                ORDER BY chapter
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        sql.close();
    }
}; 