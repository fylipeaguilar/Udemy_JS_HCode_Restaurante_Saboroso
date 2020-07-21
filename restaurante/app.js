var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Configuração das "sessions via redis"
var session = require('express-session');
var RedisStore = require('connect-redis')(session)
// ***** Essa parte é a mesma coisa da linha acima **********//
// var connectRedis = require('connect-redis')
// var RedisStore = connectRedis(session)

// Fazendo o require do formdable
//(https://www.npmjs.com/package/formidable)
var formidable = require('formidable')

// Implementação do socket.io
// https://socket.io/get-started/chat/
// Temos que externalizar o "http"
var http = require('http')
var socket = require('socket.io')


// Para usar para fazer os uploads via "path"
var path = require('path');
const router = require('./routes/admin');

var app = express();

// Implementação após incluir o  "socket.io"
var http = http.Server(app);
var io = socket(http);

io.on('connection', function (socket) {

  console.log('Novo usuário conectado!')

  // Toda vez que um novo "cliente" é connectado
  // Nós criamos o médoto "reservations update",
  // no arquivo (index.js)

  // // O "io" avisa a todos os usuários que estão conectados
  // // O "socket" avisa apenas o usuário que acabou de se conectar
  // io.emit('reservations update', {

  //   date: new Date()

  // })

})

// Implementação do socket.io tivemos que trazer as 2 linhas de código
// pra baixo do "io.on()"

// Configuracao das Rotas - Antes da implementacao do (io)
// var indexRouter = require('./routes/index');
// var adminRouter = require('./routes/admin');


// Configuracao das Rotas - Antes da implementacao do (io)
var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);


// Criando um meaddleware para uso do formdable
app.use(function (req, res, next) {

  req.body = {};

  if ((req.method === 'POST') && (req.path != '/admin/login')) {

    //(https://www.npmjs.com/package/formidable)
    var form = formidable.IncomingForm({

      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true

    });

    // Fazer o parse dos dados
    form.parse(req, function (err, fields, files) {

      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();
    });

  } else {

    next();

  }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurando o middleware (implementado junto com a session via redis)
app.use(session({

  store: new RedisStore({

    // Informamos a conexão do Redis
    host: 'localhost',
    port: 6379

  }),

  // Informar a senha da conexao
  secret: 'p@ssw0rd',

  // Cria uma nova se a sessao expirar
  resave: true,

  // Manter a sessao salva no banco
  saveUninitialized: true

}))

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Implementação do socket.io
http.listen(3000, function () {

  console.log("Servidor em excucao!!!")  

})


// Após as configurações para rodar o "socket.io"
// Não precisamos mais do "module.exports"
// module.exports = app;