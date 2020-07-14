class Grid {

    constructor(configs) {

        // Fazendo a configuracao dos eventos
        configs.listeners = Object.assign({

            afterUpdateClick: (e) => {

                // $('') => jQuery
                $('#modal-update').modal('show');

            },

            afterDeleteClick: (e) => {

                // Fazendo o "reload" no caso de sucesso da promessa
                window.location.reload();

            },

            afterFormCreate: (e) => {

                // Fazendo o "reload" no caso de sucesso da promessa
                window.location.reload();

            },

            afterFormUpdate: (e) => {

                // Fazendo o "reload" no caso de sucesso da promessa
                window.location.reload();

            },

            afterFormCreateError: (e) => {

                console.log('Não foi possível enviar o formulário')

            },

            afterFormUpdateError: (e) => {

                console.log('Não foi possível enviar o formulário')

            }

        }, configs.listeners)

        this.options = Object.assign({}, {

            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) => {

                let input = form.querySelector('[name=' + name + ']');
                if (input) input.value = data[name];

            }

        }, configs);

        // Vamos usar como array, pois isso o spread
        this.rows = [...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initButtons();

    }

    // Fazendo um init dos formulários
    initForms() {

        //********** Código para criar novas de reservas **********//
        this.formCreate = document.querySelector(this.options.formCreate);

        // Ele só cria o formulário se exsitir

        if (this.formCreate) {

            this.formCreate.save({

                success: () => {

                    this.fireEvent('afterFormCreate')

                },

                failure: () => {

                    this.fireEvent('afterFormCreateError');

                }

            })

        }

        //***** Código para atualização dos dados de reservas *****//
        this.formUpdate = document.querySelector(this.options.formUpdate);

        // Ele só cria o formulário se exsitir
        if (this.formUpdate) {

            this.formUpdate.save({

                success: () => {

                    this.fireEvent('afterFormUpdate')

                },

                failure: () => {

                    this.fireEvent('afterFormUpdateError');

                }

            })

        }

    }

    // Método de manipulação dos eventos
    fireEvent(name, args) {

        if (typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args)

    }

    // Método para pegar o nosso "tr"
    getTrData(e) {

        // Pegando a "tr" do botão, para pegar os dados dos campos
        let tr = e.path.find(el => {

            return (el.tagName.toUpperCase() === 'TR')

        })

        // Obs.: Lembrando que o dataset só armazena string
        return JSON.parse(tr.dataset.row)

    }

    btnUpdateClick(e) {

        this.fireEvent('beforeUpdateClick', [e]);

        let data = this.getTrData(e);

        // Agora que temos o objeto podemos fazer o forIn

        for (let name in data) {

            // onUpdateLoad: (formUpdate, name, data)
            this.options.onUpdateLoad(this.formUpdate, name, data)

        }

        this.fireEvent('afterUpdateClick', [e]);

    }

    btnDeleteClick(e) {

        this.fireEvent('beforeDeleteClick');

        let data = this.getTrData(e);

        // UX - Perguntar se o usuário realmente deseja excluir 
        // Estamos usando o "eval" por causa do template string que vem no parâmtro
        if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

            //console.log(data.id);
            // Chamando a requisição para deletar o prato do menu
            // Estamos usando o "eval" por causa do template string que vem no parâmtro
            fetch(eval('`' + this.options.deleteUrl + '`'), {

                method: 'DELETE'

            })
                .then(response => response.json())
                .then(json => {

                    this.fireEvent('afterDeleteClick')

                });

        }

    }


    // Fazendo um init dos botoes
    initButtons() {

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e => {


                    if (e.target.classList.contains(this.options.btnUpdate)) {

                        this.btnUpdateClick(e);

                    } else if (e.target.classList.contains(this.options.btnDelete)) {

                        this.btnDeleteClick(e);

                    } else {

                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e])

                    };

                });

            });

        });

    };

}