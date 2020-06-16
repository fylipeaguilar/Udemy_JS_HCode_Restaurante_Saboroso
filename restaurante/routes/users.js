// Fazendo o require da nossa conexão com o banco de dados 
// Assim poderemos usar a variável com nas rotas
var conn = require('./../inc/db')

// Fazendo o require do express
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  // res.send('Acessando a rota antes de implementar a conexão com a base de dados!!')

  // Modelo de uso do select (https://www.npmjs.com/package/mysql2)
  conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) => {

    if(err){

      res.send(err)

    } else {

      res.send(results)

    }

  })

});

module.exports = router;
