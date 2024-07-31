const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express();
const port = 8000;

const pool = new Pool({
    user: 'your_user',
    host: 'your_host',
    database: 'QuizCorrections',
    password: 'your_password',
    port: 5432,
});

let loggedInUser = '';
let createDetailsID = 0;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.listen(port, () => console.log(`Server started on port: ${port}`));

app.use(
    session({
        key: "username",
        secret: "sessionpw",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token)
        res.send("No token");
    else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err)
                res.json({ auth: false, message: "Authentication failed" });
            else {
                req.username = decoded.username;
                next();
            }
        })
    }
}

app.post('/register', async (req, res) => {
    const insertQuery = `INSERT INTO USERS (firstName, lastName, username, password) VALUES ($1, $2, $3, $4)`;
    const values = [req.body.firstName, req.body.lastName, req.body.username, req.body.password];
    try {
        const result = await pool.query(insertQuery, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            console.log("Duplicate key error");
            res.json("Duplicate key error");
        } else if (err.code === '22001') {
            console.log("Too long");
            res.json("Too long error");
        } else {
            res.status(500).json("Error");
        }
    }
});

app.post('/login', async (req, res) => {
    const query = "SELECT * FROM USERS WHERE username=$1 AND password=$2";
    const values = [req.body.username, req.body.password];
    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            res.json("DNE");
        } else {
            const username = result.rows[0].username;
            const token = jwt.sign({ username }, "jwtSecret", { expiresIn: 300 });
            req.session.user = result.rows;
            loggedInUser = username;
            res.json({ auth: true, token: token, result: result.rows });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

app.post('/logout', (req, res) => {
    loggedInUser = '';
    res.send(loggedInUser);
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/loggedInUser', (req, res) => {
    res.send(loggedInUser);
});

app.get('/mysets', async (req, res) => {
    const query = "SELECT * FROM FLASHCARDSETS WHERE createdBy=$1";
    const values = [loggedInUser];
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

app.get('/viewset/:setID', async (req, res) => {
    const setID = parseInt(req.params.setID, 10);
    const query = "SELECT * FROM FLASHCARDDETAILS WHERE setID=$1";
    const values = [setID];
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

app.get('/getname/:setID', async (req, res) => {
    const setID = parseInt(req.params.setID, 10);
    const query = "SELECT * FROM FLASHCARDSETS WHERE setID=$1";
    const values = [setID];
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

app.post('/createSet', async (req, res) => {
    const insertQuery = `INSERT INTO FLASHCARDSETS (setName, createdBy, createdDate) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING setID`;
    const values = [req.body.setName, loggedInUser];
    try {
        const result = await pool.query(insertQuery, values);
        const setId = result.rows[0].setid;
        createDetailsID = setId;
        res.json({ setId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating set' });
    }
});

app.post('/addCards', async (req, res) => {
    const { setID, cards } = req.body;
    try {
        const insertQueries = cards.map((card, index) => {
            return pool.query(`INSERT INTO FLASHCARDDETAILS (setID, qID, question, answer, reason) VALUES ($1, $2, $3, $4, $5)`, [setID, index + 1, card.question, card.answer, card.reason]);
        });
        await Promise.all(insertQueries);
        res.json({ message: 'All cards inserted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding cards' });
    }
});

app.post('/deleteSet', async (req, res) => {
    const deleteSetQuery = `DELETE FROM FLASHCARDSETS WHERE setID=$1`;
    const deleteCardsQuery = `DELETE FROM FLASHCARDDETAILS WHERE setID=$1`;
    const values = [req.body.setID];
    try {
        await pool.query(deleteSetQuery, values);
        await pool.query(deleteCardsQuery, values);
        res.status(200).json({ message: 'Set and details deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete set' });
    }
});

app.get('/editset/:setID', async (req, res) => {
    const setID = parseInt(req.params.setID, 10);
    const query = "SELECT question, answer, reason FROM FLASHCARDDETAILS WHERE setID=$1";
    const values = [setID];
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

app.post('/updateCards', async (req, res) => {
    const { setName, setID, cards } = req.body;
    try {
        const deleteCardsQuery = `DELETE FROM FLASHCARDDETAILS WHERE setID=$1`;
        await pool.query(deleteCardsQuery, [setID]);

        const updateNameQuery = `UPDATE FLASHCARDSETS SET setName=$1 WHERE setID=$2`;
        await pool.query(updateNameQuery, [setName, setID]);

        const insertQueries = cards.map((card, index) => {
            return pool.query(`INSERT INTO FLASHCARDDETAILS (setID, qID, question, answer, reason) VALUES ($1, $2, $3, $4, $5)`, [setID, index + 1, card.question, card.answer, card.reason]);
        });
        await Promise.all(insertQueries);

        res.json({ message: 'All cards updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating cards' });
    }
});