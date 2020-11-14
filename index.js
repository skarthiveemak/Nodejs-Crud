const mysql = require('mysql');
const express = require('express');
var app = express();
//const bodyparser = require('body-parser');
var bodyParser = require('body-parser')

const cors = require('cors');

var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200 // For legacy browser support
}



app.use(function (req, res, next) {
    
    bodyParser.json({ type: 'application/*+json' });
    bodyParser.text({ type: 'text/html' });
    bodyParser.raw({ type: 'application/vnd.custom-type' });

    (cors(corsOptions));

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
    
});

module.exports = app;


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '12345',
    database : 'employeedb',
    multiplestatements : true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Db is Sucess');
    else
    console.log('db is failed \n Error :' + JSON.stringify(err, undefined, 2));
});

app.listen(3000,()=>console.log('Express server is running  at port 3000'));

app.get('/', function (req, res) {

    
    res.send('hello world')
})

//get all employees 
app.get('/employees',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee',(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//get employee id 
app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});


//Delete employee id 
app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        
        if(!err){
            console.log('hello world');
            res.send(JSON.stringify({ msg: 'Deleted.....' }));
         }
        else 
            {
        console.log(err);
            }
    })
});

// create application/json parser
var jsonParser = bodyParser.json()
//ashok
// added jsonParser

//Insert employee id 
app.post('/employees',jsonParser, (req,res)=>{
    let emp = req.body;
    var sql = `INSERT INTO employeedb.employee (Name,EmpCode,Salary,Contact,Email)
    VALUES
    (
        ?, ?, ?, ?, ?
    )`;
    console.log("insert log" +req.body);
    //added result 
    mysqlConnection.query(sql, [emp.Name,emp.EmpCode,emp.Salary,emp.Contact,emp.Email], (err,result)=>{
        
        if(!err)
        {
            console.log("inserted ... " + result.insertId);
            res.json(result);
        }
        else
        {
            console.log(err);
            res.json(err);

        }
    });
});


//Update employee id 
app.put('/employees',jsonParser,(req,res)=> {
    let emp = req.body;
    var sql = 'UPDATE employeedb.employee SET Name=?, EmpCode=?, Salary=?, Contact=?, Email=? WHERE EmpID = ?';
    mysqlConnection.query(sql, [emp.Name,emp.EmpCode,emp.Salary,emp.Contact,emp.Email, emp.EmpID,],(err, result)=>{
        if(!err)
            res.json(result);
        else
        console.log(err);
    });
});



// //Update employee id VAP student
// app.put('/employees', (req, res) => {
//     let emp = req.body;
//     var sql = "SET @EmpID = ?; \
//     CALL EmployeeInsUpd(@EmpID,@Name,@EmpCode,@Salary);";
//     mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
//         if(!err)
//             res.send('Updated Succesfully done');
//         else
//         console.log(err);
//     });
// });



// Add headers




// var corsOptions = {
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200 // For legacy browser support
// }



  