# Projeto Restaurante Saboroso

Desenvolvi esse projeto no curso da Udemy com os instrutores da HCode.

O projeto teve o objeto de criar um site de Restaurante (Público) e Administração (Privado).

## Funcionalidades da aplicação

	1. Público:
	 1.1. Home: Possibilidade de fazer reserva pela página princial, apresentação dos pratos populares, serviços, depoimentos, contadores, inscrições para receber e-mail de promoções, dados de contato.
	 1.2. Menu: Apresentação dos menus do restaurante;
	 1.3. Serviços: Visualização dos serviços do restaurante;
	 1.4. Contato: Envio de um contato para o proprietário;
	 1.5. Reservas: Realização de reserva;
	2. Privado:
	 2.1. Tela Inicial: Apresentação de um Dashboard;
	 2.2. Menu: Lista os pratos e 3 botôes para adicionar, editar e excluir pratos;
	 2.3. Reservas: Lista as reservas e 3 botôes para adicionar, editar e excluir reservas. Grafico que apresenta a quantidade de reservas.
	 2.4. Contato: Lista os contatos com um botão excluir contatos;
	 2.5. Usuário: Lista os usuários e 3 botôes para adicionar, editar e excluir usuários;
	 2.6. E-mail: Lista os e-mails que recebem ofertas com um botão excluir contatos;
	 

## Ensinamentos

 - Conexão com a base de dados mySQL com NodeJS: utilizamos o módulo ```mysql2``` (https://www.npmjs.com/package/mysql2);
 - Utilizamos o módulo do EJS;
 - Reutilização de código (frontend), utilizado includes;
 - Renderização de páginas, utilização do métodos get, post via base de dados;
 - Session com o Redis: (https://github.com/MicrosoftArchive/redis) e (https://www.npmjs.com/package/express-session)
 - Prototipe;
 - Ajax;
 - Moment.js
 - Gráficos: Chart.JS (Goustei muito :D)
 - Socket.io: emit() e on()

 
## Rodando a aplicação

 - Acessar a pasta do projeto;
 - Executar o comando para subir a aplicação:
 
	```set DEBUG=restaurante* & npm start```
	
 - Exemplo da aplicação startada com sucesso
 
``` 
fylip@DESKTOP-N41AQ92 MINGW64 /d/Cursos_Aprendizados/Udemy/JavaScript_HCode/Projeto_Restaurante_Saboroso/restaurante (master)
$ set DEBUG=restaurante* & npm start
[1] 2097

> restaurante@0.0.0 start D:\Cursos_Aprendizados\Udemy\JavaScript_HCode\Projeto_Restaurante_Saboroso\restaurante
> nodemon app.js

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json  
[nodemon] starting `node app.js`
Servidor em excucao!!!
Novo usuário conectado! 
```

## Acessando a aplicação

Para esse projeto temos 2 URL's de acesso. O acesso livre ao público e o acesso privado ao Proprietário do sistema

 - Acesso a parte pública do site: http://localhost:3000/
 - Acesso a parte privado do site: http://localhost:3000/admin
