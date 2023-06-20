// Mostrar uma popup com uma mensagem
async function mostrarNotificacao(mensagem, cor) {
    const notification = document.createElement("div");
    notification.classList.add("notificacao");

    const p = document.createElement("p");
    p.style.color = cor;
    p.innerHTML = mensagem.replace("\n", "<br>");

    notification.appendChild(p);
    document.body.appendChild(notification);

    // Adiciona uma transição de deslize para a notificação
    notification.style.transition = "transform 0.5s ease-out";

    Array.from(document.querySelectorAll(".notificacao"))
        .forEach((notificacao, index) => {
            notificacao.style.transform = `translateY(-${index * (notificacao.offsetHeight + 10)}px)`;
        });

    // Remove a notificação após 5 segundos
    setTimeout(() => {
        notification.remove();

        Array.from(document.querySelectorAll(".notificacao"))
            .forEach((notificacao, index) => {
                notificacao.style.transform = `translateY(-${index * (notificacao.offsetHeight + 10)}px)`;
            });
    }, 5000);
}

function animateElement(elementId, elementoInicialId, elementoFinalId, duracao, callback) {
    var element = document.getElementById(elementId);
    var inicial = document.getElementById(elementoInicialId);
    var final = document.getElementById(elementoFinalId);

    var rect = inicial.getBoundingClientRect();
    var inicialX = (rect.left + window.scrollX) + rect.width / 2;
    var inicialY = (rect.top + window.scrollY) + rect.height / 2;
    
    var rect2 = final.getBoundingClientRect();
    var finalX = (rect2.left + window.scrollX) + rect2.width / 2;
    var finalY = (rect2.top + window.scrollY) + rect2.height / 2;

    element.style.top = inicialY + 'px';
    element.style.left = inicialX + 'px';
    
    // Ativa a animação
    element.style.transition = 'transform ' + duracao + 'ms';
    element.style.transform = 'translate(' + (finalX - inicialX) + 'px, ' + (finalY - inicialY) + 'px)';

    // Executa o callback após a duração especificada
    setTimeout(function() {
        if (typeof callback === 'function') {
            callback();
        }
    }, duracao);
}

function obterHoraAtual() {
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds();

    // Formata os valores para dois dígitos
    if (hora < 10) {
        hora = '0' + hora;
    }
    if (minutos < 10) {
        minutos = '0' + minutos;
    }
    if (segundos < 10) {
        segundos = '0' + segundos;
    }

    var horaFormatada = hora + ':' + minutos + ':' + segundos;
    return horaFormatada;
}

// Salvar informacoes em localStorage
function salvarStorage(nome, dados) {
    localStorage.setItem(nome, JSON.stringify(dados));
}

function recuperarStorage(nome) {
    const dados = localStorage.getItem(nome);
    if (dados) {
        return JSON.parse(dados);
    } else {
        console.log('Arquivo não encontrado.');
        return null;
    }
}

async function buscarUsuarioLogado() {
    try {
        const resp = await perfil();
        salvarStorage("userCompleto", resp);
        return true;
    } catch (error) {
        return false;
    }
}

function organizarHorarios(horarios) {
    return horarios.sort((a, b) => {
        const horaA = new Date(`1970-01-01T${a.hora}`);
        const horaB = new Date(`1970-01-01T${b.hora}`);
        return horaA - horaB;
    })
}