const componentEditarFotoUsuario = {
    open(options) {
        options = Object.assign({}, {
            textoOK: "Confirmar",
            textoCancelar: "Cancelar",
            json: {},
            onok: function () { },
            oncancel: function () { }
        }, options);

        const template = this._createTemplate(options);
        const confirmEl = template.content.querySelector(".containerComponent");
        const bttOk = template.content.querySelector(".confirmar");
        const bttFechar = template.content.querySelector(".fecharJanelaConfirmar");
        const bttCancelar = template.content.querySelector(".cancelar");

        this._setupFileInput(confirmEl);
        this._setupButtonClickListeners(confirmEl, bttOk, bttCancelar, bttFechar, options);
        document.body.appendChild(template.content);
    },
    _createTemplate(options) {
        const html = `
        <div class="containerComponent">
            <div class="janelaConfirmar">
                <img src="${options.json.fotoUsuario}" id="fotoEditarPerfil">
                <button class="fecharJanelaConfirmar">&times;</button>
                <div id="containerArquivo">
                    <input type="file" name="fotoPerfil" id="fotoPerfil">
                    <div id="nomeArquivo"></div>
                    <label for="fotoPerfil"><p>Selecionar</p></label>
                </div>
                <div class="janelaConfirmarAcoes">
                    <button class="cancelar"><p>${options.textoCancelar}</p></button>
                    <button class="confirmar"><p>${options.textoOK}</p></button>
                </div>
            </div>
        </div>
      `;

        const template = document.createElement('template');
        template.innerHTML = html;
        return template;
    },
    _setupFileInput(confirmEl) {
        const fileInput = confirmEl.querySelector("input[id=fotoPerfil]");

        fileInput.addEventListener('change', function () {
            const nomeArquivo = confirmEl.querySelector("div[id=nomeArquivo]");
            nomeArquivo.innerHTML = fileInput.value;

            const preview = confirmEl.querySelector('img#fotoEditarPerfil');
            const reader = new FileReader();
            const file = fileInput.files[0];

            reader.readAsDataURL(file);
            reader.onloadend = () => {
                preview.src = reader.result;
            };
        });
    },
    _setupButtonClickListeners(confirmEl, bttOk, bttCancelar, bttFechar, options) {
        // Considerar clique fora do container como cancelar
        // confirmEl.addEventListener("click", e => {
        //     if(e.target === confirmEl) {
        //         options.oncancel();
        //         this._close(confirmEl);
        //     }
        // });

        bttOk.addEventListener("click", () => {
            const fotoPerfilNova = confirmEl.querySelector("input[id=fotoPerfil]").files[0];
            if (fotoPerfilNova != "" && fotoPerfilNova != null && fotoPerfilNova != undefined) {
                options.onok(fotoPerfilNova);
                this._close(confirmEl);
            } else {
                componentNotificacao.show({
                    message: "Preencha os campos obrigatorios",
                    cor: "orange"
                })
            }
        });

        [bttCancelar, bttFechar].forEach(el => {
            el.addEventListener("click", () => {
                options.oncancel();
                this._close(confirmEl);
            })
        });
    },
    _close(confirmEl) {
        confirmEl.classList.add("fecharConfirmar")

        confirmEl.addEventListener("animationend", () => {
            document.body.removeChild(confirmEl);
        })
    }
};

const componentNotificacao = {
    show(options) {
        options = Object.assign({}, {
            message: "",
            cor: "black",
        }, options);
        const notification = document.createElement("div");
        notification.classList.add("notificacao");

        const p = document.createElement("p");
        p.style.color = options.cor;
        p.innerHTML = options.message.replace("\n", "<br>");

        notification.appendChild(p);
        document.body.appendChild(notification);

        notification.style.transition = "transform 0.5s ease-out";

        Array.from(document.querySelectorAll(".notificacao")).forEach((notificacao, index) => {
            notificacao.style.transform = `translateY(-${index * (notificacao.offsetHeight + 10)}px)`;
        });

        setTimeout(() => {
            notification.remove();

            Array.from(document.querySelectorAll(".notificacao")).forEach((notificacao, index) => {
                notificacao.style.transform = `translateY(-${index * (notificacao.offsetHeight + 10)}px)`;
            });
        }, 5000);
    }
}