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