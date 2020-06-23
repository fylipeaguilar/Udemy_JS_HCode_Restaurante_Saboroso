// Não vamos criar uma "classe" e sim um "prototype"
// Ou seja, vamos adicionar um método em uma classe
// Neste caso a nossa classe é HTMLFormElement

HTMLFormElement.prototype.save = function() {

    let form = this;

    return new Promise((resolve, reject) => {

        form.addEventListener('submit', e => {

            // Cancelar o envio padrão do formulário para não enviar o post ainda
            e.preventDefault();
    
            // Criando um objeto com os dados
            let formData = new FormData(form);
    
            // Passando os dados para o nosso servidor via AJAX
            // Fetch(buscar): fetch("route").then => O método "fetch"
            fetch(form.action, {
    
              // Alterar o método para POST
              method: form.method,
              // Passando os dados do formuláio
              body: formData
    
            })
            // Esse "response" são os dados de envio do servidor
            // e não do conteúdo da mensagem. Por isso o "response.JSON()"
            .then(response => response.json())
            // Assim temos uma nova promessa.
            // Agora o "json" tem o conteúdo dos dados
            .then(json => {
    
                // Atualizar a tela após clicar no botão "salvar"
                resolve(json)
    
            }).catch(err => {

                reject(err)

            });
    
        });

    });

}