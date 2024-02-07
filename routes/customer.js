var express = require("express");
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
  var customer = connection.query("SELECT * from customer");
  console.log(customer);
  res.render('customer', { title: 'Customer', customer:customer });
});

router.get('/add', function(req, res, next){
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  var customer = connection.query('select * from customer;')

  res.render('add_customer')
});


router.get('/delete', function(req, res, next) {
  var cust_id = req.query.cust_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  connection.query("DELETE FROM customer where cust_id = (?);", [cust_id])
  res.redirect('/customer')
  res.render('delete_customer')
})

router.post('/add', function(req, res, next){
  var cust_name = req.body.cust_name
  var address = req.body.address
  var age = parseFloat(req.body.age)
  var phoneNo = parseFloat(req.body.phoneNo)
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  connection.query("INSERT INTO customer (cust_name, address, age, phoneNo) VALUES ((?), (?), (?), (?));", [cust_name, address, age, phoneNo]);
  res.redirect("/customer");
})

router.get('/update', function(req, res, next){
  var cust_id = req.query.cust_id
  var error = req.query.error
  res.render('update_customer', {cust_id: cust_id, error:error} )
})

router.post('/update', function(req, res, next){
  var cust_id = req.body.cust_id
  var cust_name = req.body.employee_name
  var address = req.body.address
  var age = parseFloat(req.body.age)
  var phoneNo = req.body.phoneNo
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  var query_string = "UPDATE customer set"
  var params = []
  if(cust_name) {
    query_string += ' cust_name = (?)'
    params.push(cust_name)
  }
  if(address) {
    if(cust_name) {
      query_string +=", "
    }
    query_string += ' address = (?) '
    params.push(address)
  }
  if(!isNaN(age)) {
    if(cust_name || address) {
      query_string +=", "
    }
    query_string += ' age = (?) '
    params.push(age)
  }
  if(phoneNo) {
    if(cust_name || address || age) {
      query_string +=", "
    }
    query_string += ' phoneNo = (?) '
    params.push(phoneNo)
  }
  query_string += "WHERE cust_id = (?)"
  if(!cust_name && !age && !address && !phoneNo) {
    res.redirect("/movie/update?cust_id=" + cust_id + "&error=You must update some fields")
  }
  params.push(cust_id)
  connection.query(query_string, params)
  res.redirect('/customer')
})

module.exports = router;
