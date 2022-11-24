import mysql from "mysql";
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password123#@!',
    database: 'discount'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
    var sql = "INSERT INTO Discounts (Title, Status, Method, Type, Combine_With, Used) VALUES('jjjkg', 'active', 'code', 'Valume', 'Product', 2 )";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("insert data successfully");
    });

  });
  