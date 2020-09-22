//I put this on a separete folder just to make the index.js more neat
//Here i am requiring the dependencies .
var mysql = require("mysql");
const { threadId } = require("worker_threads");
//This is where i create an instanse of the connection
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",

  database: "EMPLOYEE_TRACKER",
});
// and here is where the connection actually start's
connection.connect(function (err) {
  if (err) throw err;
  // console.log('I have connected to the database with the id ', connection.threadId)

});
module.exports= connection;