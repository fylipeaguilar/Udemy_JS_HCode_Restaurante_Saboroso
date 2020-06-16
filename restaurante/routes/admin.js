// ********* Criando novas Rotas para Administrador **********//

// Primeiramente importar o módulo do "express"
var express = require('express')

// Importando o arquivo de "users" que trata o login de usuario
var users = require('./../inc/users')

// Primeiramente importar o método para Rotas
var router = express.Router()

// Rota a ser consumida
router.get('/', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/index')

})

router.post('/login', function(req, res, nest) {

    if(!req.body.email) {

        users.render(req, res, "Preencha seu e-mail")

    } else if (!req.body.password) {

        users.render(req, res, "Preencha sua senha")

    } else {

        // No login temos que passar os 2 parâmetros
        // que o método está esperando receber
        // E o método "login" é um Promise
        users.login(req.body.email, req.body.password).then(user => {

            // Precisamos guardar esse usuário na sessão
            req.session.user = user;

            // Se ele passar pelo método do login, 
            // fazemos o redirect
            res.redirect('/admin');

        }).catch(err => {

            users.render(req, res, err.message || err);
            
        })

    }

})

// Rota a ser consumida
router.get('/login', function(req, res, next) {

    // Criar o render para renderizar a página
    users.render(req, res, null)

})

// Rota a ser consumida
router.get('/contacts', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/contacts')

})


// Rota a ser consumida
router.get('/emails', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/emails')

})

// Rota a ser consumida
router.get('/menus', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/menus')

})

// Rota a ser consumida
router.get('/reservations', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/reservations', {
        date: {}
    })

})

// Rota a ser consumida
router.get('/users', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/users')

})

module.exports = router