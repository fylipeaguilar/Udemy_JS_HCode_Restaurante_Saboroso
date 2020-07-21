// ***** Arquivo Gerenciar as regras de negócio de reservas ************//

var conn = require('./db');
const Pagination = require('./Pagnation');

// Chamando o moment para "configurar" a data do gráfico
// Como é um módulo instalado, não precisa do caminho
var moment = require("moment");
const { dashboard } = require('./admin');


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

    // Método para listar os "menus" do banco de dados mySQL
    // Acrescentamos o argumento "page" para trabalhar com
    // a "paginacao" da pagina. E vamos receber agora 3 parametros (page, inicio e fim da busca)
    getReservations(req) {

        return new Promise((resolve, reject) => {

            let page = req.query.page;
            let dateStart = req.query.start;
            let dateEnd = req.query.end;

            // "if" acrescentado para checar o processo de paginacao
            if (!page) page = 1;

            let params = [];

            if (dateStart && dateEnd) params.push(dateStart, dateEnd)

            // Instaciando a classe "Pagination"
            let pag = new Pagination(

                // Passar para o nosso construtor 
                // qual a "query" que nós queremos executar
                `
                SELECT SQL_CALC_FOUND_ROWS * FROM
                    tb_reservations
                ${(dateStart && dateEnd) ? 'WHERE date BETWEEN ? AND ?' : ''}
                ORDER BY 
                    name
                LIMIT ?, ?
            `, params
            );

            // Retorna os dados da página (numero da pagina)
            // que passamos nos parametros
            pag.getPage(page).then(data => {

                resolve({

                    data,
                    links: pag.getNavegation(req.query)

                })

            })

        })

    },

    // Receber os campos como parâmetro
    save(fields) {

        // Como temos "algo" que vai levar um tempo para acontecer
        // significa que temos uma "Promessa"
        return new Promise((resolve, reject) => {

            //indexOf: procura um caracter dentro da variável
            if (fields.date.indexOf('/') > -1) {

                // Precisamos colocar a data do padrão do mySQL "AAAA/MM/DD"
                let date = fields.date.split('/');

                fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            }

            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ];

            if (parseInt(fields.id) > 0) {

                // Vai ser o update
                query = `

                    UPDATE tb_reservations 
                        SET name = ?,
                            email = ?,
                            people = ?,
                            date = ?,
                            time = ?
                        WHERE 
                            id = ?
                `;

                params.push(fields.id);


            } else {

                // vai ser o insert
                query = `
                
                    INSERT INTO 
                        tb_reservations (name, email, people, date, time)
                    VALUES 
                        (?, ?, ?, ?, ?)
                `;

            }

            // Vamos fazer um insert
            // Como vamos fazer um insert, precisamos chamar a conexão db


            // 2º argumento são os valores
            // Os "?" serão trocados pelos parâmetros


            // 3º argumento do método query é a função de callback
            // Se funcionou ou não e o que fazer 

            conn.query(query, params, (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    resolve(results)

                }

            })

        })

    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`

                DELETE FROM tb_reservations
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

    // Receber o "req" para pegar os dados de 
    // inicio e fim da busca
    chart(req) {

        return new Promise((resolve, reject) => {

            // Executar a query na base de dados
            conn.query(`

                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE
                    date BETWEEN ? AND ?
                    GROUP BY YEAR(date), MONTH(date) 
                    ORDER BY YEAR(date) DESC, MONTH(date) DESC;

            `, [

                req.query.start,
                req.query.end

            ], (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    // Não queremos uma "infinidade de valores"
                    // Precisamos de um array só com os meses
                    // E outro array so com os valores
                    let months = [];
                    let values = [];

                    // row = cada linha do resultado da query
                    results.forEach(row => {

                        // Para cada valor encontrado, fazemos um push()
                        // adicionando os valores no array

                        // Formantando a data para receber o 
                        // nome do mÊs e nao "YYYY-MM", que é
                        // como está vindo da base de dados
                        months.push(moment(row.date).format('MMM YYYY'));

                        values.push(row.total)


                    });


                    // Passamos um objeto com o months e values
                    // Que é um objeto com 2 arrays
                    resolve({

                        months,
                        values

                    })

                }

            })

        })

    },

    dashboard() {

        return new Promise((resolve, reject) => {

            // Realizar a conexao com o banco de dados
            conn.query(`

                select
                    (select count(*) from tb_contacts) AS nrcontacts,
                    (select count(*) from tb_menus) AS nrmenus,
                    (select count(*) from tb_reservations) AS nrreservations,
                    (select count(*) from tb_users) AS nrusers;

            `, (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    // Para esse select so temos uma linha de resultado
                    resolve(results[0])

                }

            })

        })

    }

}