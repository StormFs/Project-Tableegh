const performQuery = require('../utils/database');

const authMiddleware = {
    verifyUser: async (req, res, next) => {
        const { username } = req.body;
        if (!username) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        try {
            const user = await performQuery(
                'SELECT user_id FROM Users WHERE username = @param0',
                [username]
            );

            if (user.length === 0) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = user[0];
            next();
        } catch (error) {
            res.status(500).json({ success: false, message: 'Authentication error' });
        }
    }
};

module.exports = authMiddleware; 