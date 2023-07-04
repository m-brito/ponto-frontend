var varSetInterval;
var horarios;
var template;

function cadastrarPontoCalcularHorasTrabalhadas(horarios) {
    if(horarios == null || horarios.length == 0) {
        return {
            horas: 0,
            minutos: 0,
            segundos: 0
        };
    }
    let totalHorasTrabalhadas = 0;
    const passoLimite = horarios.length % 2 === 0 ? horarios.length : horarios.length - 1;
    for (let i = 0; i < passoLimite; i += 2) {
        const entrada = horarios[i].hora;
        const volta = horarios[i + 1].hora;
        if (entrada && volta) {
            const dataEntrada = new Date(horarios[i].data + 'T' + entrada);
            const dataVolta = new Date(horarios[i + 1].data + 'T' + volta);
            const diff = dataVolta - dataEntrada;
            totalHorasTrabalhadas += diff;
        }
    }

    const segundos = Math.floor(totalHorasTrabalhadas / 1000) % 60;
    const minutos = Math.floor(totalHorasTrabalhadas / 1000 / 60) % 60;
    const horas = Math.floor(totalHorasTrabalhadas / 1000 / 60 / 60);

    return {
        horas: horas,
        minutos: minutos,
        segundos: segundos
    };
}

function cadastrarPontoContarHorariosBatidos(horarios) {
    let contHorariosBatidos = 0;
    for (let i = 0; i < horarios.length; i++) {
        if (horarios[i].hora !== null) {
            contHorariosBatidos++;
        }
    }
    return contHorariosBatidos;
}

function cadastrarPontoExibirTabelaHorarios(horariosTemplate, horariosBatidos) {
    const horarioTemplatePonto = document.getElementById('horarioTemplatePonto');
    const templateRows = horariosTemplate?.map((t, index) => `
      <tr>
        <td>${t.nome}</td>
        <td>${t.hora}</td>
        <td id="horaBatida${index}">${horariosBatidos[index]?.hora ?? '-'}</td>
      </tr>
    `)
        .join('');
    horarioTemplatePonto.innerHTML = templateRows ?? '';
    let horasTrabalhadas = calcularHorasTrabalhadas(horarios);
    horarioTemplatePonto.innerHTML += `
        <tr>
            <td cowspan="3" colspan="3" id="totalTrabalhado">Total trabalhado: ${horasTrabalhadas.horas} horas, ${horasTrabalhadas.minutos} minutos e ${horasTrabalhadas.segundos} segundos</td>
        </tr>
    `;
}

function cadastrarPontoAtualizarTotalTrabalhado(horasTrabalhadas) {
    const totalTrabalhado = document.getElementById('totalTrabalhado');
    totalTrabalhado.innerHTML = `Total trabalhado: ${horasTrabalhadas.horas} horas, ${horasTrabalhadas.minutos} minutos e ${horasTrabalhadas.segundos} segundos`;
}

async function cadastrarPontoCadastrar(dataString) {
    document.getElementById('bttPonto').disabled = true;
    document.getElementById('bttPonto').style.cursor = 'not-allowed';
    const p = document.createElement('p');
    p.innerHTML = '🕐';
    p.id = 'elementoAnimacao';
    p.classList.add('pular');
    document.querySelector('body').appendChild(p);
    horarios = await pontoDiaRequisicao(stringToData(dataString));
    let contHorariosBatidos = contarHorariosBatidos(horarios);
    document.querySelector(`#horaBatida${contHorariosBatidos}`).classList.add('piscando');
    animateElement('elementoAnimacao', 'iHora', `horaBatida${contHorariosBatidos}`, 2000);
    const inputHora = document.getElementById('iHora').value;
    setTimeout(async () => {
        document.getElementById('bttPonto').disabled = false;
        document.getElementById('bttPonto').style.cursor = 'pointer';
        p.remove();
        document.querySelector(`#horaBatida${contHorariosBatidos}`).classList.remove('piscando');
        const resp = await cadastrarPontoRequisicao(inputHora, template.id, stringToData(dataString));
        if (resp.status >= 300) {
            componentNotificacao.show({
                message: resp.message,
                cor: 'red'
            });
        } else {
            horarios = await pontoDiaRequisicao(stringToData(dataString));
            document.querySelector(`#horaBatida${contHorariosBatidos}`).innerHTML = inputHora;
            componentNotificacao.show({
                message: 'Ponto Cadastrado',
                cor: 'green'
            });
            const horasTrabalhadas = calcularHorasTrabalhadas(horarios);
            atualizarTotalTrabalhado(horasTrabalhadas);
        }
        contHorariosBatidos = contarHorariosBatidos(horarios);
        if (template?.horarios?.length == contHorariosBatidos) {
            document.getElementById('bttPonto').disabled = true;
            document.getElementById('bttPonto').style.cursor = 'not-allowed';
        }
    }, 2000);
}

async function iniciarCadastroPonto(params) {
    horarios = await pontoDiaRequisicao(stringToData(params["data"]));
    const contHorariosBatidos = contarHorariosBatidos(horarios);
    const horasTrabalhadas = calcularHorasTrabalhadas(horarios);

    var contentDiv = document.getElementById('content');
    template = null;
    if(user?.grupoHorario?.id != null) {
        template = await grupoHorarioId(user?.grupoHorario?.id)
    }
    contentDiv.innerHTML = `
        <h2 style="margin: 50px 0">Cadastrar ponto na data ${montarDataExibir(params["data"])}</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Hora</th>
                    <th>Hora Marcada</th>
                </tr>
            </thead>
            <tbody id="horarioTemplatePonto">
            </tbody>
        </table>
        <div>
            <form id="cadastrarPonto">
                <label>Ponto: </label>
                <input id="iHora" type="time" required>
                <button id="bttPonto">Cadastrar</button>
            </form>
        </div>
    `;
    exibirTabelaHorarios(template?.horarios, horarios);
    atualizarTotalTrabalhado(horasTrabalhadas);
    document.getElementById('cadastrarPonto').addEventListener("submit", () => cadastrarPontoCadastrar(params["data"]));
}