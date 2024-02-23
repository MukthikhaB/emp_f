const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3003;

const pool = new Pool({
    host: "localhost",
    database: "employee_form",
    port: 5432,
    user: "postgres",
    password: "root"
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', async (req, res) => {
    try {
        const { name, emp_id, department, dob, gender, designation, salary } = req.body;

        if (!name || !emp_id || !department || !dob || !gender || !designation || !salary) {
            return res.status(400).json({ message: 'Form data is incomplete.' });
        }

        await pool.query('INSERT INTO employees_form (name, emp_id, department, dob, gender, designation, salary) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [name, emp_id, department, dob, gender, designation, salary]);

        res.status(200).json({ message: 'Form submitted successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
