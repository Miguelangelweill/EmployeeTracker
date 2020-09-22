const inquirer= require('inquirer');

const connection=require('./Assets/db/db.js')


function beggining(){
    const choices = ["View all of the employees", "View employees by department","View all employees by manager", "exit"];
    //The start if the prompt
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome!!. What would you like to do today?",
            //Here I declare the array where I have my option's stored in
            choices: choices,
            name: "choice"
        }//Then this is what we are going to do depending on the answer that we get from the user
    ]).then(response => {
        if (response.choice == choices[0]) {
          getAllEmployees();
        } else if (response.choice == choices[1]) {
            employeeRole();
        } else if (response.choice == choices[2]) {
          //if we wish to end the application we close the connection
          connection.end();
        }
    })
}

beggining()

function getAllEmployees(){
    connection.query('SELECT * FROM EMPLOYEE_TRACKER.EMPLOYEE;', function (error, result) {
        if (error){
            console.log(error)
        }
        console.table(result)
        beggining()
    })
}
function employeeRole() {
    connection.query(
      "SELECT EMPLOYEE.FIRST_NAME,EMPLOYEE.LAST_NAME,ROLE.ROLE_TITLE FROM EMPLOYEE INNER JOIN ROLE ON ROLE.ID=EMPLOYEE.ROLE_ID",
      function (error, result) {
        if (error) {
          console.log(error);
        }

        console.table(result);
        beggining();
      }
    );
}