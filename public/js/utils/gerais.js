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
    setTimeout(function () {
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

// Função para obter o último dia específico do mês
function getLastDayOfMonth(day) {
    const today = new Date();
    const currentMonth = today.getMonth();
    let lastDay;

    if (today.getDate() >= day) {
        lastDay = new Date(today.getFullYear(), currentMonth, day);
    } else {
        if (currentMonth === 0) {
            lastDay = new Date(today.getFullYear() - 1, 11, day);
        } else {
            lastDay = new Date(today.getFullYear(), currentMonth - 1, day);
        }
    }

    return lastDay;
}

function montarData(data) {
    var ano = data.getFullYear();
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var dia = String(data.getDate()).padStart(2, '0');

    return (currentDate = ano + '-' + mes + '-' + dia);
}

function stringToData(data) {
    var partesData = data.split("-");
    var ano = parseInt(partesData[0]);
    var mes = parseInt(partesData[1]) - 1;
    var dia = parseInt(partesData[2]);

    return new Date(ano, mes, dia);
}

function montarDataExibir(data) {
    var data = stringToData(data);
    var ano = data.getFullYear();
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var dia = String(data.getDate()).padStart(2, '0');

    return (currentDate = dia + '/' + mes + '/' + ano);
}

function organizarListaPontos(listaPontos, dataInicial, dataFinal) {
    const result = {
        'maisPontos': 0,
        'pontos': {}
    };

    // Criar um objeto vazio para cada dia dentro do intervalo especificado
    const currentDate = stringToData(dataInicial);
    const finalDate = stringToData(dataFinal);
    while (currentDate <= finalDate) {
        const formattedDate = currentDate.toISOString().slice(0, 10);
        result['pontos'][formattedDate] = [];
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Preencher a lista de pontos correspondente para cada data existente
    let qtdDiaIgual = 0;
    let dataAnterior = listaPontos?.[0]?.data ?? null;
    for (const ponto of listaPontos) {
        if (ponto.data == dataAnterior) {
            qtdDiaIgual++;
        } else {
            if (result['maisPontos'] < qtdDiaIgual) {
                result['maisPontos'] = qtdDiaIgual;
            }
            dataAnterior = ponto.data;
            qtdDiaIgual = 1;
        }
        const data = ponto.data;
        if (data in result['pontos']) {
            result['pontos'][data].push(ponto);
        }
    }
    if (result['maisPontos'] < qtdDiaIgual) {
        result['maisPontos'] = qtdDiaIgual;
        qtdDiaIgual++;
    }

    return result;
}

// Função para obter o próximo dia específico do mês
function getNextDayOfMonth(day) {
    const today = new Date();
    const currentMonth = today.getMonth();
    let nextDay;

    if (today.getDate() <= day) {
        nextDay = new Date(today.getFullYear(), currentMonth, day);
    } else {
        if (currentMonth === 11) {
            nextDay = new Date(today.getFullYear() + 1, 0, day);
        } else {
            nextDay = new Date(today.getFullYear(), currentMonth + 1, day);
        }
    }

    return nextDay;
}

function getProximoDiaBaseData(date, dia) {
    const currentDate = stringToData(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let nextDay;

    if (currentDate.getDate() < dia) {
        nextDay = new Date(currentYear, currentMonth, dia);
    } else {
        if (currentMonth === 11) {
            nextDay = new Date(currentYear + 1, 0, dia);
        } else {
            nextDay = new Date(currentYear, currentMonth + 1, dia);
        }
    }

    return nextDay;
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
        if(b.hora == null) {
            return -1;
        } else if(a.hora == null) {
            return 1;
        }
        const horaA = new Date(`1970-01-01T${a.hora}`);
        const horaB = new Date(`1970-01-01T${b.hora}`);
        return horaA - horaB;
    })
}