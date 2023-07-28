function inserirContainer() {
    const container = `
        <div id="containerContratados">
            <div id="formPesquisa">
                <label for="iNome">Nome: </label>
                <div id="containerInput">
                    <input type="text" placeholder="Informe um nome" name="iNome" id="iNome">
                    <button>Pesquisar</button>
                </div>
            </div>
            <div id="resultados">
                
            </div>
        </div>
    `;
    document.getElementById("content").innerHTML = container;
}

function inserirResultados(usuarios) {
    document.querySelector("div#content div#containerContratados div#resultados").innerHTML = '';
    for(let x=0; x<usuarios.length; x++) {
        const cartao = `
            <div class="contratadoCartao">
                <div class="contratadoImagemCartao">
                    <img src="${usuarios[x].foto}" alt="Foto de perfil do usuario ${usuarios[x].nome}">
                </div>
                <div class="contratadoConteudoCartao">
                    <h2 class="contratadoNomeCartao">${usuarios[x].nome}</h2>
                    <p>Setor</p>
                    <p>Ultima data aprovada: ${montarDataExibir(usuarios[x].ultimaDataAprovada)}</p>
                    <div class="contratadoCartaoOpcoes">
                        <a class="contratadoAbrir" href="#/historico/${usuarios[x].id}">Historico</a>
                        <a class="contratadoPerfil" href="#/perfil/${usuarios[x].id}">Perfil</a>
                    </div>
                </div>
            </div>
        `;
        document.querySelector("div#content div#containerContratados div#resultados").innerHTML += cartao;
    }
}

async function iniciarContratados() {
    inserirContainer();
    const result = await perfis();
    inserirResultados(result['content']);
}