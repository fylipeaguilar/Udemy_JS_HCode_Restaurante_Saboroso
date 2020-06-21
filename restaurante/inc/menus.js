let conn = require('./db');
let path = require('path')

module.exports = {

    
    // Método para listar os "menus" do banco de dados mySQL
    getMenus() {

        return new Promise((resolve, reject) => {

            conn.query(`

                SELECT * FROM tb_menus ORDER BY title;

            ` ,  (err, results) => {

                if(err) {

                    reject(err);

                }

                resolve(results);

            });

        });
 
    },

    // Método para listar os "salvar" novos pratos no banco de dados mySQL
    save(fields, files) {

        // O processo de salvar o dados é uma Promise
        return new Promise((resolve, reject) => {

            // Fazendo um parse para pegar apensa o nome do arquivo
            fields.photo = `images/${path.parse(files.photo.path).base}`;

            conn.query(`
            
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)

            `, [

                fields.title,
                fields.description,
                fields.price,
                // Temos que salvas o endereço da imagem
                fields.photo

            ], (err, results) => {

                if(err) {

                    reject(err)

                } else {

                    resolve(results)

                }

            })

        })        

    }
    
}