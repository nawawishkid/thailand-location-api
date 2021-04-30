require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const { query, validationResult } = require("express-validator");
const app = express();
const PORT = parseInt(process.env.PORT || 3000);
var conn;
const handleDisconnect = () => {
  conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306,
    multipleStatements: true,
    // debug: true,
  });

  conn.on("error", err => {
    if (err.code == `PROTOCOL_CONNECTION_LOST`) {
      handleDisconnect();
    } else {
      throw err;
    }
  });

  return conn;
};

handleDisconnect();

const handleError = () => (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

app.get(
  `/locations`,
  query("field").matches(/^(zipcode|province|district|subdistrict)+$/),
  query("value").notEmpty(),
  handleError(),
  (req, res) => {
    console.log(`\n\nstart querying...`);
    const { field, value } = req.query;
    let statement = `select * from location where `;

    if (field == "zipcode") {
      statement += `CAST(zipcode AS CHAR) like ?`;
    } else {
      statement += `${field} like ?`;
    }

    console.log(`field: `, field);
    console.log(`value: `, value);
    console.log(`statement: `, statement);

    const query = conn.query(statement, [`%${value}%`], (err, results) => {
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
    });

    console.log(`query: `, query.sql);
  }
);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
