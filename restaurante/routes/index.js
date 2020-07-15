// Criando uma variável para acessar 
// a nossa conexão com o bando de dados
var conn = require('./../inc/db')

// Criando uma variável para acessar o método "GetMenus"
var menus = require('./../inc/menus')

// Chamamdo o arquivo do método de validação de dados de reserva
// Usado quando os dados do formulário estão incompletos
var reservations = require('./../inc/reservations')

// Chamamdo o arquivo do método de validação de dados de reserva
// Usado quando os dados do formulário estão incompletos
var contacts = require('./../inc/contacts')

// Chamamdo o arquivo do método de validação de dados de reserva
// Usado quando os dados do formulário estão incompletos
var emails = require('../inc/emails');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  // A promessa retorna o results
  menus.getMenus().then(results => {

    res.render('index', {

      title: 'Restaurante Saboroso!',
      menus: results,
      isHome: true

    });

  })

  //****** ANTES DE CRIAR UM METODO (getMenus) PARA REUSO */
  // conn.query(`
  //       SELECT * FROM tb_menus ORDER BY title;
  // ` ,  (err, results) => {
  //   if(err) {
  //       console.log(err);
  //  }
  //   res.render('index', { 
  //     title: 'Restaurante Saboroso!',
  //     menus: results
  //   });
  // });

});

router.get('/contacts', function (req, res, next) {

  contacts.render(req, res)

})

// Configurando uma rota via POST para reserva
router.post('/contacts', function (req, res, next) {

  // console.log('Entrei aqui')
  // console.log(req.body)

  // Criando as validações antes de enviar para o banco de dados
  // Se não tem o nome
  if (!req.body.name) {
    // Caso o nome não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    contacts.render(req, res, "Digite o nome")

  } else if (!req.body.email) {
    // Caso o e-mail não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    contacts.render(req, res, "Digite o e-mail")

  } else if (!req.body.message) {
    // Caso o "horário" não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    contacts.render(req, res, "Escreva uma mensagem")

  } else {

    // No método POST, usando o método "send" e não o método "render"
    // Pois estamos enviando os dados e não renderizando a página
    // E enviamos os dados via "req.body" (corpo dos dados da requisição)

    // Estamos passando os dados do corpo requisição como parâmetros para o
    // metodo save(). E o retorno do método save é uma Promise

    contacts.save(req.body).then(results => {

      // Entra aqui quando o processo ocorreu sem erro

      // Limpando os dados da página, pois entramos no sucesso da reserva
      req.body = {}

      // Por isso o "null" render da página
      contacts.render(req, res, null, "Mensagem enviada com sucesso!!!")

    }).catch(err => {

      // Estamos usando o "err.message" e não apenas "err",
      // Pois nesse ponto temos que passar um texto e não um objeto
      contacts.render(req, res, err.message)

    })

  }

})

router.get('/menus', function (req, res, next) {

  menus.getMenus().then(results => {

    res.render('menus', {

      title: 'Menus - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'Saboreie nosso menu!',
      menus: results

    });

  })

})

router.get('/reservations', function (req, res, next) {

  reservations.render(req, res)

})

// Configurando uma rota via POST para reserva
router.post('/reservations', function (req, res, next) {

  // Criando as validações antes de enviar para o banco de dados
  // Se não tem o nome
  if (!req.body.name) {
    // Caso o nome não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    reservations.render(req, res, "Digite o nome")

  } else if (!req.body.email) {
    // Caso o e-mail não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    reservations.render(req, res, "Digite o e-mail")

  } else if (!req.body.people) {
    // Caso o "numero de pessoas" não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    reservations.render(req, res, "Selecione o número de pessoas")

  } else if (!req.body.date) {
    // Caso a "data" não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    reservations.render(req, res, "Selecione a data")

  } else if (!req.body.time) {
    // Caso o "horário" não esteja selecionado
    // A página vai ser renderizada com as informações salvas
    // E como um mensagem do que falhou
    reservations.render(req, res, "Selecione a hora")

  } else {

    // No método POST, usando o método "send" e não o método "render"
    // Pois estamos enviando os dados e não renderizando a página
    // E enviamos os dados via "req.body" (corpo dos dados da requisição)

    // Estamos passando os dados do corpo requisição como parâmetros para o
    // metodo save(). E o retorno do método save é uma Promise

    reservations.save(req.body).then(results => {

      // Entra aqui quando o processo ocorreu sem erro

      // Limpando os dados da página, pois entramos no sucesso da reserva
      req.body = {}

      // Por isso o "null" render da página
      reservations.render(req, res, null, "Reserva realizada com sucesso")

    }).catch(err => {

      // Estamos usando o "err.message" e não apenas "err",
      // Pois nesse ponto temos que passar um texto e não um objeto
      reservations.render(req, res, err.message)

    })

  }

})

router.get('/services', function (req, res, next) {

  res.render('services', {

    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'

  });

})

router.post('/subscribe', function (req, res, next) {

  emails.save(req).then(results => {

    res.send(results);

  }).catch(err => {

    res.send(err)

  });

});

module.exports = router;
