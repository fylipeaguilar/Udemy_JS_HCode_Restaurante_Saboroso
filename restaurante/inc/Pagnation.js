// Vamos precisar acessar o banco de dados
var conn = require('./db');

class Pagination {

    // Criando o construtor da classe
    constructor(
        // No contrutor teremos: query, parametros, itens por pagina
        query,
        params = [],
        itensPerPage = 10
    ) {

        // Colocando os valores dentro do this
        // Para usarmos em qualquer método
        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;

    }

    // Criando o método getPage()
    getPage(page) {

        // page -1 = porque o primeiro dado do array
        // do banco de dados começa em 1
        this.currentPage = page - 1;

        // Adicionando elementos aos parametros
        this.params.push(

            // Vamos adicionar 2 itens
            // Item 1: pagina
            this.currentPage * this.itensPerPage,

            // Item 2: quantidade de registro por página
            this.itensPerPage
        );

        return new Promise((resolve, reject) => {

            conn.query([
                // Vamos enviar 2 query
                // (1) - Select dos dados
                this.query,

                // Essa será uma query fixa
                // (2) - Quantidade de "rows" encontradas
                "SELECT FOUND_ROWS() AS FOUND_ROWS"

                // Usamos o "join(';')" para separar os comando por ";"
            ].join(";"), this.params, (err, results) => {

                if (err) {

                    reject(err);

                } else {

                    this.data = results[0];

                    // O total de linhas, so me interessa apenas 1 dado
                    // Que é o dado do numero de registros, que está 
                    // na coluna virtual "FOUND_ROWS", que está na 
                    // primeira linha (posicao "0"), do segundo array (possicao "1")
                    this.total = results[1][0].FOUND_ROWS;

                    //Fazendo arredondamento para cima com o método (Math.ceil)
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);

                    this.currentPage++;

                    console.log(this.total);
                    console.log(this.totalPages);

                    // No caso desse resolve, não vamos
                    // passar apesar o results, vamos um objeto
                    // com os dados, a pagina que está sendo lida
                    resolve(this.data);

                }

            });

        });

    }

    //******** Criando alguns métodos auxiliares *************//
    getTotal() {
        return this.total;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotolPages() {
        return this.totalPages;
    }

    getNavegation(params) {

        // Quantidade de botões de paginacao que queremos exibir
        let limitPagesNav = 5
        let links = [];

        // numero de paginas (paginacao)
        let nrstart = 0;
        let nrend = 0;

        if (this.getTotolPages() < limitPagesNav) {

            limitPagesNav = this.getTotolPages()

        }

        // Verificar se estamos nas primeiras paginas
        // Deixando a pagina currente no meio dos botões
        if ((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1) {

            nrstart = 1;
            nrend = limitPagesNav;

        }

        //Estamos chegando nas ultimas páginas
        else if ((this.getCurrentPage() + parseInt(limitPagesNav / 1)) > this.getTotolPages()) {

            nrstart = this.getCurrentPage() - limitPagesNav;
            nrend = this.getTotolPages();

        }

        // 
        else {

            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2)
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2)

        }

        //Colocando os botoes de "seta"
        if (this.getCurrentPage() > 1) {

            links.push({

                text: '<<',
                href: '?' + this.getQreryString(Object.assign({}, params, {
                    page: this.getCurrentPage - 1
                }))

            })
        }

        for (let x = nrstart; x <= nrend; x++) {

            links.push({

                text: x,
                href: '?' + this.getQreryString(Object.assign({}, params, { page: x })),
                // Poderiamos fazer com um ternario, mas o "verificação" ja retorna "true" ou "false"
                active: (x === this.getCurrentPage())

            })

        }

        //Colocando os botoes de "seta"
        if (this.getCurrentPage() < this.getTotolPages()) {

            links.push({

                text: '>>',
                href: '?' + this.getQreryString(Object.assign({}, params, {
                    page: this.getCurrentPage + 1
                }))

            })
        }

        return links;

    }

    getQreryString(params) {

        // Pegando os parâmetros da nossa URL
        let queryString = [];

        for (let name in params) {

            queryString.push(`${name}=${params[name]}`)

        }

        return queryString.join('&')

    }

}

// Vamos exportar os dados da classe
// Sendo assim temos que dar o export da classe
module.exports = Pagination;