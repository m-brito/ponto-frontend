var usuarioLogado;

var routes = {
    '/': {
        handler: iniciarPonto,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/perfil': {
        handler: iniciarPerfil,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/grupo-horario': {
        handler: iniciarGrupoHorarios,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/grupo-horario/:id-grupo-horario': {
        handler: iniciarGrupoHorariosId,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/configuracoes': {
        handler: iniciarConfiguracoes,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/sair': {
        handler: iniciarSair,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
    '/user/:username': {
        handler: userHandler,
        authRequired: true,
        allowedRoles: ["USER", "GESTOR"]
    },
};

function loadContent(route) {
    var matchedRoute = null;
    var authAccept = false;

    // Procura uma rota que corresponda ao padrão
    Object.keys(routes).some(function (pattern) {
        var regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
        if (regex.test(route)) {
            matchedRoute = pattern;
            let role = `${usuarioLogado["tipo"]}`;
            if(routes[matchedRoute].authRequired == false || (routes[matchedRoute].authRequired == true) && routes[matchedRoute].allowedRoles.includes(role)) {
                authAccept = true;
            }
            return true; // Interrompe a iteração
        }
    });

    if (matchedRoute && authAccept) {
        var handler = routes[matchedRoute].handler;

        if (handler && typeof handler === 'function') {
            var params = extractParams(route, matchedRoute);
            handler(params);
        }

        // Salva a rota no histórico do navegador
        var url = location.href;
        history.replaceState(document.title, document.title, url);
    } else if(matchedRoute && authAccept == false) {
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '<h1>Voce não tem permissao para acessar esta rota</h1>';
    } else {
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '<h1>Página não encontrada</h1>';
    }
}

async function handleRouteChange() {
    // document.getElementById('content').innerHTML = "";
    if(!await buscarUsuarioLogado()) {
        componentNotificacao.show({
            message: "Voce foi desconectado\nDeslogando em 5 segundos!",
            cor: "red"
        });
        setTimeout(() => {
            window.location = "./../../../../"
        }, 5000)
    }
    var rota = location.hash.slice(1, location.hash.length);
    var rotaTratada = rota == "" ? "/" : rota; // Obtém a parte da URL após o '#'
    loadContent(rotaTratada);
}

async function iniciarRotas() {
    usuarioLogado = recuperarStorage("userLogado");
    if(!await buscarUsuarioLogado()) {
        componentNotificacao.show({
            message: "Usuario nao encontrado",
            cor: "orange"
        });
        setTimeout(() => {
            window.location = "./../autenticacao/entrar.html"
        },5000);
    }
    // Adicionando um manipulador de eventos para lidar com alterações na rota
    window.addEventListener('popstate', handleRouteChange);
    
    // Carregando o conteúdo com base na rota inicial
    handleRouteChange();
}

// Função para extrair parâmetros da rota
function extractParams(route, matchedRoute) {
    var params = {};
    var routeParts = route.split('/');
    var matchedRouteParts = matchedRoute.split('/');

    for (var i = 0; i < matchedRouteParts.length; i++) {
        if (matchedRouteParts[i].startsWith(':')) {
            var paramKey = matchedRouteParts[i].substr(1);
            var paramValue = decodeURIComponent(routeParts[i]);
            params[paramKey] = paramValue;
        }
    }

    return params;
}