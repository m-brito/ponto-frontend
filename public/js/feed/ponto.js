var varSetInterval;
var horarios;
var template;

function calcularHorasTrabalhadas(horarios) {
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

function contarHorariosBatidos(horarios) {
    let contHorariosBatidos = 0;
    for (let i = 0; i < horarios.length; i++) {
        if (horarios[i].hora !== null) {
            contHorariosBatidos++;
        }
    }
    return contHorariosBatidos;
}

function exibirTabelaHorarios(horariosTemplate, horariosBatidos) {
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

function atualizarTotalTrabalhado(horasTrabalhadas) {
    const totalTrabalhado = document.getElementById('totalTrabalhado');
    totalTrabalhado.innerHTML = `Total trabalhado: ${horasTrabalhadas.horas} horas, ${horasTrabalhadas.minutos} minutos e ${horasTrabalhadas.segundos} segundos`;
}

function atualizarRelogioDigital(h, m, s) {
    const horas = document.querySelector('#horas');
    const minutos = document.querySelector('#minutos');
    const segundos = document.querySelector('#segundos');
    const ampm = document.querySelector('#ampm');
    let am = 'AM';

    // Am ou PM
    if (h > 12) {
        // h = h - 12
        am = 'PM';
    }

    horas.innerHTML = h + ':';
    minutos.innerHTML = m + ':';
    segundos.innerHTML = s + '&nbsp;';
    ampm.innerHTML = am;
}

async function marcarPonto(e) {
    document.getElementById('bttPonto').disabled = true;
    document.getElementById('bttPonto').style.cursor = 'not-allowed';
    e.target.classList.add('animacaoClique');
    const p = document.createElement('p');
    p.innerHTML = '🕐';
    p.id = 'elementoAnimacao';
    p.classList.add('pular');
    document.querySelector('body').appendChild(p);
    horarios = await pontoDiaRequisicao(new Date());
    let contHorariosBatidos = contarHorariosBatidos(horarios);
    document.querySelector(`#horaBatida${contHorariosBatidos}`).classList.add('piscando');
    animateElement('elementoAnimacao', 'relogio-ditital', `horaBatida${contHorariosBatidos}`, 2000);
    const horaBatida = obterHoraAtual();
    setTimeout(async () => {
        document.getElementById('bttPonto').disabled = false;
        document.getElementById('bttPonto').style.cursor = 'pointer';
        e.target.classList.remove('animacaoClique');
        p.remove();
        document.querySelector(`#horaBatida${contHorariosBatidos}`).classList.remove('piscando');
        const resp = await cadastrarPontoRequisicao(horaBatida, template.id);
        if (resp.status >= 300) {
            componentNotificacao.show({
                message: resp.message,
                cor: 'red'
            });
        } else {
            horarios = await pontoDiaRequisicao(new Date());
            document.querySelector(`#horaBatida${contHorariosBatidos}`).innerHTML = horaBatida;
            componentNotificacao.show({
                message: 'Ponto Batido',
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

async function iniciarPonto() {
    horarios = await pontoDiaRequisicao(new Date());
    const contHorariosBatidos = contarHorariosBatidos(horarios);
    const horasTrabalhadas = calcularHorasTrabalhadas(horarios);

    var contentDiv = document.getElementById('content');
    template = null;
    if(user?.grupoHorario?.id != null) {
        template = await grupoHorarioId(user?.grupoHorario?.id)
    }
    contentDiv.innerHTML = `
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
        <div id="relogio-ditital">
            <button id="bttPonto" ${template?.horarios?.length == contHorariosBatidos ? "style='cursor: not-allowed' disabled" : ""}>Marcar</button>
            <div id="horas"></div>
            <div id="minutos"></div>
            <div id="segundos"></div>
            <div id="ampm"></div>
        </div>
    `;

    exibirTabelaHorarios(template?.horarios, horarios);
    atualizarTotalTrabalhado(horasTrabalhadas);
    atualizarRelogioDigital(h, m, s);
    varSetInterval = setInterval(() => {
        atualizarRelogioDigital(h, m, s);
    }, 1000);

    document.getElementById('bttPonto').addEventListener('click', marcarPonto);
}
