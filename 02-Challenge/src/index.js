import dotenv from 'dotenv';
dotenv.config();

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


import inquirer from 'inquirer';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

const query = async (sql, values) => {
  try {
    const res = await pool.query(sql, values);
    return res;
  } catch (err) {
    console.error('Error querying the database:', err);
    throw err;
  }
}


const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

async function mainMenu(){
    const action = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles','Add Role', 'View All Departments', 'Add Department','Update Manager','View Employees by Manager','Budget by Department','Delete Data','Budget by Department',  'Quit'],
    }); 

    switch (action.action) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Update Manager':
            updateManager();
            break;
        case 'View Employees by Manager':
            viewEmployeesByManager();
            break;
        case 'view Employees by Department':
            viewEmployeesByDepartment();
            break;
        case 'Delete Data':
            deleteData();
            break;
        case 'Budget by Department':
            BudgetByDepartment();
            break;
        case 'Quit':
            process.exit(0);
    }
}

async function viewEmployees(){
    const { rows } = await query('SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id' + ' LEFT JOIN department ON role.department_id = department.id');
    console.table(rows);
    mainMenu();
}

async function addEmployee(){
    const newEmployee = await inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: 'Enter employee first name:'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter employee last name:'
    },
    {
        type: 'list',
        name: 'role_id',
        message: 'Select employee role:',
        choices: [
            { name: 'CEO', value: 1 },
            { name: 'Recruiter', value: 2 },
            { name: 'Software Engineer', value: 3 },
            { name: 'Accountant', value: 4 },
            { name: 'Finance Manager', value: 5 },
            { name: 'Legal Assistant', value: 6 },
            { name: 'Lawyer', value: 7 },
            { name: 'Salesperson', value: 8 },
            { name: 'Sales Manager', value: 9 }
        ]
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Select employee manager:',
        choices: [
            { name: 'John Doe', value: 1 },
            { name: 'Jane Smith', value: 2 },
            { name: 'Alice Williams', value: 3 },
            { name: 'Bob Jones', value: 4 },
            { name: 'Charlie Brown', value: 5 },
            { name: 'Dora Johnson', value: 6 },
            { name: 'Eve Wilson', value: 7 },
            { name: 'Frank Thomas', value: 8 },
            { name: 'Grace Moore', value: 9 },
            { name: 'null', value: null }
        ]
    }
]);

    const {first_name, last_name, role_id, manager_id} = newEmployee;

    try {
      await query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
      console.log('Employee added successfully');
  } catch (err) {
      console.error('Error querying the database:', err);
  }

  mainMenu();
}

async function updateEmployeeRole(){
    const employees = await query('SELECT * FROM employee');
    const roles = await query('SELECT * FROM role');
    const employeeChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const employeeToUpdate = await inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Select employee to update:',
        choices: employeeChoices
    });

    const roleToUpdate = await inquirer.prompt({
        type: 'list',
        name: 'role_id',
        message: 'Select new role:',
        choices: roleChoices
    });

    try {
        await query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleToUpdate.role_id, employeeToUpdate.employee_id]);
        console.log('Employee role updated successfully');
    } catch (err) {
        console.error('Error querying the database:', err);
    }

    mainMenu();
}

async function viewRoles(){
    const { rows } = await query('SELECT * FROM role');
    console.table(rows);
    mainMenu();
}

async function addRole(){
    const departments = await query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({ name: department.name, value: department.id }));

    const newRole = await inquirer.prompt([{
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:'
  },
  {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for this role:'
  },
  {
      type: 'list',
      name: 'department_id',
      message: 'Select employee role:',
      choices: departmentChoices
  }
]);

    const {title, salary, department_id} = newRole;

    try {
      await query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
      console.log('Role added successfully');
  } catch (err) {
      console.error('Error querying the database:', err);
  }
  mainMenu();
}

async function viewAllDepartments(){
    const { rows } = await query('SELECT * FROM department');
    console.table(rows);
    mainMenu();
}

async function addDepartment(){
    const newDepartment = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter department name:'
    });

    const {name} = newDepartment;

    try {
      await query('INSERT INTO department (name) VALUES ($1)', [name]);
      console.log('Department added successfully');
  } catch (err) {
      console.error('Error querying the database:', err);
  }
  mainMenu();
}

async function updateManager(){
    const employees = await query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

    const employeeToUpdate = await inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Select employee to update:',
        choices: employeeChoices
    });

    const managerToUpdate = await inquirer.prompt({
        type: 'list',
        name: 'manager_id',
        message: 'Select new manager:',
        choices: employeeChoices
    });

    try {
        await query('UPDATE employee SET manager_id = $1 WHERE id = $2', [managerToUpdate.manager_id, employeeToUpdate.employee_id]);
        console.log('Employee manager updated successfully');
    } catch (err) {
        console.error('Error querying the database:', err);
    }

    mainMenu();
}

async function viewEmployeesByManager(){
    const employees = await query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

    const employeeToView = await inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Select employee to view:',
        choices: employeeChoices
    });

    const { rows } = await query('SELECT * FROM employee WHERE manager_id = $1', [employeeToView.employee_id]);
    console.table(rows);
    mainMenu();
}

async function viewEmployeesByDepartment(){
    const departments = await query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({ name: department.name, value: department.id }));

    const departmentToView = await inquirer.prompt({
        type: 'list',
        name: 'department_id',
        message: 'Select department to view:',
        choices: departmentChoices
    });

    const { rows } = await query('SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.department_id = $1', [departmentToView.department_id]);
    console.table(rows);
    mainMenu();
}

async function deleteData(){
    const action = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to delete?',
        choices: ['Delete Employee', 'Delete Role', 'Delete Department'],
    });

    switch (action.action) {
        case 'Delete Employee':
            deleteEmployee();
            break;
        case 'Delete Role':
            deleteRole();
            break;
        case 'Delete Department':
            deleteDepartment();
            break;
    }

    async function deleteEmployee(){
        const employees = await query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

        const employeeToDelete = await inquirer.prompt({
            type: 'list',
            name: 'employee_id',
            message: 'Select employee to delete:',
            choices: employeeChoices
        });

        try {
            await query('DELETE FROM employee WHERE id = $1', [employeeToDelete.employee_id]);
            console.log('Employee deleted successfully');
        } catch (err) {
            console.error('Error querying the database:', err);
        }

        mainMenu();
    }

    async function deleteRole(){
        const roles = await query('SELECT * FROM role');
        const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

        const roleToDelete = await inquirer.prompt({
            type: 'list',
            name: 'role_id',
            message: 'Select role to delete:',
            choices: roleChoices
        });

        try {
            await query('DELETE FROM role WHERE id = $1', [roleToDelete.role_id]);
            console.log('Role deleted successfully');
        } catch (err) {
            console.error('Error querying the database:', err);
        }

        mainMenu();
    }

    async function deleteDepartment(){
        const departments = await query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(department => ({ name: department.name, value: department.id }));

        const departmentToDelete = await inquirer.prompt({
            type: 'list',
            name: 'department_id',
            message: 'Select department to delete:',
            choices: departmentChoices
        });

        try {
            await query('DELETE FROM department WHERE id = $1', [departmentToDelete.department_id]);
            console.log('Department deleted successfully');
        } catch (err) {
            console.error('Error querying the database:', err);
        }

        mainMenu();
    }
}

async function BudgetByDepartment(){
    const departments = await query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({ name: department.name, value: department.id }));

    const departmentToView = await inquirer.prompt({
        type: 'list',
        name: 'department_id',
        message: 'Select department to view:',
        choices: departmentChoices
    });

    const { rows } = await query('SELECT SUM(salary) FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.department_id = $1', [departmentToView.department_id]);
    console.table(rows);
    mainMenu();
}



async function main() {
  await connectToDb();
  await mainMenu();
}

main();

