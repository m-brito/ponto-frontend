async function iniciarGrupoHorariosId(params) {
    let grupoHorario = await grupoHorarioId(params["id-grupo-horario"]);
    if (grupoHorario.status >= 300) {
        componentNotificacao.show({
            message: grupoHorario.message,
            cor: "green"
        });
    } else {
        let estruturaGrupoHorario = `
            <div id="containerGrupoHorario">
                <div id="grupoHorarioCabecalho">
                    <h1>${grupoHorario.nome ?? "Carregando..."}</h1>
                </div>
                <div id="grupoHorarioFerramentas">
                    <h2 id="novoGrupoHorario">+ Novo Horario</h2>
                </div>
                <div id="grupoHorarioConteudo">
                    ${grupoHorario["horarios"].length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Hora</th>
                                    <th>Acoes</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    ` : "<h2 style='width: 100% !important; text-align: center;'>Nenhum horario cadastado!</h2> <p>Para que esse grupo apareca para seleção no perfil é necessario de pelo menos 2 horarios cadastrados(entrada e saida)</p>"}
                </div>
            </div>
        `;
        document.querySelector("div#content").innerHTML = estruturaGrupoHorario;
        horariosOrdenados = organizarHorarios(grupoHorario["horarios"]);
        for (let x = 0; x < horariosOrdenados.length; x++) {
            let linha = `
                <tr>
                    <td>${grupoHorario["horarios"][x].nome}</td>
                    <td>${grupoHorario["horarios"][x].hora}</td>
                    <td>
                        <button class="bttEditar" onclick="editarHorario(${grupoHorario["horarios"][x].id}, '${grupoHorario["horarios"][x].nome}', '${grupoHorario["horarios"][x].hora}', ${params["id-grupo-horario"]})">Editar</button>    
                        <button class="bttExcluir" onclick="deletarHorario(${grupoHorario["horarios"][x].id}, ${params["id-grupo-horario"]})">Excluir</button>    
                    </td>
                </tr>
            `;
            document.querySelector("div#content div#containerGrupoHorario div#grupoHorarioConteudo table tbody").innerHTML += linha;
        }
        document.querySelector("div#content div#containerGrupoHorario div#grupoHorarioFerramentas h2#novoGrupoHorario").addEventListener("click", () => { cadastrarHora(params) })
    }
}
async function cadastrarHora(parametros) {
    componentHoraInput.open({
        onok: async (hora, nome) => {
            const resp = await cadastrarHoraRequisicao(hora, nome, parametros["id-grupo-horario"])
            if (resp.status >= 300) {
                componentNotificacao.show({
                    message: "Tivemos problemas ao cadastrar hora",
                    cor: "red"
                });
            } else {
                componentNotificacao.show({
                    message: "Hora cadastrado com sucesso!",
                    cor: "green"
                });
            }
            iniciarGrupoHorariosId(parametros);
        }
    });
}
async function editarHorario(id, nome, hora, idGrupoHorario) {
    componentHoraInput.open({
        onok: async (hora, nome) => {
            const resp = await editarHoraRequisicao(hora, nome, id)
            if (resp.status >= 300) {
                componentNotificacao.show({
                    message: "Tivemos problemas ao editar hora",
                    cor: "red"
                });
            } else {
                componentNotificacao.show({
                    message: "Hora editada com sucesso!",
                    cor: "green"
                });
            }
            iniciarGrupoHorariosId({
                "id-grupo-horario": idGrupoHorario
            });
        },
        valores: {
            "nome": nome,
            "hora": hora
        },
    });
}

async function deletarHorario(id, idGrupoHorario) {
    user = recuperarStorage("userCompleto");
    if(user.grupoHorario?.id == idGrupoHorario) {
        let grupoHorario = await grupoHorarioId(idGrupoHorario);
        if(grupoHorario.horarios.length == 2) {
            componentNotificacao.show({
                message: "Voce não pode ficar com menos de dois horarios cadastrados! \n Este Grupo Horario esta em uso!",
                cor: "orange"
            });
            return;
        }
    }
    const resp = await deletarHoraRequisicao(id);
    if (resp.status >= 300) {
        componentNotificacao.show({
            message: "Tivemos problemas ao excluir horario",
            cor: "red"
        });
    } else {
        componentNotificacao.show({
            message: "Horario excluido com sucesso!",
            cor: "green"
        });
    }
    iniciarGrupoHorariosId({
        "id-grupo-horario": idGrupoHorario
    });
}