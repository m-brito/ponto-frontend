window.onload = () => {
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity()) {
        // Todas as validações passaram, pode prosseguir com o envio do formulário
            let email = document.querySelector("input[name=iEmail]").value;
            let senha = document.querySelector("input[name=iSenha]").value;
            try {
                const resp = await login(email, senha);
                if(resp.status >= 300) {
                    componentNotificacao.show({
                        message: resp.message,
                        cor: "red"
                    });
                } else {
                    salvarStorage("userLogado", resp);
                    buscarUsuarioLogado();
                    componentNotificacao.show({
                        message: LOGADO_SUCESSO+"\nEntrando em 5 segundos",
                        cor: "green"
                    });
                    setTimeout(() => {
                        window.location = "./../feed/feed.html";
                    }, 5000)
                }
            } catch (error) {
                console.error(error);
                componentNotificacao.show({
                    message: "Falha ao tentar se conectar com o servidor",
                    cor: "orange"
                });
            }
        } else {
            componentNotificacao.show({
                message: "Dados incorretos",
                cor: "red"
            });
        }
    })
}