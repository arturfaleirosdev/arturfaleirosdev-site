const GITHUB_USERNAME = "arturfaleirosdev";

async function carregarProjetos() {
    const lista = document.getElementById("listaProjetos");

    try {
        const resposta = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const repositorios = await resposta.json();

        const repositoriosOriginais = repositorios.filter((repo) => !repo.fork);

        if (repositoriosOriginais.length === 0) {
            lista.innerHTML = "<p>Nenhum repositório encontrado.</p>";
            return;
        }

        repositoriosOriginais.forEach((repo) => {
            const card = document.createElement("a");
            card.className = "cardProjeto";
            card.href = repo.html_url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            const imagem = document.createElement("img");
            imagem.src = `https://socialify.git.ci/${GITHUB_USERNAME}/${repo.name}/image?language=1&owner=1&name=1&theme=Dark`;
            imagem.alt = `Capa do repositório ${repo.name}`;
            imagem.loading = "lazy";
            imagem.onerror = () => {
                console.warn("Capa não carregou:", imagem.src);
                imagem.remove();
            };

            const titulo = document.createElement("h3");
            titulo.textContent = repo.name;

            const descricao = document.createElement("p");
            descricao.textContent = repo.description || "Sem descrição disponível.";

            card.appendChild(imagem);
            card.appendChild(titulo);
            card.appendChild(descricao);
            lista.appendChild(card);
        });
    } catch (erro) {
        lista.innerHTML = "<p>Não foi possível carregar os projetos agora.</p>";
        console.error(erro);
    }
}

carregarProjetos();

function configurarFormularioContato() {
    const modal = document.getElementById("modalContato");
    const formulario = document.getElementById("formularioContato");
    const status = document.getElementById("statusFormulario");

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        status.textContent = "Enviando...";

        try {
            const resposta = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(formulario),
            });
            const resultado = await resposta.json();

            if (resultado.success) {
                status.textContent = "Mensagem enviada com sucesso!";
                formulario.reset();
                setTimeout(() => modal.close(), 1500);
            } else {
                status.textContent = "Não foi possível enviar. Tenta de novo mais tarde.";
            }
        } catch (erro) {
            status.textContent = "Não foi possível enviar. Verifica sua conexão.";
            console.error(erro);
        }
    });
}

function configurarModalContato() {
    const modal = document.getElementById("modalContato");
    const abrir = document.getElementById("abrirModalContato");
    const fechar = document.getElementById("fecharModalContato");

    abrir.addEventListener("click", () => modal.showModal());
    fechar.addEventListener("click", () => modal.close());

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            modal.close();
        }
    });
}

configurarFormularioContato();
configurarModalContato();
