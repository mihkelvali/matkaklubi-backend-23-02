import express from "express";
import cors from "cors";
import pg from "pg";

const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/treks", async (req, res) => {
  const columns = req.query.columns;
  const status = req.query.status;
  let sql = '';
  let sqlColumns = '*';
  let sqlAdditionalFilters = '';

  if (columns !== undefined) {
    sqlColumns = columns.toString();
  }
  if (status !== undefined) {
    sqlAdditionalFilters += `WHERE status='${status}'`
  }

  sql = `SELECT ${sqlColumns} FROM treks ${sqlAdditionalFilters} ORDER BY id;`
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows));
});

app.get("/treks/:trekId", async (req, res) => {
  const sql = `SELECT * FROM treks WHERE id=${req.params.trekId} ORDER BY id;`
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows[0]));
});

app.post("/treks", async (req, res) => {
  const sql = `
    INSERT INTO treks (title, description, image_url, duration, status) 
    VALUES ('${req.body.title}', '${req.body.description}', '${req.body.image_url}', '${req.body.duration}', '${req.body.status}');
  `
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows));
});

app.post("/treks/:trekId/signup", async (req, res) => {
  const sql = `
    INSERT INTO customers (name, age, note, trek_id) 
    VALUES ('${req.body.name}', ${req.body.age}, '${req.body.note}', ${req.params.trekId});
  `
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows));
});

app.put("/treks/:trekId", async (req, res) => {
  console.log(req.body);
  const sql = `
    UPDATE treks
    SET
      title='${req.body.title}',
      description='${req.body.description}',
      image_url='${req.body.image_url}',
      duration='${req.body.duration}',
      status='${req.body.status}'
    WHERE id=${req.params.trekId};
  `
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows));
});

app.delete("/treks/:trekId", async (req, res) => {
  const sql = `DELETE FROM treks WHERE id=${req.params.trekId};`;
  console.log(sql);
  const { rows } = await pool.query(sql);
  res.send(JSON.stringify(rows))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
