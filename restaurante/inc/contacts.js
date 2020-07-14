// ***** Arquivo Gerenciar as regras de negócio de reservas ************//

var conn = require('./db')

// Método para renderizar os dados do contatos
// caso o formulário esteja incompleto
module.exports = {

    // Como queremos savar os dados, temos que receber os dados
    // da requisição

    render(req, res, error, success) {

        res.render('contacts', {

            title: 'Contato - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi!',

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

            // Vamos fazer um insert
            // Como vamos fazer um insert, precisamos chamar a conexão db
            conn.query(`
                
                INSERT INTO tb_contacts (name, email, message) VALUES (?, ?, ?)

            `, 
                // 2º argumento são os valores
                // Os "?" serão trocados pelos parâmetros
                [
                    fields.name,
                    fields.email,
                    fields.message
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

    },

    // Método para listar os "menus" do banco de dados mySQL
    getContacts() {

        return new Promise((resolve, reject) => {

            conn.query(`

                SELECT * FROM tb_contacts ORDER BY id;

            ` ,  (err, results) => {

                if(err) {

                    reject(err);

                }

                // console.log(results)
                resolve(results);

            });

        });
 
    },

    delete(id){

        return new Promise((resolve, reject) => {

            conn.query(`

                DELETE FROM tb_contacts
                    WHERE id = ?

            `, [

                id

            ], (err, results) => {

                if(err) {

                    reject(err)

                } else {

                    resolve(results)

                }

            })

        });

    }

}