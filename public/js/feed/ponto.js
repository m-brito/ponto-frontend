var varSetInterval;
var horarios;

async function iniciarPonto() {
    horarios = await pontoDiaRequisicao();
    var contentDiv = document.getElementById('content');
    var template = await grupoHorarioId(user?.grupoHorario?.id) ?? null;
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
            <button id="bttPonto">Marcar</button>
            <div id="horas"></div>
            <div id="minutos"></div>
            <div id="segundos"></div>
            <div id="ampm"></div>
        </div>
    `;

    let horariosHtml = template?.horarios?.forEach((t, index) => {
        document.getElementById("horarioTemplatePonto").innerHTML += `
            <tr>
                <td>${t.nome}</td>
                <td>${t.hora}</td>
                <td id="horaBatida${index}">${horarios[index]?.hora ?? "-"}</td>
            </tr>
        `;
    });
    document.getElementById("horarioTemplatePonto").innerHTML += `
        <tr>
            <td cowspan="3" colspan="3">Total trabalhado: 8 horas</td>
        </tr>
    `;

    varSetInterval = setInterval(() => {
        const horas = document.querySelector('#horas');
        const minutos = document.querySelector('#minutos');
        const segundos = document.querySelector('#segundos');
        const ampm = document.querySelector('#ampm');
        let am = "AM";

        // Am ou PM
        if (h > 12) {
            // h = h - 12
            am = "PM"
        }

        horas.innerHTML = h + ":";
        minutos.innerHTML = m + ":";
        segundos.innerHTML = s + "&nbsp";
        ampm.innerHTML = am;
    })

    document.getElementById("bttPonto").addEventListener("click", async (e) => {
        e.target.classList.add("animacaoClique");
        p = document.createElement("p");
        p.innerHTML = "🕐";
        p.id="elementoAnimacao";
        p.classList.add("pular")
        document.querySelector("body").appendChild(p);
        horarios = await pontoDiaRequisicao();
        document.querySelector(`#horaBatida${horarios.length}`).classList.add("piscando");
        animateElement("elementoAnimacao", "relogio-ditital", `horaBatida${horarios.length}`, 2000)
        setTimeout(() => {
            e.target.classList.remove("animacaoClique");
            p.remove();
            document.querySelector(`#horaBatida${horarios.length}`).classList.remove("piscando");
            document.querySelector(`#horaBatida${horarios.length}`).innerHTML = obterHoraAtual();
        }, 2000)
    })
}