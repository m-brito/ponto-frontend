let user = recuperarStorage("userCompleto");
window.onload = async () => {
    await atualizarUsuarioLogado();
    iniciarRotas();
    carregarFeed();
}

async function atualizarUsuarioLogado() {
    await buscarUsuarioLogado();
    user = recuperarStorage("userCompleto");
}

async function carregarFeed() {

    document.querySelector("body main nav div#perfil img#fotoUsuario").src = user.foto;
    document.querySelector("body main nav h2#nomeUsuario").innerHTML = user.nome;
}

// Funções de rota
function homeHandler() {
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h1>Bem-vindo à página inicial ${usuarioLogado["login"]}</h1>`;
}

function userHandler(params) {
    document.title = `Usuario ${params.username}`;
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<h1>Perfil de ' + params.username + '</h1><p>Esta é a página do usuário ' + params.username + '.</p>';
}

async function iniciarPonto() {
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h1>Pagina de ponto</h1>`;
}

async function iniciarConfiguracoes() {
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h1>Pagina de configuracoes</h1>`;
}

async function iniciarSair() {
    salvarStorage("userLogado", "");
    componentNotificacao.show({
        message: "Saindo",
        cor: "green"
    });
    setTimeout(() => {
        window.location = "./../../../../";
    },2000)
}
