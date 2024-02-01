const inquirer = require('inquirer');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// mysql connection 
const connection = mysql.createConnection({
    host: 'local host',
    // port: "3001",
    user: 'user',
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

