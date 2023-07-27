let user = recuperarStorage("userCompleto");
var h;
var m;
var s;

window.onload = async () => {
    var intervalHorario = setInterval(() => {
        h = new Date().getHours();
        m = new Date().getMinutes();
        s = new Date().getSeconds();
        // Inserir zero
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
    });
    await atualizarUsuarioLogado();
    iniciarRotas();
    carregarFeed();
    carregarAcoesMenu();
}

async function atualizarUsuarioLogado() {
    await buscarUsuarioLogado();
    user = recuperarStorage("userCompleto");
}

async function carregarAcoesMenu() {
    menus = Object.keys(menuOptions).map((opt) => {
        return menuOptions[opt].allowedRoles.includes(user.tipo) ? `<a ${opt == "Sair" ? 'id="sair"' : ''} href="${menuOptions[opt].url}">${opt}</a>` : null;
    });
    document.getElementById("menuAcoes").innerHTML = `
        ${menus.join('')}
    `;
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
