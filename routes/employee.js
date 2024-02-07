var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details");

router.get('/', function(req, res, next) {
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var employee = connection.query("SELECT * from employee");
  console.log(employee);
  res.render('employee', { title: 'Employee', employee:employee });
});

router.get('/add', function(req, res, next){
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  var employee = connection.query('select * from employee;')

  res.render('add_employee', { title: 'Add Employee', employee: employee} )
});


router.get('/delete', function(req, res, next) {
  var employee_id = req.query.employee_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  connection.query("DELETE FROM employee where employee_id = (?);", [employee_id])
  res.redirect('/employee')
})

router.post('/add', function(req, res, next){
  var employee_name = req.body.employee_name
  var address = req.body.address
  var age = parseFloat(req.body.age)
  var phoneNo = parseFloat(req.body.phoneNo)
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  connection.query("INSERT INTO employee (employee_name, address, age, phoneNo) VALUES ((?), (?), (?), (?));", [employee_name, address, age, phoneNo]);
  res.redirect("/employee");
})

router.get('/update', function(req, res, next){
  var employee_id = req.query.employee_id
  var error = req.query.error
  res.render('update_employee', {employee_id: employee_id, error:error} )
})

router.post('/update', function(req, res, next){
  var employee_id = req.body.employee_id
  var employee_name = req.body.employee_name
  var address = req.body.address
  var age = parseFloat(req.body.age)
  var phoneNo = parseFloat(req.body.phoneNo)
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  var query_string = "UPDATE employee set"
  var params = []
  if(employee_name) {
    query_string += ' employee_name = (?)'
    params.push(employee_name)
  }
  if(address) {
    if(employee_name) {
      query_string +=", "
    }
    query_string += ' address = (?) '
    params.push(address)
  }
  if(!isNaN(age)) {
    if(employee_name || address) {
      query_string +=", "
    }
    query_string += ' age = (?) '
    params.push(age)
  }
  if(!isNaN(phoneNo)) {
    if(employee_name || address || age) {
      query_string +=", "
    }
    query_string += ' phoneNo = (?) '
    params.push(phoneNo)
  }
  query_string += "WHERE employee_id = (?)"
  if(!employee_name && !age && !address && !phoneNo) {
    res.redirect("/movie/update?employee_id=" + employee_id + "&error=You must update some fields")
  }
  params.push(employee_id)
  connection.query(query_string, params)
  res.redirect('/employee')
})

module.exports = router;
