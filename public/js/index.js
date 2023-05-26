window.onload = async () => {
    if(await buscarUsuarioLogado()) {
        componentNotificacao.show({
            message: `Voce ja esta logado!\nConectando como ${recuperarStorage("userLogado").login} em 5 segundos`,
            cor: "green"
        });
        setTimeout(() => {
            window.location = "./src/view/pages/feed/feed.html"
        }, 5000)
    }
}