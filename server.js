const express = require('express');

const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const path = require('path');
 
const app = express();

const port = 3000;
 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // เปลี่ยนเป็นโฟลเดอร์ที่ใช้เก็บไฟล์ static
 
const db = new sqlite3.Database('./neww.db', (err) => {

    if (err) {

        console.error("Could not connect to database:", err.message);

    } else {

        console.log("Connected to the database.");

    }

});
 
app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}`);

});
 
app.get('/all-data', (req, res) => {

    const tables = ['express', 'orders', 'raw_material', 'employee', 'in_come', 'customer', 'buffetprice'];

    const data = {};

    let completedQueries = 0;

    tables.forEach((table) => {

        const query = `SELECT * FROM ${table}`;

        db.all(query, (err, rows) => {

            if (err) {

                console.error(`Error fetching data from table ${table}:`, err.message);

                return res.status(500).json({ error: err.message });

            }

            data[table] = rows;

            completedQueries++;

            if (completedQueries === tables.length) {

                res.json(data);

            }

        });

    });

});
 
app.get('/search-data', (req, res) => {

    const tableName = req.query.table;

    if (!tableName) {

        return res.status(400).json({ error: 'Table name is required' });

    }

    let query = `SELECT * FROM ${tableName}`;

    const params = [];

    if (req.query.column && req.query.value) {

        query += ` WHERE ${req.query.column} = ?`;

        params.push(req.query.value);

    }
 
    db.all(query, params, (err, rows) => {

        if (err) {

            console.error(`Error fetching data:`, err.message);

            return res.status(500).json({ error: err.message });

        }

        res.json(rows);

    });

});
 
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'index.html'));

});

 