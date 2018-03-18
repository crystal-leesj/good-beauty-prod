var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lees6',
  password        : '2185',
  database        : 'cs340_lees6'
});
module.exports.pool = pool;
