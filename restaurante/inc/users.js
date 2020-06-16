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

        })

    },

    // Método de login
    login(email, password) {

        // Vamos retornar um promessa
        return new Promise((resolve, reject) =>{

            console.log("Email: ", email)

            conn.query(`
            
                SELECT * FROM tb_users WHERE email = ?

            `), [

                // Passamos o valor do nosso argumento
                email 

            ], (err, results) => {

                 if(err) {

                    // Se der erro chamamos o reject passando o "err"
                    reject(err)

                 } else {

                    if(!results.length > 0) {

                        reject("Usuário ou senha incorreto(s)")

                    } else {

                        let row = results[0];

                        // Se não ter erro, vamos validar a senha
                        // O results vai trazer um array com várias linhas
                        if(row.password !== password){

                            reject("Usuário ou senha incorreto(s)")

                        } else {

                            // Retorna com o dados do usuário autenticado
                            resolve(row)

                        }

                    }

                 }

            }

        })

    }

}