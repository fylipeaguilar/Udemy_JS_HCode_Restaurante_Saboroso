// ********* Criando novas Rotas para Administrador **********//

// Primeiramente importar o módulo do "express"
var express = require('express')

// Importando o arquivo de "users" que trata o login de usuario
var users = require('./../inc/users')

// Importando ao arquivos com os da administração dinamicos
var admin = require('./../inc/admin')

// Importando ao arquivos de manipulação dos dados de menus do banco de dados
var menus = require ('./../inc/menus')

// Importando ao arquivos de manipulação dos dados de menus do banco de dados
var reservations = require ('./../inc/reservations')

// Primeiramente importar o método para Rotas
var router = express.Router()


//************* INíCO DOS MIADDLEWARES ****************************/
//************* Middleware em nível de Roteador (rotas) ***********/
// Criando um middleware para tratar as sessions
// Esse middleware faz a "interferência" nas rotas
// Lembrando que o middleware nada mais do que uma função
router.use(function(req, res, next){

    // Criando uma validação de sessão
    // Caso não exista uma "session" para o user
    // redireciona a página para "admin/login"
    // Obs.: Se for a rota "login" que está dentro de "admin",
    // essa não deve ser checada
    if(['/login'].indexOf(req.url) === -1 && !req.session.user) {

        // Criar o render para renderizar a página
        res.redirect('/admin/login')

    } else {

        next();

    }
    
})

// ******** Middleware em nível de Roteador (rotas) *********/
// Criando um middleware para tratar os menus dinamicamente
// Esse middleware faz a "interferência" nas rotas
// Lembrando que o middleware nada mais do que uma função
router.use(function(req, res, next){

    // Parando o req como parametro para o metodo para eles
    // saber qual a "url" que estamos para deixar o "active" em true
    req.menus = admin.getMenus(req);

    next();
    
})

//************* FIM DOS MIADDLEWARES ****************************/


//************ INICO DAS ROTAS LOGIN/LOGOUT **************************//
// Rota a ser consumida
router.get('/', function(req, res, next) {

    // Vai receber o retorno da nossa promessa
    // No método "then" esperamos receber o data
    admin.dashboard().then(data => {

            res.render('admin/index', admin.getParams(req, {

                // Vai receber o retorno da nossa promessa
                data
            }))

        }).catch( err => {

            console.error(err)

    })

})
//************ FIM DAS ROTAS INDEX **************************//

//************ INICO DAS ROTAS LOGIN/LOGOUT **************************//
// Rota a ser consumida
router.get('/login', function(req, res, next) {

    // Criar o render para renderizar a página
    users.render(req, res, null)

})

router.post('/login', function(req, res, next) {

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

router.get('logout', function(req, res, next){

    // Retira o "user" do nosso "session"
    delete req.session.user;

    // Força uma renderização para a nossa página de login
    res.redirect('admin/login')

})
//************ FIM DAS ROTAS LOGIN/LOGOUT **************************//


//************ INICIO DAS ROTAS CONTACTS **************************//

// Rota a ser consumida
router.get('/contacts', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/contacts',  admin.getParams(req))

})

//************ FIM DAS ROTAS CONTACTS **************************//

//************ INICIO DAS ROTAS EMAIL **************************//

// Rota a ser consumida
router.get('/emails', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/emails',  admin.getParams(req))

})

//************ FIM DAS ROTAS EMAILS **************************//


//************ INICIO DAS ROTAS MENUS **************************//

// Rota a ser consumida
router.get('/menus', function(req, res, next) {

    menus.getMenus().then(data => {

        // Criar o render para renderizar a página
        // Vamos mesclar com um novo objeto 
        res.render('admin/menus',  admin.getParams(req, {

            // Dados da tabela
            data

        }))

        // console.log(data)

    }).catch( err => {

        console.error(err)

    })    

})

// Rota de envio dos dados do frontend para o banckend
// Rota para adicionar um novo prato ao banco de dados

router.post('/menus', function(req, res, next) {

    menus.save(req.fields, req.files).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    });

})

// Rota para apagar um prato do menu na base de dados
// Já podemos passar o "id" na rota
router.delete('/menus/:id', function(req, res, next){

    // Também é uma promessa
    // req.params.id (id que é o parâmetro da requisição)
    menus.delete(req.params.id).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    });

})
//************ FIM DAS ROTAS MENUS **************************//

//************ INICIO DAS ROTAS RESERVATIONS **************************//

// Rota a ser consumida
router.get('/reservations', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/reservations', admin.getParams(req), {

        date:{}
        
    })

})

// Rota de envio dos dados do frontend para o banckend
// Rota para adicionar um novo prato ao banco de dados

router.post('/reservations', function(req, res, next) {

    reservations.save(req.fields).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    });

})

// Rota para apagar um prato do menu na base de dados
// Já podemos passar o "id" na rota
router.delete('/reservations/:id', function(req, res, next){

    // Também é uma promessa
    // req.params.id (id que é o parâmetro da requisição)
    reservations.delete(req.params.id).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    });

})
//************ FIM DAS ROTAS RESERVATIONS **************************//

//*************** INICIO DAS ROTAS USERS **************************//
// Rota a ser consumida
router.get('/users', function(req, res, next) {

    // Criar o render para renderizar a página
    res.render('admin/users', admin.getParams(req))

})

module.exports = router

//************ FIM DAS ROTAS USERS **************************//