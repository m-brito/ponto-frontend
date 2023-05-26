async function submitFormEditarPerfil(event) {
    event.preventDefault();
    if (event.submitter.id == "bttConfirmar") {
        let nome = document.querySelector("body main div#content div#containerPerfil form .camposPerfil input#nomeCompletoPerfil").value;
        const resp = await editarUsuario({
            "nome": nome
        })
        iniciarPerfil();
    }
}

function editarPeril() {
    document.querySelector("body main div#content div#containerPerfil form #opcoes #opcoesEditando").style.display = "Flex";
    document.querySelector("body main div#content div#containerPerfil form input").style.cursor = "Text";
    document.querySelector("body main div#content div#containerPerfil form input").disabled = false;
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
    user = recuperarStorage("userCompleto");
    carregarFeed();
    var contentDiv = document.getElementById('content');
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
                    <label for="nome">Nome Completo*</label>
                    <input type="text" name="nome" id="nomeCompletoPerfil" value="${user.nome}" required disabled>
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