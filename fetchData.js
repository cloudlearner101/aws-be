const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Check if required environment variables are defined
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'DB_CONNECTION_LIMIT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is not defined.`);
    process.exit(1); // Exit the process with an error code
  }
}

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
});

app.get('/DHPC/fetchAll', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch all data from a table
    const [rows] = await connection.query('SELECT * FROM PermitData');

    // Release the connection back to the pool
    connection.release();

    // Send the fetched data as a JSON response
    res.json({ data: rows });
    console.log('Fetched all data successfully');
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/DHPC/fetchByDate', async (req, res) => {
  try {
    // Extract start date and end date from the request query parameters
    const { startDate, endDate } = req.query;

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch data between the specified start and end dates (date portion only)
    const query = `SELECT * FROM PermitData WHERE DATE(StartDateTime) >= ? AND DATE(EndDateTime) <= ?`;
    const [rows] = await connection.query(query, [startDate, endDate]);

    // Release the connection back to the pool
    connection.release();

    // Send the fetched data as a JSON response
    res.json({ data: rows });
    console.log('Fetched data by date successfully');
  } catch (error) {
    console.error('Error fetching data by date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
