// ***** Arquivo Gerenciar as regras de negócio de reservas ************//

var conn = require('./db')

// Método para renderizar os dados do contatos
// caso o formulário esteja incompleto
module.exports = {

    // Método para listar os "emails" do banco de dados mySQL
    getEmails() {

        return new Promise((resolve, reject) => {

            conn.query(`

                SELECT * FROM tb_emails ORDER BY id;

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

                DELETE FROM tb_emails
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