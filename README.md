# WorkshopCPMX6
Sentiment Analysis

Creamos un directorio que se llamaremos Sentimentos y primero instalaremos Gulp, Slush, y Express generator con el siguiente comando.

     npm install -g gulp slush slush-express

Una vez instalado esto utilizaremos el siguiente comando para crear el esqueleto de la aplicación.

     slush express

Nos preguntara por el engine que queremos utilzar para el marcado de html y css y en este cso utlizaremos los normales, HTML y CSS

     Select a View Engine: HTML
     Select a Stylesheet Engine : CSS

El comando que utilizamos para realzar el esqueleto es el siguiente:

sentimentAnalysisApp
├── Gulpfile.js
├── app.js
├── bin
│   └── www
├── bower.json
├── package.json
├── public
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.html
    └── index.html

Una pequeña explicación para el esqueleto que nos formo para la aplicación es:

     bin/www: donde el puerto esta configurado para correr la aplicación.
     app.js:     la configuración del server. las rutas y el engine de las vistas.
     gulpFile.js:  el archivo que se encarga de las pruebas de nuestro proyecto.
     /public: los archivos estaticos para el UI.
     /routes:  las rutas de la app.
     /views:   las vistas de nuestra aplicación.

podemos correr la aplicación ejecutando el comando gulp esto empezara un  servidor Express en el puerto 3000 y podemos navegar a este en http://localhost:3000 y se puede ver la vista de la aplicación generada.

Ahora instalaremos las dependencias del proyecto usando  el siguiente comando.

     npm install twitter sentiment  --save

Despues de haber instalando este modulo crearemos nuestra carpeta de la logica de la aplicación que la llamaremos logic y crearemos dos archivos vacíos al momento llamados busquedaTwitter.js y analisisSentimientos.js y otra carpeta que llamaremos datos donde guardaremos los tweets.

ahora abrimos routes/index.js en tu editor de preferencia en este caso atom. y agregaremos una nueva ruta POST/ search. el texto que el usuario ingrese sera mandado a esta ruta el archivo de routes/index.js quedaría así.


'use strict';
var express = require('express');
var router = express.Router();

var busquedaTwitter = require('../logic/busquedaTwitter');

 
/* GET home page. */
router.get('/', function(req, res) {

  res.render('index');


});




 /*

funcion en la que el texto del usuario sera hecho submmit

y la busquedaTwitter.js realizara la busqueda en la API y

se conseguirá los datos de los tweets

*/



router.post('/search', function(req, res) {

  busquedaTwitter(req.body.search, function (data) {

    res.json(data);
  });
});
 
module.exports = router;

busquedaTwitter() la función espera los términos de la búsqueda y conseguir los tweets de twitter. estos tweets
serán lo que se analizan y los resultados serán regresados en callback simple.

Abrimos el archivo en logic/busquedaTwitter.js y agregamos el siguiente código.



var util = require('util'),

  twitter = require('twitter'),
  analisisSentimientos = require('./analisisSentimientos'),
  db = require('diskdb');

  db = db.connect('db', ['sentiments']);

var config = {
  consumer_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  consumer_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  access_token_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  access_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [],
    dbData = [];

  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = analisisSentimientos(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}



Instalamos diskdb a tu proyecto con el siguiente comando y creamos una carpeta que se llame db en el directorio raíz.

     npm install diskdb --save

Ahora abrimos logic/analisisSentimientos,js y agregamos el siguiente codigo

var sentiment = require('sentiment');

module.exports = function(text) {
  return sentiment(text);
};

la logica es muy sencilla. tomamos el tweet y y regresamos el objeto  sentimiento.
