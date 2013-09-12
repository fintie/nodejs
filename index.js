/*
 * Connection params for database
 */

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

var connect = connection.connect(function(err){
  if(!err){
        console.log("You are connected to the database.");
  }
  else{
        throw err;
  }
});

var end = connection.end(function(err){
  if(!err){
        console.log("Mysql connection is terminated.");
  }
  else{
        throw err;
  }
});

module.exports = {
  connect: connect,
  connection: connection,
  end: end,
};