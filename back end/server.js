const mysql = require('msnodesqlv8');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express();
const port = 8000;
const mydb = "server=LAPTOP-N7BMTU7V\\SQLEXPRESS;Database=QuizCorrections;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
/*const mydb = {
    server: 'LAPTOP-N7BMTU7V\\SQLEXPRESS',
    database: 'QuizCorrections',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        encrypt: false // For local development, you might need this
    },
    driver: 'ODBC Driver 17 for SQL Server'
};*/

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
        saveUnitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

const verifyJWT = (req, res, next) => {
    const token = req.headers("x-access-token");
    if(!token)
        res.send("No token");
    else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err)
                res.json({auth: false, message: "Authentication failed"});
            else {
                req.username = decoded.username;
                next();
            }
        })
    }
}

app.post('/register', async (req, res) => {
    const query = "INSERT INTO USERS (firstName, lastName, username, password) VALUES (@firstName, @lastName, @username, @password)";
    console.log(req.body.firstName);
    const insertQuery = `INSERT INTO USERS (firstName, lastName, username, password) VALUES ('${req.body.firstName}', '${req.body.lastName}', '${req.body.username}', '${req.body.password}') `;
    mysql.query(mydb, insertQuery, (err, rows) => {
        console.log(insertQuery);
        if (err){
            console.log(err);
            if (err.code == 2627)
            {
                console.log("Duplicate key error")
                return res.json("Duplicate key error");
            }
            else if (err.code == 2628) 
            {
                console.log("Too long");
                return res.json("Too long error");
        }} else{
            console.log("OKAY");
            return res.json(rows);
    }});
})

app.post('/login', async (req, res) => {
    const query = "SELECT * FROM USERS WHERE username='" + req.body.username + "' AND password='" + req.body.password + "'";
    mysql.query(mydb, query, (err, rows) => {
        console.log(query),
        console.log(rows)
        if (rows.length === 0)
            return res.json("DNE");
        else {    
            const username = rows[0].username;
            const token = jwt.sign({username}, "jwtSecret", { expiresIn: 300 });
            req.session.user = rows;
            loggedInUser = username;
            return res.json({auth: true, token: token, result: rows});
        }
})});

app.post('/logout', async(req, res) => {
    loggedInUser = '';
    return res.send(loggedInUser);
})

app.get('/', (req, res) => {
    res.send('Hello, World!');
    console.log("hello world");
});

app.get('/loggedInUser', (req,res) => {
    
    res.send(loggedInUser);
    console.log("Sent Logged In User: " + loggedInUser);
});

app.get('/mysets', (req,res) => {
    const query = "SELECT * FROM FLASHCARDSETS WHERE createdBy='" + loggedInUser + "'";
    mysql.query(mydb, query, (err, rows) => {
        console.log(query),
        console.log(rows)
        return res.json(rows);
    });
});

app.get('/viewset/:setID', (req, res) => {
    const setID = parseInt(req.params.setID, 10);
    const query = "SELECT * FROM FLASHCARDDETAILS WHERE setID=" + setID;
    mysql.query(mydb, query, (err, rows) => {
        console.log(query),
        console.log(rows);
        return res.json(rows);
    })
});

app.get('/getname/:setID', (req, res) => {
    console.log("getting name");
    const setID = parseInt(req.params.setID, 10);
    const query = "SELECT * FROM FLASHCARDSETS WHERE setID=" + setID;
    mysql.query(mydb, query, (err, rows) => {
        console.log(query), 
        console.log(rows);
        return res.json(rows);
    })
});

app.post('/createSet', (req, res) => {
    console.log(loggedInUser);
    const insertQuery = `INSERT INTO FLASHCARDSETS (setName, createdBy, createdDate) OUTPUT INSERTED.setID VALUES ('${req.body.setName}', '${loggedInUser}', CURRENT_TIMESTAMP)`;
    mysql.query(mydb, insertQuery, (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error creating set' });
      } else {
        const setId = rows[0].setID;
        console.log(`Set created with ID: ${setId}`);
        createDetailsID = setId;
        return res.json({ setId });
      }
    });
  });

  app.post('/addCards', (req, res) => {
    const { setID, cards } = req.body;   
    const insertQueries = cards.map((card, index) => {
      return `INSERT INTO FLASHCARDDETAILS (setID, qID, question, answer, reason) 
              VALUES (${setID}, ${index + 1}, '${card.question}', '${card.answer}', '${card.reason}')`;
    });
  
    let successCount = 0;
    insertQueries.forEach(query => {
      mysql.query(mydb, query, (err, rows) => {
        if (err) {
          console.log(`Error inserting card: ${query}`, err);
        } else {
          successCount++;
        }
        // Send response after all queries have been processed
        if (successCount === cards.length) {
          res.json({ message: 'All cards inserted successfully' });
        }
      });
    });
  });
  app.post('/deleteSet', (req, res) => {
    const deleteSetQuery = `DELETE FROM FLASHCARDSETS WHERE setID = ${req.body.setID}`;
    const deleteCardsQuery = `DELETE FROM FLASHCARDDETAILS WHERE setID = ${req.body.setID}`;
    mysql.query(mydb, deleteSetQuery, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete set' });
        }
        mysql.query(mydb, deleteCardsQuery, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete set details' });
            }
            return res.status(200).json({ message: 'Set and details deleted successfully' });
        });
    });
});
    app.get('/editset/:setID', (req, res) => {
        const setID = parseInt(req.params.setID, 10);
        const query = "SELECT question, answer, reason FROM FLASHCARDDETAILS WHERE setID=" + setID;
        mysql.query(mydb, query, (err, rows) => {
            console.log(query),
            console.log(rows);
            return res.json(rows);
        })
    });
    app.post('/updateCards', (req, res) => {
        const { setName, setID, cards } = req.body;   
        const deleteCardsQuery = `DELETE FROM FLASHCARDDETAILS WHERE setID = ${req.body.setID}`;
        mysql.query(mydb, deleteCardsQuery, (err, deleteRes) => {
            if (err) {
                console.log("Error deleting cards:", err);
                return res.status(500).json({ message: 'Error deleting cards' });
            }
    
            // Update setName for the setID
            const updateNameQuery = `UPDATE FLASHCARDSETS SET setName = '${setName}' WHERE setID = ${setID}`;
            mysql.query(mydb, updateNameQuery, (err, updateRes) => {
                if (err) {
                    console.log("Error updating setName:", err);
                    return res.status(500).json({ message: 'Error updating setName' });
                }
    
                // Insert new cards
                const insertQueries = cards.map((card, index) => {
                    return `INSERT INTO FLASHCARDDETAILS (setID, qID, question, answer, reason) VALUES (${setID}, ${index + 1}, '${card.question}', '${card.answer}', '${card.reason}')`;
                });
    
                let successCount = 0;
                insertQueries.forEach(query => {
                    mysql.query(mydb, query, (err, insertRes) => {
                        if (err) {
                            console.log(`Error inserting card: ${query}`, err);
                        } else {
                            successCount++;
                        }
    
                        // Send response after all queries have been processed
                        if (successCount === cards.length) {
                            res.json({ message: 'All cards updated successfully' });
                        }
                    });
                });
            });
        });
    });
/*
app.put('/api/users/registration', (req, res) => {
    console.log(req.body);
    //const { firstName, lastName, username, password } = req.body;

    //const insertQuery = "INSERT INTO USERS (firstName, lastName, username, password) VALUES (@firstName, @lastName, @username, @password)";
   // const request = new mysql.Request();
    const insertQuery = `INSERT INTO USERS (firstName, lastName, username, password) VALUES ('${req.query.firstName}', '${req.query.lastName}', '${req.query.username}', '${req.query.password}') `;
    // request.input('firstName', sql.NVarchar, firstName);
    // request.input('lastName', sql.NVarchar, lastName);
    // request.input('username', sql.NVarchar, username);
    // request.input('password', sql.NVarchar, password);
    /*request.query(insertQuery, (err, result) => {
        if (err)
            console.log("Error executing query", err)
      else   
            console.log("Insertion success!");
    })*/
/*
    console.log(insertQuery);
    mysql.query(db, insertQuery, (err, rows) => {
        if (err)
        {
            console.log(err);
            if (err.code == 2627)
                res.send("Duplicate key error")
            else
                res.send("NOT OKAY");
        }
        else
        {
           console.log(rows);
           res.send("OKAY");
        }
    });
});

/*const query2 = "INSERT INTO USERS (firstName, lastName, username, password) VALUES ('pua3','peeg3','pua3','carrot3')"
console.log("Starting insertion...");
mysql.query(db, query2, (err, result) => {
    if (err)
        console.log("Error executing query", err)
    else   
        console.log("Insertion success!");
})


const query = "SELECT * from USERS"

console.log("Starting query execution...");
mysql.query(db, query, (err, rows) => {
    if (err) {
        console.log("Error executing query", err)
    }
    else {
        for (var i = 0; i < rows.length; i++)
            console.log(rows[i])
    }
})*/

