const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'workforce'
    },
    console.log('Connected to the workforce database.')
  );




//Get all the employees
  db.query(`SELECT * FROM employee`, (err, rows) => {
    console.log(rows);
  });

  
  
//Get all the department
db.query(`SELECT * FROM department`, (err, rows) => {
    console.log(rows);
  });

  //Get all the roles
db.query(`SELECT * FROM role`, (err, rows) => {
    console.log(rows);
  });

  
  