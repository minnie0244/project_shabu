const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// เชื่อมต่อฐานข้อมูล SQLite
const db = new sqlite3.Database('./neww.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// เปิดใช้งาน middleware สำหรับการประมวลผล JSON และ static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // สมมติว่าไฟล์ HTML อยู่ในโฟลเดอร์ public

// ตัวอย่างการเรียกข้อมูลจากตาราง customer
app.get('/api/customers', (req, res) => {
    const sql = 'SELECT * FROM customer';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});
// Endpoint สำหรับค้นหาข้อมูลในตาราง customer
app.get('/api/search/customers', (req, res) => {
    const searchQuery = req.query.q; // รับคำค้นหาจาก URL parameter
    const sql = `SELECT * FROM customer WHERE firstName LIKE ? OR lastName LIKE ?`; // ตัวอย่างการค้นหาในตาราง customer
    const params = [`%${searchQuery}%`, `%${searchQuery}%`];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});


// ปิดการเชื่อมต่อฐานข้อมูลเมื่อหยุดใช้งานแอป
app.on('close', () => {
    db.close();
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'table.html'));
})


});

