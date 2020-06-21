// Como vamos acessar o banco de dados
// temos que criar a nossa conexao
var conn = require('./db')

// Criamos um módulo, que exporta um objeto
module.exports = {

    // Método de renderização da página
    render(req, res, error) {

        // Renderização da rota
        res.render('admin/login', {

            body: req.body,
            error

        });

    },

    // Método de login
    login(email, password) {

        return new Promise((resolve, reject) => {

            conn.query(`
            
            SELECT * FROM tb_users WHERE email = ?

            `,[
                
                email

            ], (err, results) => {

                if(err) {

                    reject(err)

                } else { 

                    if(!results.length > 0) {

                        reject("Usuário ou senha incorretos!!")

                    }  else {

                        let row = results[0];

                        if(row.password !== password) {

                            reject("Usuário ou senha incorretos!!")
                            
                        } else {

                            resolve(row)

                        }

                    }                   

                }

            });

        })

    }

}