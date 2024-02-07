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
  var rental = connection.query('SELECT * from rental r inner join movie m on r.movie_id = m.movie_id inner join customer c on r.cust_id = c.cust_id inner join employee e on r.employee_id = e.employee_id;')
  var customer = connection.query('SELECT * from customer inner join rental on customer.cust_id = rental.cust_id;')
  var movie = connection.query('SELECT * from movie inner join rental on movie.movie_id = rental.movie_id;')
  var employee = connection.query('SELECT * from employee inner join rental on employee.employee_id = rental.employee_id;')
  res.render('rental', { title: 'Rental', rental: rental, customer: customer, movie:movie, employee:employee, page_header: '', link: '' });

});

router.get('/add', function(req, res, next){
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  var rental = connection.query('SELECT * from rental r inner join movie m on r.movie_id = m.movie_id inner join customer c on r.cust_id = c.cust_id inner join employee e on r.employee_id = e.employee_id;')
  var customer = connection.query('SELECT * from customer')
  var movie = connection.query('SELECT * from movie')
  var employee = connection.query('SELECT * from employee')
  res.render('add_rental', { title: 'Rental', rental:rental , customer:customer, movie:movie, employee:employee, page_header: '', link: '' });
});

router.get('/delete', function(req, res, next) {
  var rent_id = req.query.rent_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  connection.query("DELETE FROM rental where rent_id = (?);", [rent_id])
  res.redirect('/rental')
})

router.post("/add", function(req, res, next){
  var rent_date = req.body.rent_date
  var return_date = req.body.return_date
  var cost = parseFloat(req.body.cost)
  var cust_id = req.body.cust_id
  var employee_id = req.body.employee_id
  var movie_id = req.body.movie_id
  var returned = req.body.returned
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  })

  if(returned === 'on') {
    returned = true;
  } else {
    returned = false;
  }

  connection.query("INSERT INTO rental(rent_date, return_date, cost, cust_id, employee_id, movie_id, returned) VALUES ((?), (?), (?), (?), (?), (?), (?));", [rent_date, return_date, cost, cust_id, employee_id, movie_id, returned]);
  res.redirect("/rental");
})

router.get('/update', function(req, res, next){
  var rent_id = req.query.rent_id
  var error = req.query.error
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  var rental = connection.query('SELECT * from rental r inner join movie m on r.movie_id = m.movie_id inner join customer c on r.cust_id = c.cust_id inner join employee e on r.employee_id = e.employee_id;')

  res.render('update_rental', {rental: rental, rent_id: rent_id, error:error} )
})

router.post('/update', function(req, res, next){
  var rent_id = req.body.rent_id
  var rent_date = req.body.rent_date
  var return_date = req.body.return_date
  var cost = parseFloat(req.body.cost)
  var cust_id = req.body.cust_id
  var employee_id = req.body.employee_id
  var movie_id = req.body.movie_id
  var returned = req.body.returned
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })

  var query_string = "UPDATE rental set"
  var params = []
  if(rent_date) {
    query_string += ' rent_date = (?) '
    params.push(rent_date)
  }
  if(return_date) {
    if(rent_date) {
      query_string +=", "
    }
    query_string += ' return_date = (?) '
    params.push(return_date)
  }
  if(!isNaN(cost)) {
    if(rent_date || return_date) {
      query_string +=", "
    }
    query_string += ' cost = (?) '
    params.push(cost)
  }
  if(!isNaN(cust_id)) {
    if(rent_date || return_date || cost) {
      query_string +=", "
    }
    query_string += ' cust_id = (?) '
    params.push(cust_id)
  }
  if(!isNaN(employee_id)) {
    if(rent_date || return_date || cost || cust_id) {
      query_string +=", "
    }
    query_string += ' employee_id = (?) '
    params.push(employee_id)
  }
  if(!isNaN(movie_id)) {

    if(rent_date || return_date || cost || cust_id || employee_id) {
      query_string +=", "
    }
    query_string += ' movie_id = (?) '
    params.push(movie_id)
  }
    if(returned === 'on') {
      returned = true;
      if(rent_date || return_date || cost || cust_id || employee_id || movie_id) {
        query_string +=", "
      }
      query_string += ' returned = (?) '
      params.push(returned)
    } else {
      returned = false;
      if(rent_date || return_date || cost || cust_id || employee_id || movie_id) {
        query_string +=", "
      }
      query_string += ' returned = (?) '
      params.push(returned)
    }
  query_string += "WHERE rent_id = (?)"
  if(!rent_date && !return_date && !cust_id && !cost && !movie_id && !employee_id && !returned) {
    res.redirect("/rental/update?rent_id=" + rent_id + "&error=You must update some fields")
  }
  params.push(rent_id)
  connection.query(query_string, params)
  res.redirect('/rental')
})

module.exports = router;
