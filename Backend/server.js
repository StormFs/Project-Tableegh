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

function getRandomVerse() {
  const surahindex = Math.floor(Math.random() * 114) + 1;
  const totalayahs = verseCounts[surahindex - 1];
  const ayahindex = Math.floor(Math.random() * totalayahs) + 1
  const surah = surahindex;
  const ayah = ayahindex;
  return {surah, ayah};
}


app.get('/api/randomayah', async (req, res) => {
  const { surah, ayah } = getRandomVerse();
  console.log(surah, ayah);
  const result = await performQuery('SELECT * FROM Verse v join Surah s on v.surah_number = s.surah_number  WHERE v.surah_number = @param0 AND v.verse_number = @param1', [surah, ayah]);
  if(result.length > 0){
    res.json({verse: result[0]});
  }else{
    res.json({verse: 'Verse not found'});
  }
});


const HadithCounts = [7276, 7562, 3956, 5274, 4341, 5761, 6293];

function getRandomHadith(){
  const Book = Math.floor(Math.random() * 7 + 1);
  const TotalHs = HadithCounts[Book - 1];
  const HadithNumber = Math.floor(Math.random() * TotalHs + 1);
  
  return {Book, HadithNumber};
  
}

app.get('/api/randomhadith', async (req, res) => {
  const {Book, HadithNumber} = getRandomHadith();
  const result = await performQuery('SELECT * FROM Hadith H Join Hadith_Book HB on HB.book_id = H.book_id WHERE H.hadith_id = @param0 AND H.book_id = @param1', [HadithNumber, Book]);
  if(result.length > 0){
    res.json({hadith: result[0]});
    
  }else{
    res.json({hadith: 'Hadith Not Found'});
  }
})

app.get('/api/search/:search', async (req, res) => {
  const { search } = req.params;
  const lowerCaseSearch = search.toLowerCase();
  const result = await performQuery('SELECT * FROM Verse V Join Surah S on V.Surah_Number = S.Surah_Number WHERE V.English LIKE @param0', [`%${lowerCaseSearch}%`]);
  res.json(result);
});

app.get('/api/searchsurah/:search', async (req, res) => {
  const { search } = req.params;
  const lowerCaseSearch = search.toLowerCase();
  const result = await performQuery('SELECT * FROM  Surah S WHERE S.aename LIKE @param0 OR S.surah_name_english LIKE @param0', [`%${lowerCaseSearch}%`]);
  res.json(result);
});

app.get('/api/searchchapter/:search', async (req, res) => {
  const { search } = req.params;
  const lowerCaseSearch = search.toLowerCase();
  const result = await performQuery('SELECT * FROM Hadith H WHERE H.english LIKE @param0', [`%${lowerCaseSearch}%`]);
  res.json(result);
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
                'SELECT v.*, s.surah_name_arabic FROM (Liked_Verse lv JOIN Verse v ON lv.surah_number = v.surah_number AND lv.verse_number = v.verse_number) JOIN Surah s ON v.surah_number = s.surah_number WHERE lv.user_id = @param0 ORDER BY v.verse_number',
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

app.post('/api/liked-hadiths', async (req, res) => {
  const { username, hadith_id, book_id } = req.body;
  console.log(username, hadith_id, book_id);
  const user_id = await performQuery(
    'SELECT user_id FROM Users WHERE username = @param0',
    [username]
  );
  const check_like = await performQuery(
    'SELECT * FROM Liked_Hadith WHERE hadith_id = @param0 AND user_id = @param1 AND book_id = @param2',
    [hadith_id, user_id[0].user_id, book_id]
  );
  if (check_like.length > 0) {
    await performQuery(
      'DELETE FROM Liked_Hadith WHERE hadith_id = @param0 AND user_id = @param1 AND book_id = @param2',
      [hadith_id, user_id[0].user_id, book_id]
    );
    res.json({ success: true, message: 'Liked hadith removed successfully' });
  }
  else{
    const result = await performQuery(
      'INSERT INTO Liked_Hadith (hadith_id, user_id, book_id) OUTPUT Inserted.user_id VALUES (@param0, @param1, @param2)',
      [hadith_id, user_id[0].user_id, book_id]
    );
    if (result.length > 0) {
      res.json({ success: true, message: 'Liked hadith added successfully' });
    } else {
      res.json({ success: false, message: 'Failed to add like' });
    }
  }
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
                'SELECT surah_number, verse_number FROM Liked_Verse WHERE user_id = @param0',
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

app.get('/api/hadithbooks/get', async (req, res) => {
  const result = await performQuery('SELECT * FROM Hadith_Book');
  res.json(result);
});

app.get('/api/hadith/:book_id/chapters', async (req, res) => {
  const { book_id } = req.params; 
  const result = await performQuery('SELECT DISTINCT chapter,sanad FROM Hadith WHERE book_id = @param0', [book_id]);
  res.json(result);
});

app.get('/api/hadith/:book_id/chapters/:chapter', async (req, res) => {
  var { book_id, chapter } = req.params
  const result = await performQuery('SELECT * FROM Hadith WHERE book_id = @param0 AND chapter = @param1', [book_id, chapter]);
  res.json(result);
});

app.get('/api/liked-hadiths/:username/:book_id/:hadith_id', async (req, res) => {
  const { username, book_id, hadith_id } = req.params;
  const user_id = await performQuery('SELECT user_id FROM Users WHERE username = @param0', [username]);
  if (user_id.length > 0) {
    const result = await performQuery('SELECT * FROM Liked_Hadith WHERE hadith_id = @param0 AND user_id = @param1 AND book_id = @param2', [hadith_id, user_id[0].user_id, book_id]);
    res.json(result);
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

app.get('/api/liked-hadiths/:username', async (req, res) => {
  const { username } = req.params;
  const user_id = await performQuery('SELECT user_id FROM Users WHERE username = @param0', [username]);
  if (user_id.length > 0) {
    const result = await performQuery('SELECT * FROM Liked_Hadith WHERE user_id = @param0', [user_id[0].user_id]);
    res.json(result);
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

app.get('/api/liked-hadith/:username', async (req, res) => {
  const { username } = req.params;
  const user_id = await performQuery('SELECT user_id FROM Users WHERE username = @param0', [username]); 
  if (user_id.length > 0) {
    const result = await performQuery('SELECT Hadith.book_id, Hadith.chapter, Hadith.hadith_id, Hadith.arabic, Hadith.english, Hadith.grade, Hadith.sanad FROM Liked_Hadith join Hadith on Liked_Hadith.hadith_id = Hadith.hadith_id and Liked_Hadith.book_id = Hadith.book_id WHERE user_id = @param0', [user_id[0].user_id]);
    res.json(result);
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

app.delete('/api/liked-hadiths/:username/:book_id/:hadith_id', async (req, res) => {
  const { username, book_id, hadith_id } = req.params;
  const user_id = await performQuery('SELECT user_id FROM Users WHERE username = @param0', [username]);
  if (user_id.length > 0) {
    await performQuery('DELETE FROM Liked_Hadith WHERE hadith_id = @param0 AND user_id = @param1 AND book_id = @param2', [hadith_id, user_id[0].user_id, book_id]);
    res.json({ success: true, message: 'Liked hadith removed successfully' });
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