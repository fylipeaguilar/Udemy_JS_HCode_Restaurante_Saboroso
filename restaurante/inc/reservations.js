// ***** Arquivo Gerenciar as regras de negócio de reservas ************//

var conn = require('./db');
var path = require('path');

// Método para renderizar os dados do contatos
// caso o formulário esteja incompleto
module.exports = {

    // Como queremos savar os dados, temos que receber os dados
    // da requisição

    render(req, res, error, success) {

        res.render('reservations', {

            title: 'Reserva - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',

            // Devolvendo para a tela os dados inseridos
            body: req.body,
            error,
            success
        });

    },

    // Receber os campos como parâmetro
    save(fields) {

        // Como temos "algo" que vai levar um tempo para acontecer
        // significa que temos uma "Promessa"
        return new Promise((resolve, reject) => {

            // Precisamos colocar a data do padrão do mySQL "AAAA/MM/DD"
            let date = fields.date.split('/');

            fields.date = `${date[2]}-${date[1]}-${date[0]}`

            // Vamos fazer um insert
            // Como vamos fazer um insert, precisamos chamar a conexão db
            conn.query(`
                
                INSERT INTO tb_reservations (name, email, people, date, time) values (?, ?, ?, ?, ?)

            `, 
                
            // 2º argumento são os valores
            // Os "?" serão trocados pelos parâmetros
            [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ],

            // 3º argumento do método query é a função de callback
            // Se funcionou ou não e o que fazer 
            (err, results) => {

                if(err) {

                    reject(err)

                } else {

                    resolve(results)

                }

            })

        })

    }

}