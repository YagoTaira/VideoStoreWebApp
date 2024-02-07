var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

router.get('/', function(req, res, next) {
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  })
  var rental = connection.query('SELECT * from rental r inner join movie m on r.movie_id = m.movie_id inner join customer c on r.cust_id = c.cust_id inner join employee e on r.employee_id = e.employee_id;')

  res.render('index', { title: 'My Video Store', rental: rental, page_header: '', link: '' });
});

router.get('/search', function(req, res, next) {
    var connection = new MySql({
      user: connection_details.user,
      password: connection_details.password,
      host: connection_details.host,
      database: connection_details.database
    })
    var query = req.query.query
    query = "%" + query  + "%"
    var rental = connection.query('SELECT * from rental r inner join movie m on r.movie_id = m.movie_id inner join customer c on r.cust_id = c.cust_id inner join employee e on r.employee_id = e.employee_id where rent_date like (?);', [query]);
    res.render('index', {title: 'Search Results', rental: rental, page_header: 'Search Results', link: '/', link_name: "Rental"})
});

module.exports = router;
