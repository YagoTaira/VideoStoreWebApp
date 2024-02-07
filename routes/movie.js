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
  var movie = connection.query("SELECT * from movie");
  console.log(movie);
  res.render('movie', { title: 'Movies', movie:movie });
});

router.get('/add', function(req, res, next){
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  var movie = connection.query('select * from movie;')

  res.render('add_movie', {title: 'Add movie'})
})

router.get('/delete', function(req, res, next) {
  var movie_id = req.query.movie_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  connection.query("DELETE FROM movie where movie_id = (?);", [movie_id])
  res.redirect('/movie')
})

router.post('/add', function(req, res, next){
  var movie_name = req.body.movie_name
  var rating = req.body.rating
  var genre = req.body.genre
  var release_year = parseFloat(req.body.release_year)
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  connection.query("INSERT INTO movie (movie_name, rating, genre, release_year) VALUES ((?), (?), (?), (?));", [movie_name, rating, genre, release_year]);
  res.redirect("/movie");
})

router.get('/update', function(req, res, next){
  var movie_id = req.query.movie_id
  var error = req.query.error
  res.render('update_movie', {movie_id: movie_id, error:error} )
})

router.post('/update', function(req, res, next){
  var movie_id = req.body.movie_id
  var movie_name = req.body.movie_name
  var rating = req.body.rating
  var genre = req.body.genre
  var release_year = parseFloat(req.body.release_year)
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  var query_string = "UPDATE movie set"
  var params = []
  if(movie_name) {
    query_string += ' movie_name = (?)'
    params.push(movie_name)
  }
  if(rating) {
    if(movie_name) {
      query_string +=", "
    }
    query_string += ' rating = (?) '
    params.push(rating)
  }
  if(genre) {
    if(movie_name || rating) {
      query_string +=", "
    }
    query_string += ' genre = (?) '
    params.push(genre)
  }
  if(!isNaN(release_year)) {
    if(genre || movie_name || rating) {
      query_string +=", "
    }
    query_string += ' release_year = (?) '
    params.push(release_year)
  }
  query_string += "WHERE movie_id = (?)"
  if(!movie_name && !genre && !rating && !release_year) {
    res.redirect("/movie/update?movie_id=" + movie_id + "&error=You must update some fields")
  }
  params.push(movie_id)
  connection.query(query_string, params)
  res.redirect('/movie')
})

module.exports = router;
