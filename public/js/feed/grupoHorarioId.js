async function iniciarGrupoHorariosId(params) {
    let grupoHorario = await grupoHorarioId(params["id-grupo-horario"]);
    if(grupoHorario.status >= 300) {
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
                <div id="grupoHorarioConteudo">
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
                </div>
            </div>
        `;
        document.querySelector("div#content").innerHTML = estruturaGrupoHorario;
        for(let x=0; x<grupoHorario["horarios"].length; x++) {
            let linha = `
                <tr>
                    <td>${grupoHorario["horarios"][x].nome}</td>
                    <td>${grupoHorario["horarios"][x].hora}</td>
                    <td>
                        <button>Editar</button>    
                        <button>Excluir</button>    
                    </td>
                </tr>
            `;
            document.querySelector("div#content div#containerGrupoHorario div#grupoHorarioConteudo table tbody").innerHTML += linha;
        }
    }
}