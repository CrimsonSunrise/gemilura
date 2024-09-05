let chatModeActive = false;
document.querySelector("header").classList.remove("chatmode");
document.querySelector("main").classList.remove("chatmode");
document
    .querySelector(".api-key-wrapper")
    .classList.remove("active");

function toggleChatMode() {
    if (!chatModeActive) {
        // Ativar chat mode
        document.querySelector("header").classList.add("chatmode");
        document.querySelector("main").classList.add("chatmode");
        document
            .querySelector(".api-key-wrapper")
            .classList.remove("active");
        document.querySelector("#prompt-input").focus();
        chatModeActive = true;
    }
}

function toggleApiKeyInput() {
    document
        .querySelector(".api-key-wrapper")
        .classList.toggle("active");
    document
        .querySelector(".alterar-api-key-button")
        .classList.toggle("active");
}

function startLoadingResposta() {
    document.querySelector("#prompt-input").disabled = true;
    document.querySelector("#prompt-input").value = "";
    document.querySelector("#imagine-button").disabled = true;
    document.querySelector(
        ".alterar-api-key-button"
    ).disabled = true;

    document.querySelector("#iframe-mask").classList.add("active");
}

function stopLoadingResposta() {
    document.querySelector("#prompt-input").disabled = false;
    document.querySelector("#imagine-button").disabled = false;
    document.querySelector(
        ".alterar-api-key-button"
    ).disabled = false;

    document
        .querySelector("#iframe-mask")
        .classList.remove("active");

    document.querySelector("#prompt-input").focus();
}

function promptSugestao(el) {
    const prompt = el.textContent
        .trim()
        .replace(/\t/g, "")
        .replace(/\n/g, " ");
    document.querySelector("#prompt-input").value = prompt;

    // Encontrar o formulário
    const form = document.querySelector("#form");

    // Criar um evento de submit e dispará-lo
    const submitEvent = new Event("submit");
    form.dispatchEvent(submitEvent);

    // Prevenir o envio padrão dentro do evento
    submitEvent.preventDefault();
}

function mostrarCodigo(bool) {
    if (bool) {
        // Mostrar código
        document.querySelector(".code-view").style.display =
            "block";
        document
            .querySelector(".menu-item.visualizacao")
            .classList.remove("active");
        document
            .querySelector(".menu-item.codigo")
            .classList.add("active");
    } else {
        // Esconder código
        document.querySelector(".code-view").style.display = "none";
        document
            .querySelector(".menu-item.visualizacao")
            .classList.add("active");
        document
            .querySelector(".menu-item.codigo")
            .classList.remove("active");
    }
}

function copiarCodigo() {
    // document.querySelector(".copy-code").classList.remove("active");
    navigator.clipboard.writeText(
        document.querySelector("#code-preview-text").innerText
    );
    document.querySelector(".copy-code").classList.add("active");
}