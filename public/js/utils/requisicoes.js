var HOST = config.API_HOST ?? "";

// Usuario
// Cadastrar Usuario
async function cadastrarUsuario(img, nome, email, senha) {
    const dados = new FormData();
    dados.append("fotoUsuario", img)
    dados.append("nome", nome)
    dados.append("email", email)
    dados.append("senha", senha)
    const resp = await fetch(`${HOST}/api/usuario`, {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: dados
    })

    const data = await resp.json();
    return data;
}

//Logar
async function login(email, senha) {
    const resp = await fetch(`${HOST}/api/usuario/auth`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "senha": senha
        })
    })

    const data = await resp.json();
    return data;
}

//Perfil de Usuario
async function perfil() {
    const resp = await fetch(`${HOST}/api/usuario/perfil`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

//Perfil de Usuario ID
async function perfilUsuario(id) {
    const resp = await fetch(`${HOST}/api/usuario/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

async function editarUsuario(jsonNovoUsuario, idGrupoHorario) {
    const resp = await fetch(`${HOST}/api/usuario`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "usuario": jsonNovoUsuario,
            "idGrupoHorario": idGrupoHorario ?? null
        })
    })
    const data = await resp.json();
    return data;
}

async function editarFotoUsuario(img) {
    const dados = new FormData();
    dados.append("fotoUsuario", img)
    const resp = await fetch(`${HOST}/api/usuario/foto`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: dados
    })
    const data = await resp.json();
    return data;
}

// GrupoHorario
async function cadastrarGrupoHoraRequisicao(nome) {
    const resp = await fetch(`${HOST}/api/grupohorario`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "nome": nome,
            "horarios": []
        })
    })

    const data = await resp.json();
    return data;
}

async function gruposHorarios() {
    const resp = await fetch(`${HOST}/api/grupohorario`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

async function grupoHorarioId(id) {
    const resp = await fetch(`${HOST}/api/grupohorario/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

async function deletarGrupohorario(id) {
    const resp = await fetch(`${HOST}/api/grupohorario/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    return resp;
}

// Horario
async function cadastrarHoraRequisicao(hora, nome, grupohorario) {
    const resp = await fetch(`${HOST}/api/horario/grupohorario/${grupohorario}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "hora": hora,
            "nome": nome,
        })
    })

    const data = await resp.json();
    return data;
}

async function editarHoraRequisicao(hora, nome, id) {
    const resp = await fetch(`${HOST}/api/horario/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "hora": hora,
            "nome": nome,
        })
    })

    const data = await resp.json();
    return data;
}

async function deletarHoraRequisicao(id) {
    const resp = await fetch(`${HOST}/api/horario/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        }
    })

    return resp;
}

// PONTO
async function pontoDiaRequisicao(dataReq) {
    const resp = await fetch(`${HOST}/api/ponto/${montarData(dataReq)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

async function pontoPeriodoRequisicao(idUsuarioConsulta, dataInicial, dataFinal) {
    const resp = await fetch(`${HOST}/api/ponto/historico/${idUsuarioConsulta}?dataInicial=${montarData(dataInicial)}&dataFinal=${montarData(dataFinal)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
    })
    const data = await resp.json();
    return data;
}

async function cadastrarPontoRequisicao(hora, grupohorario, parametroData) {
    var today = parametroData;
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');

    var currentDate = year + '-' + month + '-' + day;
    const resp = await fetch(`${HOST}/api/ponto`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "hora": hora,
            "data": currentDate,
            "grupoHorario": grupohorario
        })
    })

    const data = await resp.json();
    return data;
}

async function editarPontoRequisicao(hora, id) {
    const resp = await fetch(`${HOST}/api/ponto/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        },
        body: JSON.stringify({
            "hora": hora
        })
    })

    const data = await resp.json();
    return data;
}

async function deletarPontoRequisicao(data) {
    const resp = await fetch(`${HOST}/api/ponto/${data}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${recuperarStorage("userLogado").token}`
        }
    })

    return resp;
}
