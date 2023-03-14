import express from "express";
import cors from "cors";
import pg from "pg";

const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/treks", async (req, res) => {
  const status = req.query.status;
  let sqlAdditionalFilters = '';
  if (status !== undefined) {
    sqlAdditionalFilters += `WHERE status = ${status}`
  }

  const { rows } = await pool.query(`SELECT * FROM treks ${sqlAdditionalFilters};`);
  res.send(JSON.stringify(rows));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
