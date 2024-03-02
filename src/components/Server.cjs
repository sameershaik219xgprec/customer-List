const express = require('express');
const cors = require('cors'); 
const { Client } = require('pg');

const app = express();
const port = 3001;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sameer',  
  password: '12345678',
  port: 5432,
});

client.connect();

app.use(cors());  
app.use(express.json());  


app.get('/api/data', async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const sortBy = req.query.sortBy || '';

  try {
    let orderByClause = '';
    switch (sortBy) {
      case 'date':
        orderByClause = 'ORDER BY created_at::date';
        break;
      case 'time':
        orderByClause = 'ORDER BY created_at::time';
        break;
      default:
        orderByClause = 'ORDER BY s_no asc';
        break;
    }
    const result = await client.query(
      `SELECT * FROM customer ${orderByClause} OFFSET $1 LIMIT $2`,
      [offset, limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
