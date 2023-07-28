function exibirTabelaPontos(pontosOrganizados, idUsuario) {
    const diasDaSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    let colunas = (pontosOrganizados.maisPontos * 2) + 2;
    let tabelaHistorico = document.getElementById("pontosBatidoHistorico");
    tabelaHistorico.innerHTML = ``;
    for(ponto in pontosOrganizados.pontos) {
        let linha = `<tr>
                        <td>${montarDataExibir(ponto)}</td>
                        <td>${diasDaSemana[stringToData(ponto).getDay()]}</td>`;
        if(pontosOrganizados.pontos[ponto].length > 0) {
            let templates = ``;
            let pontosOrdenados = organizarHorarios(pontosOrganizados?.pontos[ponto])
            for (let i = 0; i < pontosOrganizados.maisPontos; i++) {
                linha += `<td>${pontosOrdenados[i]?.hora?.slice(0, 5) ?? '-'}</td>`;
                templates += `<td>${pontosOrdenados[i]?.horaTemplate?.slice(0, 5) ?? '-'}</td>`;
            }
            linha += templates;
        } else {  
            for (let i = 0; i < colunas - 2; i++) {
                linha += `<td>-</td>`;
            }
        }
        if(idUsuario == user.id) {
            linha += `
                <td>
                    ${pontosOrganizados.pontos[ponto].length > 0 ? `<button style="width: ${90/2}%;" class="bttEditar" onclick="detalhesPonto('${ponto}')">Editar</button>` : `<button style="width: ${90}%;" onclick="detalhesPonto('${ponto}')" class="bttAdicionar">Adicionar</button>`}
                    ${pontosOrganizados.pontos[ponto].length > 0 ? `<button style="width: ${90/2}%;" class="bttExcluir" onclick="deletarPontoDia('${ponto}', '${idUsuario}')">Excluir</button>` : ''}
                </td>
            </tr>`;
        }
        tabelaHistorico.innerHTML += linha;
    }
}

function montarContainer(colunas, idUsuarioHistorico) {
    let content = document.getElementById('content');
    let colunasNomes = ['Data', 'Dia Semana'];
    for(let x=0; x<colunas; x+=2) {
        colunasNomes.push(x == 0 ? 'Entrada' : 'Volta');
        colunasNomes.push('Saida');
    }
    for(let x=0; x<colunas; x+=2) {
        colunasNomes.push(x == 0 ? 'T Entrada' : 'T Volta');
        colunasNomes.push('T Saida');
    }
    if(idUsuarioHistorico == user.id) {
        colunasNomes.push("Acoes");
    }
    colunasNomes = colunasNomes.map(element => `<th>${element}</th>`)
    let tabela = `
        <div id="containerHistorico">
            <div id="filtro">
                <div class="grupoInput">
                    <label for="iDataInicial">Data Inicial: </label>
                    <input type="date" name="iDataInicial" id="iDataInicial">
                </div>
                <p id="pDataFinal">Até dd/mm/aaaa</p>
            </div>
            <div id="containerTabela">
                <table>
                    <thead>
                        <tr>
                            ${colunasNomes.join('')}
                        </tr>
                    </thead>
                    <tbody id="pontosBatidoHistorico">
                    </tbody>
                </table>
            </div>
        </div>
    `;
    content.innerHTML = tabela;

    document.querySelector("#iDataInicial").addEventListener("change", async (event) => {
        let usuario = await perfilUsuario(idUsuarioHistorico);
        const dataInicial = event.target.value;
        const dataFinal = getProximoDiaBaseData(dataInicial, usuario.diaFechamentoPonto);
        const pontos = await pontoPeriodoRequisicao(idUsuarioHistorico, stringToData(dataInicial), dataFinal);
        const pontosOrganizados = organizarListaPontos(pontos, dataInicial, dataFinal.toISOString().slice(0, 10));
        montarContainer(pontosOrganizados.maisPontos, idUsuarioHistorico);
        exibirTabelaPontos(pontosOrganizados, idUsuarioHistorico);
        document.querySelector("div#containerHistorico div#filtro div.grupoInput input#iDataInicial").value = dataInicial;
        document.querySelector("div#containerHistorico div#filtro p#pDataFinal").innerHTML = `Até ${montarDataExibir(dataFinal.toISOString().slice(0, 10))}`;
    });
}

function detalhesPonto(data) {
    window.location.href = `#/ponto/detalhes/${data}`;
}

function deletarPontoDia(data, idUsuario) {
    Confirm.open({
        mensagem: `Tem certeza que deseja exluir os pontos da data ${montarDataExibir(data)}?`,
        textoOK: "Sim",
        textoCancelar: "Cancelar",
        onok: async () => {
            const resp = await deletarPontoRequisicao(data);
            if (resp.status >= 300) {
                componentNotificacao.show({
                    message: `Tivemos problemas ao excluir os pontos da data ${montarDataExibir(data)}`,
                    cor: "red"
                });
            } else {
                componentNotificacao.show({
                    message: `Pontos da data ${montarDataExibir(data)} deletados com sucesso!`,
                    cor: "green"
                });
            }
            iniciarHistorico({"id-usuario": idUsuario});
        }
    })
}

async function iniciarHistorico(params) {
    let usuario = await perfilUsuario(params['id-usuario']);
    let dataInicial;
    let dataFinal;
    if(usuario.id == user.id) {
        dataInicial = getLastDayOfMonth(usuario.diaFechamentoPonto+1).toISOString().slice(0, 10);
        dataFinal = getProximoDiaBaseData(dataInicial, usuario.diaFechamentoPonto).toISOString().slice(0, 10);
    } else {
        dataInicial = getUltimoDiaBaseData(usuario.ultimaDataAprovada, usuario.diaFechamentoPonto).toISOString().slice(0, 10);
        dataFinal = getProximoDiaBaseData(dataInicial, usuario.diaFechamentoPonto).toISOString().slice(0, 10);
    }
    const pontos = await pontoPeriodoRequisicao(params['id-usuario'], stringToData(dataInicial), stringToData(dataFinal));
    const pontosOrganizados = organizarListaPontos(pontos, dataInicial, dataFinal);
    montarContainer(pontosOrganizados.maisPontos, params['id-usuario']);
    exibirTabelaPontos(pontosOrganizados, params['id-usuario']);
    document.querySelector("div#containerHistorico div#filtro div.grupoInput input#iDataInicial").value = dataInicial;
    document.querySelector("div#containerHistorico div#filtro p#pDataFinal").innerHTML = `Até ${montarDataExibir(dataFinal)}`;
}