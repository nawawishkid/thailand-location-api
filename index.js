require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = parseInt(process.env.PORT || 3000);
const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 3306,
  multipleStatements: true,
  debug: true,
});

app.get(`/locations`, (req, res) => {
  const { zipcode } = req.query;

  console.log(`zipcode: ${zipcode}`);

  if (!zipcode)
    return res
      .status(400)
      .json({ message: `"zipcode" query parameter is required` });

  console.log(`start querying...`);

  conn.query(
    `select * from location where zipcode = ?`,
    [zipcode],
    (err, results) => {
      console.log(`queried!!`);
      console.log(`err: ${err}`);

      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Some error occurred, please contact the developer",
        });
      }

      console.log(`results: ${results}`);

      return res.json({ data: results });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
