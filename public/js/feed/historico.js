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
            for (let i = 0; i < pontosOrganizados.maisPontos; i++) {
                linha += `<td>${pontosOrganizados?.pontos[ponto][i]?.hora?.slice(0, 5) ?? '-'}</td>`;
                templates += `<td>${pontosOrganizados?.pontos[ponto][i]?.horaTemplate?.slice(0, 5) ?? '-'}</td>`;
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
                    ${pontosOrganizados.pontos[ponto].length > 0 ? `<button style="width: ${90/2}%;" class="bttExcluir">Excluir</button>` : ''}
                </td>
            </tr>`;
        }
        tabelaHistorico.innerHTML += linha;
    }
}

function montarTabela(colunas, idUsuarioHistorico) {
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
    `;
    content.innerHTML = tabela;
}

function detalhesPonto(data) {
    window.location.href = `#/ponto/detalhes/${data}`;
}

async function iniciarHistorico(params) {
    let dataInicial = '2023-06-16';
    let dataFinal = getProximoDiaBaseData(dataInicial, 15).toISOString().slice(0, 10);
    const pontos = await pontoPeriodoRequisicao(params['id-usuario'], stringToData(dataInicial), stringToData(dataFinal));
    const pontosOrganizados = organizarListaPontos(pontos, dataInicial, dataFinal);
    montarTabela(pontosOrganizados.maisPontos, params['id-usuario']);
    exibirTabelaPontos(pontosOrganizados, params['id-usuario']);
}