var mysql = require("mysql");
const { threadId } = require("worker_threads");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",

  database: "EMPLOYEE_TRACKER",
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log('I have connected to the database with the id ', connection.threadId)

});
module.exports= connection;