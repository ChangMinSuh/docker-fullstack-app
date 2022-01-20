const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());
db.pool.query(
  `CREATE TABLE lists(
   id INTEGER AUTO_INCREMENT,
   value TEXT,
   PRIMARY KEY (id)
 )`,
  (err, results, fileds) => {
    console.log("results:", results);
  }
);

app.get("/api/values", (req, res) => {
  db.pool.getConnection((err, conn) => {
    if (err) throw err;
    conn.query("SELECT * FROM lists;", (err, results, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      return res.json(results);
    });

    conn.release();
  });
});

app.post("/api/values", (req, res, next) => {
  db.pool.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(
      `INSERT INTO lists (value) VALUES ("${req.body.value}")`,
      (err, results, fields) => {
        if (err) return res.status(500).send(err);

        return res.json({ success: true, value: req.body.value });
      }
    );

    conn.release();
  });
});

app.listen(5000, () => {
  console.log("애플리케이션이 5000번 포트에서 시작.");
});
