const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


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

let maxRoleId = 0;

  const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'View employee by manager',
            'View employees by department', 'View department budget','Add a department', 
            'Update employee role', 'Update employee manager','Add a role', 'Add an employee', 'Delete a record','Exit']
          },
      ]
    ).then(option =>{
        //Depending on selection user will be directed to appropriate prompts
        if(option.selection == 'View all departments'){
            viewDepartment();
            // promptUser();
        }
        else if(option.selection == 'View all roles'){
            viewRole();
        }
        else if(option.selection=='View all employees'){
            viewEmployee();
        }
        else if(option.selection=='View employee by manager'){
          viewEmployeeByManager();
        }
        else if(option.selection=='View employees by department'){
          viewEmployeeByDepartment();
        }
        else if(option.selection=='View department budget'){
          viewBudgetByDepartment();
        }
        else if(option.selection =='Add a department'){
            addDep();
        }
        else if(option.selection =='Add a role'){
            addRole();
        }
        else if(option.selection =='Add an employee'){
            addEmployee();
        }
        else if(option.selection == 'Update employee role'){
          updateEmployeeRole();
        }
        else if(option.selection == 'Update employee manager'){
          updateEmployeeManager();
        }
        else if(option.selection =="Delete a record"){
          deleteRecord();
        }
        else if(option.selection =='Exit'){
          process.exit();
      }
    });
};
  

function getRoles(){
  db.query(`SELECT * FROM role`, (err, rows) => {
    maxRoleId = rows.length;
    promptUser();
  });
}

function deleteRecord(){
  return inquirer.prompt([
    {
        type: 'list',
        name: 'selection',
        message: 'What type of record would you like to delete?',
        choices: ['Department', 'Role', 'Employee', 'Back to Main Menu']
      },
  ])
  .then(option=>{
    if(option.selection=='Department'){
      deleteDepartment();
    }
    if(option.selection=='Role'){
      deleteRole();
    }
    if(option.selection=='Employee'){
      deleteEmployee();
    }
    if(option.selection=='Back to Main Menu')
    promptUser();
  })
}

function deleteDepartment(){
  return inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: 'What is the id of the department?'
      }
  ]).then(dep =>{
      console.log(dep.department);
      const sql = `DELETE FROM department WHERE id = ?`;
        const params = [dep.department];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Removed department from the database');
          promptUser();
        });
  });
}

function deleteRole(){
  return inquirer.prompt([
    {
        type: 'input',
        name: 'role',
        message: 'What is the id of the role?'
      }
  ]).then(role =>{
      console.log(role.role);
      const sql = `DELETE FROM role WHERE id = ?`;
        const params = [role.role];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Removed role from the database');
          promptUser();
        });
  });
}
 
function deleteEmployee(){
  return inquirer.prompt([
    {
        type: 'input',
        name: 'employee',
        message: 'What is the id of the employee?'
      }
  ]).then(employee =>{
      console.log(employee.employee);
      const sql = `DELETE FROM employee WHERE id = ?`;
        const params = [employee.employee];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Removed employee from the database');
          promptUser();
        });
  });
}

//Get all the employees
function viewEmployee() {
  db.query(
    `SELECT employee.first_name AS "Employee Name", employee.last_name AS "Employee Last Name", role.title AS "Role Title", department.name AS "Department",
    role.salary AS "Salary", employee.first_name AS Manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee Manager ON employee.manager_id = employee.id`, (err, rows) => {
    console.table(rows);
    promptUser();
  });
}

function viewEmployeeByManager() {
  return inquirer.prompt([
    {
        type: 'input',
        name: 'manager',
        message: 'What is the id of the manager?'
      }
  ]).then(employee =>{
      //console.log(employee.manager);
      const sql =  `SELECT employee.first_name AS "Employee Name", employee.last_name AS "Employee Last Name", role.title AS "Role Title", department.name AS "Department",
      role.salary AS "Salary", employee.first_name AS Manager FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee Manager ON employee.manager_id = employee.id
      where employee.manager_id =?`;
        const params = [employee.manager];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          promptUser();
        });
  });
 
}

function viewEmployeeByDepartment() {
  return inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: 'What is the id of the department?'
      }
  ]).then(employee =>{
      //console.log(employee.manager);
      const sql =  `SELECT employee.first_name AS "Employee Name", employee.last_name AS "Employee Last Name", role.title AS "Role Title", department.name AS "Department",
      role.salary AS "Salary", employee.first_name AS Manager FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee Manager ON employee.manager_id = employee.id
      where department.id =?`;
        const params = [employee.department];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          promptUser();
        });
  });
 
}

function viewBudgetByDepartment() {
  return inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: 'What is the id of the department?'
      }
  ]).then(employee =>{
      //console.log(employee.manager);
      const sql =  `SELECT SUM(role.salary) AS "Department Budget" from employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      where department.id =?`;
        const params = [employee.department];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          promptUser();
        });
  });
 
}




function updateEmployeeRole() {
  return inquirer.prompt([
    {
        type: 'input',
        name: 'employee',
        message: 'What is the id of the employee?'
      },
      {
        type: 'input',
        name: 'role',
        message: 'What is the id of the new role?'
      }
  ]).then(employee =>{
      console.log(employee.employee);
      const sql = `UPDATE employee set role_id = ? WHERE id = ?`;
        const params = [employee.role, employee.employee];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Updated employee from the database');
          promptUser();
        });
  });
};
  

function updateEmployeeManager() {
  return inquirer.prompt([
    {
        type: 'input',
        name: 'employee',
        message: 'What is the id of the employee?'
      },
      {
        type: 'input',
        name: 'manager',
        message: 'What is the id of the new role?'
      }
  ]).then(employee =>{
      console.log(employee.employee);
      const sql = `UPDATE employee set manager_id = ? WHERE id = ?`;
        const params = [employee.manager, employee.employee];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Updated employee from the database');
          promptUser();
        });
  });
};
  
//Get all the department
function viewDepartment(){
    db.query(`SELECT * FROM department`, (err, rows) => {
        console.table(rows);
        promptUser();
      });
}

  //Get all the roles
  function viewRole(){
    db.query(`SELECT role.title AS "Title", role.salary AS "Salary", department.name AS "Department" FROM role
    LEFT JOIN department ON department.id = role.department_id`, (err, rows) => {
        console.table(rows);
        maxRoleId=rows.length;
        promptUser();
      });
};
  
function addDep(){
        return inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?'
              }
          ]).then(dep =>{
              console.log(dep.department);
              const sql = `INSERT INTO department (name) 
              VALUES (?)`;
                const params = [dep.department];

                db.query(sql, params, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log('Added table to the database');
                  promptUser();
                });
          });
        };


        
function addRole(){
    return inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
          },
          {
            type: 'input',
            name: 'dep',
            message: 'What is the department of the role?'
          }
      ]).then(role =>{
          console.log(role);
          const sql = `INSERT INTO role (title, salary, department_id) 
          VALUES (?, ?, ?)`;
            const params = [role.role, role.salary, role.dep];
            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log('Added row to the database');
              maxRoleId += 1;
              promptUser();
            });
      });
    };

    function addEmployee(){
        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employee\'s name?'
              },
              {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s name?'
              },
              {
                type: 'input',
                name: 'role',
                message: `What is the employee\'s role? (max: ${maxRoleId})`
              },
              {
                type: 'input',
                name: 'manager',
                message: 'What is the employee\'s manager?'
              }
          ]).then(employee =>{
              console.log(employee);
              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?)`;
                const params = [employee.firstName, employee.lastName, employee.role, employee.manager];
                db.query(sql, params, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log('Added row to the database');
                  promptUser();
                });
          });
        };

      getRoles();