async function iniciarGrupoHorarios() {
    let grupoHorario = await gruposHorarios();
    let estruturaGrupoHorario = `
        <div id="containerGrupoHorario">
            <div id="grupoHorarioCabecalho">
                <h1>Grupos de horario</h1>
            </div>
            <div id="grupoHorarioFerramentas">
                <h2>+ Novo Grupo Horario</h2>
            </div>
            <div id="grupoHorarioConteudo"></div>
        </div>
    `;
    document.querySelector("div#content").innerHTML = estruturaGrupoHorario;
    for(let x=0; x<grupoHorario.length; x++) {
        let cartaoGrupoHorario = `
            <div class="grupoHorarioCartao">
                <div class="grupoHorarioImagemCartao">
                    <img src="../../../../public/assets/icone-relogio.png" alt="Icone de um relogio">
                </div>
                <div class="grupoHorarioConteudoCartao">
                    <h2 class="grupoHorarioNomeCartao">${grupoHorario[x].nome ?? "-"}</h2>
                    <p>Quantidade de horarios: ${grupoHorario[x].horarios.length ?? "-"}</p>
                    <p>Inicio de expediente: ${grupoHorario[x].horarios.length > 0 ? grupoHorario[x].horarios[0].hora : "-"}</p>
                    <p>Fim de expediente: ${grupoHorario[x].horarios.length > 0 ? grupoHorario[x].horarios[grupoHorario[x].horarios.length-1].hora : "-"}</p>
                    <div class="grupoHorarioCartaoOpcoes">
                        <a class="grupoHorarioAbrir" href="#/grupo-horario/${grupoHorario[x].id}">Abrir</a>
                        <button class="grupoHorarioDeletar" onclick="deletarGrupoH(${grupoHorario[x].id})">
                            <img src="../../../../public/assets/icone-deletar.svg"
                                alt="Icone de uma lixeira - Deletar">
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.querySelector("div#content div#containerGrupoHorario div#grupoHorarioConteudo").innerHTML += cartaoGrupoHorario;
    }
    document.querySelector("div#containerGrupoHorario div#grupoHorarioFerramentas h2").addEventListener("click", () => {
        cadastrarGrupoHora();     
    });
}

async function cadastrarGrupoHora() {
    componentTextoInput.open({
        onok: async (nome) => {
            const resp = await cadastrarGrupoHoraRequisicao(nome)
            if (resp.status >= 300) {
                componentNotificacao.show({
                    message: "Tivemos problemas ao cadastrar Grupo de horario",
                    cor: "red"
                });
            } else {
                componentNotificacao.show({
                    message: "Grupo de horario cadastrado com sucesso!",
                    cor: "green"
                });
                window.location = `#/grupo-horario/${resp.id}`;
                componentNotificacao.show({
                    message: "Cadastre os horarios para esse grupo!",
                    cor: "orange"
                });
            }
            iniciarGrupoHorarios();
        }
    });
}

async function deletarGrupoH(id) {
    const resp = await deletarGrupohorario(id);
    if(resp.status >= 300) {
        componentNotificacao.show({
            message: resp.message,
            cor: "red"
        });
    } else {
        componentNotificacao.show({
            message: GRUPO_HORARIO_EXCLUIDO_SUCESSO,
            cor: "green"
        });
        iniciarGrupoHorarios();
    }
}