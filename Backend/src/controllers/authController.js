const performQuery = require('../utils/database');
const CryptoJS = require('crypto-js');

const authController = {
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({ success: false, message: 'Username and password are required' });
        }

        try {
            const result = await performQuery(
                'SELECT * FROM Users WHERE username = @param0 AND password = @param1',
                [username, CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)]
            );

            if (result.length > 0) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Login failed' });
        }
    },

    signup: async (req, res) => {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        try {
            const usernameExists = await performQuery(
                'SELECT username FROM Users WHERE username = @param0',
                [username]
            );

            if (usernameExists.length > 0) {
                return res.json({ success: false, message: 'Username already exists' });
            }

            const emailExists = await performQuery(
                'SELECT email FROM Users WHERE email = @param0',
                [email]
            );

            if (emailExists.length > 0) {
                return res.json({ success: false, message: 'Email already exists' });
            }

            const result = await performQuery(
                'INSERT INTO Users (username, password, email) OUTPUT Inserted.user_id VALUES (@param0, @param1, @param2)',
                [username, CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex), email]
            );

            if (result.length > 0) {
                res.json({ success: true, message: 'Signup successful' });
            } else {
                res.json({ success: false, message: 'Signup failed' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Signup failed' });
        }
    }
};

module.exports = authController; 