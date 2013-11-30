var  mssql = require('mssql');
module.exports = connectToSQL;
/*Setup SQL Database*/
function connectToSQL(config) {
  var sqlCon  = new mssql.Connection(config, function(err){
    if(err) {
      console.log(err);
    } 
    else {
      console.log("Database connection \tOK");
      
      // Create Tables
      var request = new mssql.Request(sqlCon);
      request.query("IF NOT EXISTS ("+
        "SELECT * FROM sys.tables "+
        "WHERE name='users') "+
        "CREATE TABLE users ("+
        "uid int IDENTITY(1,1) PRIMARY KEY,"+
        "username varchar(255) UNIQUE,"+
        "password varchar(100),"+
        "email varchar(255) UNIQUE)",
      function(err, result){
        if(err) {
          console.log(err);
        } 
        else {
          console.log("Table users \t\tOK");
        }
      });

      var request = new mssql.Request(sqlCon);
      request.query("IF NOT EXISTS ("+
        "SELECT * FROM sys.tables "+
        "WHERE name='statuses') "+
        "CREATE TABLE statuses ("+
        "statusid int IDENTITY(1,1) PRIMARY KEY,"+
        "status varchar(255),"+
        "uid_fk int,"+
        "created varchar(255),"+
        "FOREIGN KEY(uid_fk) REFERENCES users(uid))",
      function(err, result){
        if(err) {
          console.log(err);
        } 
        else {
          console.log("Table statuses \t\tOK");
        }
      });

      var request = new mssql.Request(sqlCon);
      request.query("IF NOT EXISTS ("+
        "SELECT * FROM sys.tables "+
        "WHERE name='comments') "+
        "CREATE TABLE comments ("+
        "comment varchar(255),"+
        "statusid_fk int,"+
        "uid_fk int,"+
        "created varchar(255),"+
        "FOREIGN KEY(uid_fk) REFERENCES users(uid),"+
        "FOREIGN KEY(statusid_fk) REFERENCES statuses(statusid))",
      function(err, result){
        if(err) {
          console.log(err);
        } 
        else {
          console.log("Table comments \t\tOK");
        }
      });

      var request = new mssql.Request(sqlCon);
      request.query("IF NOT EXISTS "+
        "(SELECT * FROM users WHERE username = 'Will') "+
        "INSERT INTO users VALUES "+
        "('Will','willtest','will.kehayioff@gmail.com')",
      function(err, result){
        if(err) {
          console.log(err);
        } 
        else {
          console.log("User Will \t\tOK");
        }
      });
    }
  });
  return sqlCon;
}
