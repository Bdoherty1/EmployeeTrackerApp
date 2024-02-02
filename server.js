const inquirer = require('inquirer');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// mysql connection 
const connection = mysql.createConnection({
    host: 'local host',
    // PORT: "3001",
    user: 'root',
    password: 'your password',
    database: 'employeeTracker_db',
},
console.log(`Connected to the employeeTracker_db database.`)
);
// connect to the database error
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    // start the application
    start();
});

function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            messege: "What would you like to do ?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role"
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all Departments":
                    viewAllDepartments();
                        break;
                case "View All Roles":
                    viewAllRoles();
                        break;
                case "View All Employees":
                    viewAllEmployees();
                        break;
                case "Add A Department":
                    addDepartment();
                        break;
                case "Add A Role":
                    addRole();
                        break;
                case "Add An Employee":
                    addEmployee();
                        break;
                case "Update An Employee Role":
                    updateEmployeeRole();
                        break;
            }
        });

}

function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, 
        (err, res) => {
            if (err) throw err;
            console.table(res);
            // restart app//
            start();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:',
        },
    ]) .then ((answers) => {
        connection.query('INSERT INTO department SET ?', { name: answers.departmentName }, (err, res) => {
            if (err) throw err;
            console.log(`Department "${answers.departmentName}" added successfully.`);
            start();
        });
    });
}

// Implement the logic to add a role to the database
// Use inquirer.prompt to get necessary information from the user
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role:',
        },
        {
            type: 'input',
            name: 'Salary',
            message: 'Enter the salary of the new role:',
        },
        {
            type: 'input',
            name: 'departmantId',
            message: 'Enter the departmant ID of the new role:',
        },

    ]).then((answers) => {
        connection.query('INSERT INTO role SET ?', { title: answers.title, salary: answers.salary, departmentId: answers.departmentId }, (err, res) => {
            if (err) throw err;
            console.log('Role "${answers.title}" added successfully.');
            start();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the new employee:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the new employee:',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID of the new employee:',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID  of the new employee:',
        },
    ]).then((answers) => {
        connection.query('INSERT INTO employee SET ?', { first_name: answers.firstName, last_name: answers.lastName, role_id: answers.roleId, manager_id: answers.managerId }, (err, results) => {
            if (err) throw err;
            console.log(`Employee "${answers.firstName} ${answers.lastName}" added successfully.`);
            start();
        });
    });
}

function updateEmployeeRole() {
    // Get the list of employees to choose from
    connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee', (err, employees) => {
        if (err) throw err;

        // Get the list of roles to choose from
        connection.query('SELECT id, title FROM roles', (err, roles) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee you want to update:',
                    choices: employees.map(employee => ({ name: employee.full_name, value: employee.id })),
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({ name: role.title, value: role.id })),
                },
            ]).then((answers) => {
                // Update the employee's role in the database
                connection.query(
                    'UPDATE employee SET role_id = ? WHERE id = ?',
                    [answers.roleId, answers.employeeId],
                    (err, result) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully.');
                        start();
                    }
                );
            });
        });
    });
}