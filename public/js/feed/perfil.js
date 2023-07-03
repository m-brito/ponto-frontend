async function submitFormEditarPerfil(event) {
    event.preventDefault();
    if (event.submitter.id == "bttConfirmar") {
        let nome = document.querySelector("body main div#content div#containerPerfil form .camposPerfil input#nomeCompletoPerfil").value;
        let diaFechaPonto = document.querySelector("body main div#content div#containerPerfil form .camposPerfil input#diaFechaPonto").value;
        let ultimoMesAprovado = document.querySelector("body main div#content div#containerPerfil form .camposPerfil input#ultimoMesAprovado").value;
        let idGrupoHorario = document.querySelector("body main div#content div#containerPerfil form .camposPerfil select#grupoHorario").value;
        const resp = await editarUsuario({
            "nome": nome,
            "diaFechamentoPonto": diaFechaPonto,
            "ultimaDataAprovada": ultimoMesAprovado
        }, idGrupoHorario == "" ? null : idGrupoHorario)
        iniciarPerfil();
    }
}

async function editarPeril() {
    document.querySelector("body main div#content div#containerPerfil form #opcoes #opcoesEditando").style.display = "Flex";
    document.querySelector("body main div#content div#containerPerfil form input#nomeCompletoPerfil").style.cursor = "Text";
    document.querySelector("body main div#content div#containerPerfil form input#nomeCompletoPerfil").disabled = false;
    document.querySelector("body main div#content div#containerPerfil form input#diaFechaPonto").style.cursor = "Text";
    document.querySelector("body main div#content div#containerPerfil form input#diaFechaPonto").disabled = false;
    document.querySelector("body main div#content div#containerPerfil form input#ultimoMesAprovado").style.cursor = "Text";
    document.querySelector("body main div#content div#containerPerfil form input#ultimoMesAprovado").disabled = false;
    horarios = await pontoDiaRequisicao(new Date());
    if(horarios.length == 0) {
        document.querySelector("body main div#content div#containerPerfil form select").style.cursor = "auto";
        document.querySelector("body main div#content div#containerPerfil form select").disabled = false;
    }
    document.querySelector("body main div#content div#containerPerfil form #opcoes #bttEditar").remove();
}

async function editarFotoPerfil() {
    await buscarUsuarioLogado();
    user = recuperarStorage("userCompleto");
    componentEditarFotoUsuario.open({
        json: {
            "fotoUsuario": user.foto
        },
        onok: async (foto) => {
            const resp = await editarFotoUsuario(foto)
            if (resp.status >= 300) {
                componentNotificacao.show({
                    message: "Tivemos problemas ao editar usuario",
                    cor: "red"
                });
            } else {
                componentNotificacao.show({
                    message: "Foto de perfil editado com sucesso!",
                    cor: "green"
                });
            }
            iniciarPerfil()
        }
    });
}

async function iniciarPerfil() {
    await buscarUsuarioLogado();
    let gruposHorario = await gruposHorarios();
    let grupoHorariosFiltrado = gruposHorario.filter(grupoHorario => grupoHorario.horarios.length >= 2);
    user = recuperarStorage("userCompleto");
    carregarFeed();
    var contentDiv = document.getElementById('content');
    let ultimoDiaFechaPonto = getLastDayOfMonth(user.diaFechamentoPonto);
    let hoje = new Date();
    let divPerfil = `
        <div id="containerPerfil">
            <form id="formEditarPerfil" action="#">
                <div id="foto">
                    <div id="dadosFoto">
                        <img onclick="editarFotoPerfil()" src="${user.foto}" alt="Foto Perfil">
                        <div class="retina">
                            <p id="editarFotoPerfil" onclick="editarFotoPerfil()">Editar</p>
                        </div>
                    </div>
                </div>
                <div class="camposPerfil">
                    <p>Primeiro acesso: ${user?.dataCriacao ? montarDataExibir(user.dataCriacao) : '-'}</p>
                    <h3>Usuario</h3>
                    <label for="nomeCompletoPerfil">Nome Completo*</label>
                    <input type="text" name="nome" id="nomeCompletoPerfil" value="${user.nome}" required disabled>

                    <label for="grupoHorario">Grupo Horario*</label>
                    <select name="grupoHorario" id="grupoHorario" disabled>
                        ${user.grupoHorario == null ? '<option disabled selected value="">Selecione uma opção</option>' : ''}
                        ${grupoHorariosFiltrado.map(horario => `<option value="${horario.id}" ${horario.id == user.grupoHorario?.id ? 'selected' : ''}>${horario.nome} (Total de ${horario.horarios.length} horarios)</option>`)}
                    </select>

                    <h3>Ponto</h3>
    
                    <label for="diaFechaPonto">Dia fechamento de ponto*</label>
                    <input type="number" name="diaFechaPonto" min="1" max="28" id="diaFechaPonto" value="${user.diaFechamentoPonto ?? ''}" required disabled>
                    
                    <label for="ultimoMesAprovado">Ultima data aprovada*</label>
                    
                    <input type="date" min="${stringToData(user?.ultimaDataAprovada) - ultimoDiaFechaPonto <= 0 ? user?.ultimaDataAprovada: user?.dataCriacao ? stringToData(user.dataCriacao) - ultimoDiaFechaPonto > 0 ? montarData(stringToData(user.dataCriacao)) : montarData(ultimoDiaFechaPonto) : ''}" max="${montarData(hoje)}" name="ultimoMesAprovado" id="ultimoMesAprovado" value="${user.ultimaDataAprovada ?? ''}" required disabled>

                </div>
                
                <div id="opcoes">
                    <button onclick="editarPeril()" id="bttEditar"><p>Editar</p></button>
                    <div id="opcoesEditando">
                        <button type="submit" id="bttConfirmar"><p>Confirmar</p></button>
                        <button onclick="iniciarPerfil()" id="bttCancelar"><p>Cancelar</p></button>
                    </div>
                </div>
            </form>
        </div>
    `;
    contentDiv.innerHTML = divPerfil;
    document.querySelector("body main div#content form#formEditarPerfil").addEventListener("submit", submitFormEditarPerfil)
}