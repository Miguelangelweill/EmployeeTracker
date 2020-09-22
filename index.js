//Requiring all of the dependencies
const inquirer = require("inquirer");
//Here i am importing the start of my server fron the db folder
const connection = require("./Assets/db/db.js");

//This is the function to prompt all of the question's and start the application
function beggining() {
  //Here we have my array of choices
  const choices = [
    "View all of the employees.",
    "View employees by department.",
    "View all employees by manager.",
    "Add employee.",
    "Remove employee.",
    "Exit.",
  ];
  //The start of the prompt
  inquirer
    .prompt([
      {
        type: "list",
        message: "Welcome!!. What would you like to do today?",
        //Here I declare the array where I have my option's stored in
        choices: choices,
        name: "choice",
      }, //Then this is what we are going to do depending on the answer that we get from the user
    ])
    .then((response) => {
      //Here I check for which condition is true so the function can be excecuted
      if (response.choice == choices[0]) {
        getAllEmployees();
      } else if (response.choice == choices[1]) {
        employeeRole();
      } else if (response.choice == choices[2]) {
        getManager();
      } else if (response.choice == choices[3]) {
        addEmployee();
      } else if (response.choice == choices[4]) {
        removeEmployee();
      } else if (response.choice == choices[5]) {
        //if we wish to end the application we close the connection
        connection.end();
      }
    });
}
//I am beggining the application
beggining();

//The function to get all of the employee's
function getAllEmployees() {
  connection.query("SELECT * FROM EMPLOYEE_TRACKER.EMPLOYEE;", function (
    error,
    result
  ) {
    if (error) {
      console.log(error);
    }
    console.table(result);
    beggining();
  });
}

//This is the function to get the employees by role.
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

// This is the function to get the employees that are manager's
function getManager() {
  connection.query("SELECT * FROM EMPLOYEE WHERE MANAGER_ID=1", function (
    error,

    result
  ) {
    if (error) {
      console.log(error);
    }
    console.table(result);
    beggining();
  });
}

//This is the function to add an employee
function addEmployee() {
  //Here I am storing the id's of the roles so the user can only give me a valid id.
  const roles = [1, 3, 4, 2];
  inquirer
    .prompt([
      {
        type: "input",
        message: "First name of the employee",
        name: "firstName",
      },
      {
        type: "input",
        message: "Last name of the employee",
        name: "lastName",
      },
      {
        type: "list",
        message:
          "Choose a role? ---> Manager = 1 || Engineer = 3 || Intern = 2 || Janitor = 4",
        choices: roles,
        name: "role",
      },
      {
        type: "confirm",
        message: "Is this employee a Manager?",
        name: "manager",
      },
    ]) //Here is what I am going to do with the response.
    .then((response) => {
      //Creating a manager variable to make sure that the values are inputed the way that they are intended to0.
      let manager;
      if (response.manager === true) {
        manager = 1;
      } else {
        manager = null;
      }
      //This is the query that i am passing to my database, I use '?' to prevent my query from being injected
      connection.query(
        "INSERT INTO EMPLOYEE (FIRST_NAME, LAST_NAME, ROLE_ID, MANAGER_ID) VALUES (?, ?, ?, ?);",
        //These are the values that I am going to pass to the query.
        [
          response.firstName,
          response.lastName,
          parseInt(response.role),
          manager,
        ],
        function (error, result) {
          if (error) {
            console.log(
              "We where not able to create the employee, try again",
              error
            );
          }
          //I want to return a table with the employee that was just created to show it's succsses.
          // There for I run another query to the database to get the employee that was just created.
          connection.query(
            "SELECT * FROM EMPLOYEE WHERE ID=?",
            [result.insertId],
            function (error, result) {
              if (error) {
                console.log(
                  "There was an error looking for the employee after it being created: ",
                  error
                );
              }
              console.log("The employee was created succsefully!!!");
              console.table(result);
              beggining();
            }
          );
        }
      );
    });
}

function removeEmployee() {
  connection.query("SELECT * FROM EMPLOYEE_TRACKER.EMPLOYEE;", function (
    error,
    result
  ) {
    if (error) {
      console.log(error);
    }
    console.table(result);
  });
  setTimeout(function () {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the number ID of the employee you wish to remove?",
          name: "employeeID",
        },
      ])
      .then((response) => {
        connection.query(
          "DELETE FROM EMPLOYEE WHERE ID =?;",
          [response.employeeID],
          function (error, result) {
            if (error) {
              console.log(error);
            }
            console.log(
              "The employee with the ID of ",
              response.employeeID,
              " Has been successfully removed!!!!!"
            );
            beggining();
          }
        );
      });
  }, 700);
}
