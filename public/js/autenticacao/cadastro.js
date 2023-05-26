window.onload = () => {
    document.querySelector("input[id=foto]").addEventListener('change', function(){
        const valorInput = document.querySelector("input[id=foto]").value;
        const mostrarNome = document.querySelector("div[id=nomeArquivo]");
        mostrarNome.innerHTML = valorInput;
    });

    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity()) {
        // Todas as validações passaram, pode prosseguir com o envio do formulário
            let nome = document.querySelector("input[name=iNome]").value;
            let email = document.querySelector("input[name=iEmail]").value;
            let senha = document.querySelector("input[name=iSenha]").value;
            let foto;
            if(document.getElementById("foto").value) {
                foto = document.getElementById("foto").files[0];
            } else {
                foto = "";
            }
            try {
                const resp = await cadastrarUsuario(foto, nome, email, senha);
                if(resp.status >= 300) {
                    componentNotificacao.show({
                        message: resp.message,
                        cor: "red"
                    });
                } else {
                    componentNotificacao.show({
                        message: USUARIO_CADASTRADO_SUCESSO,
                        cor: "green"
                    });
                    try {
                        const resp = await login(email, senha);
                        if(resp.status >= 300) {
                            componentNotificacao.show({
                                message: resp.message,
                                cor: "red"
                            });
                        } else {
                            salvarStorage("userLogado", resp);
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
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            componentNotificacao.show({
                message: "Dados incorretos",
                cor: "red"
            });
        }
    })
}