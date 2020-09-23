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
    "Add department.",
    "Add role",
    "Remove a department.",
    "Remove employee.",
    "Update employee role.",
    "Exit.",
  ];
  //The start of the prompt
  inquirer
    .prompt([
      {
        type: "list",
        message: "What you would like to do?",
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
        addDepartment();
      } else if (response.choice == choices[5]) {
        addRole();
      } else if (response.choice == choices[6]) {
        removeDepartment();
      } else if (response.choice == choices[7]) {
        removeEmployee();
      } else if (response.choice == choices[8]) {
        updateEmployee();
      } else if (response.choice == choices[9]) {
        //if we wish to end the application we close the connection
        console.log("BYE BYE!!!!");
        connection.end();
      }
    });
}
//I am beggining the application
beggining();
//This is a function where I can get all of the employees without restarting the application
function empoloyeeNoRestart() {
  connection.query("SELECT * FROM EMPLOYEE_TRACKER.EMPLOYEE;", function (
    error,
    result
  ) {
    if (error) {
      console.log(error);
    }
    console.table(result);
  });
}
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

//This is the function to add a department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department you wish to add?",
        name: "departmentName",
      },
    ]) //Here is what I am going to do with the response.
    .then((response) => {
      let department = response.departmentName;
      department = department.toUpperCase();
      //This is the query that i am passing to my database, I use '?' to prevent my query from being injected
      connection.query(
        "INSERT INTO DEPARTMENT (DEPARTMENT_NAME) VALUES (?);",
        [department],
        function (error, result) {
          if (error) {
            console.log(
              "We where not able to create the employee, try again",
              error
            );
          } else {
            connection.query(
              "SELECT * FROM DEPARTMENT WHERE ID=?",
              [result.insertId],
              function (error, result) {
                if (error) {
                  console.log(
                    "There was an error looking for the employee after it being created: ",
                    error
                  );
                }
                console.log("The department has been created");
                console.table(result);
              }
            );
          }
          setTimeout(function () {
            beggining();
          }, 700);
        }
      );
    });
}
//This is the function where we add roles
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role you wish to add?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary for this department? (Only the ammount)",
        name: "roleSalary",
      },
    ]) //Here is what I am going to do with the response.
    .then((response1) => {
      connection.query("SELECT * FROM DEPARTMENT;", function (error, result) {
        if (error) {
          console.log("Where not able to get the departments ", error);
        }
        console.log("Department's");
        console.table(result);
      });
      setTimeout(function () {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the department ID for this role?",
              name:"departmentID"
            },
          ])
          .then((response) => {
            let role = response1.roleTitle;
            role = role.toUpperCase();
            let salary = response1.roleSalary;
            let departmentID = response.departmentID;
            //This is the query that i am passing to my database, I use '?' to prevent my query from being injected
            connection.query(
              "INSERT INTO ROLE (ROLE_TITLE, ROLE_SALARY, DEPARTMENT_ID) VALUES (?, ?, ?);",
              [role,salary,departmentID],
              function (error, result) {
                if (error) {
                  console.log(
                    "We where not able to create the employee, try again",
                    error
                  );
                } else {
                  connection.query(
                    "SELECT * FROM ROLE WHERE ID=?",
                    [result.insertId],
                    function (error, result) {
                      if (error) {
                        console.log(
                          "There was an error looking for the role after it being created: ",
                          error
                        );
                      }
                      console.log("The role has been created");
                      console.table(result);
                    }
                  );
                }
                setTimeout(function () {
                  beggining();
                }, 700);
              }
            );
          });
      }, 200);
    });
}

//This is the function to remove a department
function removeDepartment() {
  function departmentQuery() {
    connection.query("SELECT * FROM DEPARTMENT;", function (error, result) {
      if (error) {
        console.log(
          "There has been an error retrieving the department's",
          error
        );
      } else {
        console.table(result);
      }
    });
  }
  departmentQuery();
  setTimeout(function () {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the department you wish to remove",
          name: "departmentRemove",
        },
      ]) //Here is what I am going to do with the response.
      .then((response) => {
        let departmentRemoveHandler = response.departmentRemove;
        departmentRemoveHandler = departmentRemoveHandler.toUpperCase();

        connection.query(
          "DELETE FROM DEPARTMENT WHERE DEPARTMENT_NAME =?;",
          [departmentRemoveHandler],
          function (error, result) {
            if (error) {
              console.log(
                "The department you have chosen does not exist",
                error
              );
            } else {
              console.log("The department has been removed succsesfully!!!");
              departmentQuery();
              setTimeout(function () {
                beggining();
              }, 400);
            }
          }
        );
      });
  }, 500);
}

//This is the function where i remove an employee.
function removeEmployee() {
  //Here i am getting all of the employee's of the company and displaying them so it can be easier for the user to search for the ID that is required.
  empoloyeeNoRestart();
  //I decided to set a time out to wait for the query to respond berfore running the prompt.
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

//This is the function where I update the employee's
function updateEmployee() {
  empoloyeeNoRestart();
  setTimeout(function () {
    let updateChoices = [
      "Fist name",
      "Last name",
      "Role ID",
      "Manager ID(1 or null)",
    ];
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the ID of the employee you wish to update?",
          name: "IDUpdate",
        },
        {
          type: "list",
          message: "What would you like to update?",
          choices: updateChoices,
          name: "updateChoice",
        },
        {
          type: "input",
          message: "Write your change",
          name: "updateChange",
        },
      ])
      .then((response) => {
        let updateColumn;
        switch (response.updateChoice) {
          case "Fist name":
            updateColumn = "UPDATE EMPLOYEE SET FIRST_NAME=? WHERE ID=?;";
            break;
          case "Last name":
            updateColumn = "UPDATE EMPLOYEE SET LAST_NAME=? WHERE ID=?;";
            break;
          case "Role ID":
            updateColumn = "UPDATE EMPLOYEE SET ROLE_ID=? WHERE ID=?;";
            break;
          case "Manager ID":
            updateColumn = "UPDATE EMPLOYEE SET MANAGER_ID=? WHERE ID=?;";
            break;
          default:
            break;
        }
        connection.query(
          updateColumn,
          [response.updateChange, response.IDUpdate],
          function (error, result) {
            if (error) {
              console.log(
                "There has been a mistake updating the employee: ",
                error
              );
            } else {
              console.log(
                "The employee with the ID of ",
                response.IDUpdate,
                " has been successfully updater!!!!!"
              );
            }
            beggining();
          }
        );
      });
  }, 700);
}
