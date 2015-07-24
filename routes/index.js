'use strict';
var express = require('express');
var router = express.Router();
var busquedaTwitter = require('../logic/busquedaTwitter')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Sentimentos'
  });
});

/*
funcion en la que el texto del usuario sera hecho submmit
y la busquedaTwitter.js realizara la busqueda en la API y
se conseguirá los datos de los tweets
*/
router.post('/search', function(req, res) {
  busquedaTwitter(req.body.search, function(data) {
    res.json(data);
  })
});

module.exports = router;
