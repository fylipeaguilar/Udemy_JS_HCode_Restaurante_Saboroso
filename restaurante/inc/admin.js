var conn = require("./db");

module.exports = {

    // Método para contar os dados e montar o nosso dashboard
    dashboard(){

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT
                    (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                    (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                    (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                    (SELECT COUNT(*) FROM tb_users) AS nrusers;
            `, (err, results) => {

                if(err) {

                    reject(err)

                } else {

                    resolve(results[0])
                }

            })
        })
        
    },

    // Recebe os dados da requisição
    // Demais parâmetros
    getParams(req, params){

        // Irá retornar um objeto e fazer um "assign" para juntar os objetos
        return Object.assign({}, {

            menus: req.menus,
            user: req.session.user

        }, params)

    },

    getMenus(req){

        // O método vai retornar um array de objetos
        let menus = [
            {
                text: 'Tela Inicial',
                href: '/admin/',
                icon: 'home',
                active: false
            }, {
                text: 'Menu',
                href: '/admin/menus',
                icon: 'cutlery',
                active: false
            }, {
                text: 'Reservas',
                href: '/admin/reservations',
                icon: 'calendar-check-o',
                active: false
            }, {
                text: 'Contatos',
                href: '/admin/contacts',
                icon: 'comments',
                active: false
            }, {
                text: 'Usuários',
                href: '/admin/users',
                icon: 'user',
                active: false
            }, {
                text: 'E-mail',
                href: '/admin/emails',
                icon: 'envelope',
                active: false
            }
        ];

        // O método "map" procura e troca o que precisamos
        menus.map(menu => {

            // console.log(req.url, menu.href)
            if(menu.href === `/admin${req.url}`) menu.active = true

        })
        
        return menus;

    }

}