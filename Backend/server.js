const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const CryptoJS = require('crypto-js');

const app = express();

app.use(cors());

app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

const serverName = "localhost";
const databaseName = "Project Tabligh";
const sqlPort = 1433;
const serverPort = 8080;

const config = {
    server: 'localhost',
    user: 'sa',
    password: 'Faheemsarwar.17',
    database: 'Project Tabligh',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
};

const backendPort = 5143;

app.get('/api/surah', async (req, res) => {
  const result = await performQuery('SELECT * FROM Surah');
  res.json({surah_number, surah_name_arabic, surah_name_english, verses_amount} = result);
});

app.get('/api/surah/get/name/:surah_number', async (req, res) => {
  const { surah_number } = req.params;
  const result = await performQuery('SELECT surah_name_arabic FROM Surah WHERE surah_number = @param0', [surah_number]);
  if(result.length > 0){
    res.json({name: result[0].surah_name_arabic});
  }else{
    res.json({success: false, message: 'Surah not found'});
  }
});

app.get('/api/likedverses/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user_id = await performQuery(
            'SELECT user_id FROM Users WHERE username = @param0',
            [username]
        );

        if (user_id.length > 0) {
            const likedVerses = await performQuery( 
                'SELECT v.*, s.surah_name_arabic FROM (Liked_Verse lv JOIN Verse v ON lv.surah_number = v.surah_number AND lv.verse_number = v.verse_number) JOIN Surah s ON v.surah_number = s.surah_number WHERE lv.user_id = @param0',
                [user_id[0].user_id]
            );
            res.json(likedVerses); 
        } else {
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching liked verses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.json({ success: false, message: 'Username and password are required' });
    return;
  }
  const result = await performQuery(
    'SELECT * FROM Users WHERE username = @param0 AND password = @param1',
    [username, CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)]
  );
  if (result.length > 0) {  
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/api/likes/addsurah', async (req, res) => {
  const { username, surah_number } = req.body;
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
    console.log('Like removed successfully');
  }
  else{
    const result = await performQuery(
      'INSERT INTO Liked_Surah (surah_number, user_id) OUTPUT Inserted.user_id VALUES (@param0, @param1)',
      [surah_number, user_id[0].user_id]
    );
    res.json({ success: true, message: 'Like added successfully' });
  }
});

app.get('/api/likes/getsurah/:username', async (req, res) => {
  const { username } = req.params;
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
  }
  else{
    res.json({success: false, message: 'User not found'});
  }
});

app.post('/api/likes/add', async (req, res) => {
  const { username, verse_number, surah_number } = req.body;
  
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
    return;
  }
  if (user_id.length > 0) {
    const result = await performQuery(
      'INSERT INTO Liked_Verse (surah_number, verse_number, user_id) OUTPUT Inserted.user_id VALUES (@param0, @param1, @param2)',
    [surah_number, verse_number, user_id[0].user_id]
  );
  if (result.length > 0) {
    res.json({ success: true, message: 'Like added successfully' });
  } else {
    res.json({ success: false, message: 'Failed to add like' });
  }
}
else{
  res.json({ success: false, message: 'User not found' });
}
});

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.json({ success: false, message: 'All fields are required' });
    return;
  }
  const usernameExists = await performQuery(
    'SELECT username FROM Users WHERE username = @param0',
    [username]
  );
  if (usernameExists.length > 0) {
    res.json({ success: false, message: 'Username already exists' });
    return;
  }
  const emailExists = await performQuery(
    'SELECT email FROM Users WHERE email = @param0',
    [email]
  );
  if (emailExists.length > 0) {
    res.json({ success: false, message: 'Email already exists' });
    return;
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
});

app.get('/api/surah/get/:surah_number', async (req, res) => {
  const { surah_number } = req.params;
  const result = await performQuery(
    'SELECT * FROM Verse WHERE surah_number = @param0',
    [surah_number]
  );
  res.json(result);
  
});

app.get('/api/surah/get/name/:surah_number', async (req, res) => {
  const { surah_number } = req.params;
  const result = await performQuery(
    'SELECT surah_name_arabic FROM Surah WHERE surah_number = @param0',
    [surah_number]
  );
  res.json(result);
});
app.get('/api/likes/get/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user_id = await performQuery(
            'SELECT user_id FROM Users WHERE username = @param0',
            [username]
        );

        if (user_id.length > 0) {
            const result = await performQuery(
                'SELECT verse_number FROM Liked_Verse WHERE user_id = @param0',
                [user_id[0].user_id]
            );
            res.json(result); 
        } else {
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(backendPort, () => {
    console.log(`Server is running on port ${backendPort}`);
});

let pool;
async function performQuery(query, params = []) {
    try {
        pool = await sql.connect(config);
        const request = pool.request();

        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });

        const result = await request.query(query);
        return result.recordsets[0];
    } catch (err) {
        console.error('SQL Error:', err.message);
    } finally {
        if (pool) await pool.close();
    }
}

(async () => {
  try {
    pool = await sql.connect(config);
    console.log(`Connected to SQL Server at ${serverName}:${sqlPort}, database: ${databaseName}`);

    app.get('/', (req, res) => {
      res.send(`Connected to database: ${databaseName} at port ${sqlPort}`);
    });

    app.listen(serverPort, () => {
      console.log(`HTTP server is running at http://localhost:${serverPort}`);
    });
  } catch (err) {
    console.error('Failed to connect to SQL Server:', err);
  }
})();