// Como vamos acessar o banco de dados
// temos que criar a nossa conexao
var conn = require('./db');
//const { param } = require('../routes/admin');

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

            `, [

                email

            ], (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    if (!results.length > 0) {

                        reject("Usuário ou senha incorretos!!")

                    } else {

                        let row = results[0];

                        if (row.password !== password) {

                            reject("Usuário ou senha incorretos!!")

                        } else {

                            resolve(row)

                        }

                    }

                }

            });

        })

    },


    // Método para listar os "menus" do banco de dados mySQL
    getUsers() {

        return new Promise((resolve, reject) => {

            conn.query(`

                SELECT * FROM tb_users ORDER BY name;

            ` , (err, results) => {

                if (err) {

                    reject(err);

                }

                console.log(results)
                resolve(results);

            });

        });

    },

    // Método para listar os "salvar" novos pratos no banco de dados mySQL
    save(fields) {

        // O processo de salvar o dados é uma Promise
        return new Promise((resolve, reject) => {

            let query, queryPhoto = '', params = [

                fields.name,
                fields.email,

                // A senha é so no insert
                //fields.senha

            ];

            if (parseInt(fields.id) > 0) {

                params.push(fields.id);

                query = `
                
                    UPDATE tb_users
                        SET name = ?, 
                            email =?
                        WHERE id = ?
        
                `;

            } else {

                query = `
                    
                    INSERT INTO 
                        tb_users (name, email, password)
                        VALUES (?, ?, ?)
                `;

                params.push(fields.password)

            }

            conn.query(query, params, (err, results) => {

                if (err) {

                    // console.log(query, params)
                    reject(err)

                } else {

                    // console.log(query, params)
                    resolve(results)

                }

            })

        })

    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`

                DELETE FROM tb_users 
                    WHERE id = ?

            `, [

                id

            ], (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    resolve(results)

                }

            })

        });

    },

    changePassword(req) {

        return new Promise((resolve, reject) => {

            if (!req.fields.password) {

                reject('Preencha a senha!!')

            } else if (!req.fields.passwordConfirm) {

                reject('Preencha a senha de confirmação!!')

            } else if (req.fields.password !== req.fields.passwordConfirm) {

                reject('Senha incorreta!!')

            } else {


                conn.query(`

                UPDATE 
                    tb_users
                SET 
                    password = ?
                WHERE 
                    id = ?
    
            `, [

                    req.fields.password,
                    req.fields.id

                ], (err, results) => {

                    if (err) {

                        // Passando o resultado como string
                        reject(err.message)

                    } else {

                        resolve(results)

                    }

                })

            }

        })

    }

}