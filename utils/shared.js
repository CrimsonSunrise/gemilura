/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { marked } from "https://esm.run/marked";

export let api_key = "";
export function changeApiKey(string) {
    api_key = string;
}

/**
 * Returns a model instance.
 *
 * @param {GoogleGenerativeAI.ModelParams} params
 * @returns {GoogleGenerativeAI.GenerativeModel}
 */
export async function getGenerativeModel(params) {
    // Fetch API key from server
    // If you need a new API key, get it from https://makersuite.google.com/app/apikey
    // const API_KEY = await (await fetch("API_KEY")).text();

    // AIzaSyBavL5m9krqVylVmcdur_LBItTQ885Yo_4
    const genAI = new GoogleGenerativeAI(api_key);

    return genAI.getGenerativeModel(params);
}

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 *
 * @param {Blob} file
 * @returns {GoogleGenerativeAI.Part}
 */
export async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

/**
 * Scrolls the document all the way to the bottom.
 */
export function scrollToDocumentBottom() {
    const scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

/**
 * Updates the `resultEl` with parsed markdown text returned by a `getResult()` call.
 *
 * @param {HTMLElement}} resultEl
 * @param {() => Promise<GoogleGenerativeAI.GenerateContentResponse>} getResult
 * @param {boolean} streaming
 */

function atualizarIframe(conteudo) {
    // Obtém o elemento iframe pelo ID
    var iframe = document.getElementById("meuIframe");

    // Define o novo conteúdo HTML para o iframe
    var novoConteudo = conteudo;

    // Verifica se o iframe já possui um documento
    if (iframe.contentDocument) {
        // Se sim, atualiza o innerHTML do documento do iframe
        iframe.contentDocument.body.innerHTML = novoConteudo;
    } else if (iframe.contentWindow) {
        // Se não, tenta acessar pelo contentWindow (pode variar entre navegadores)
        iframe.contentWindow.document.body.innerHTML = novoConteudo;
    }
}

const loadingMessages = ["Hmm...", "Interessante, deixa eu tentar...", "Ótima ideia! Deixa eu ver...", "Parece possível...", "Que ideia incrível. Vou fazer agora mesmo...", "Consultarei os magos...", "Hmm, pra essa vou precisar da minha bola de cristal..."]

const previewLoadingMessages = [
    "Pintando a tela do seu novo site, um pixel de cada vez...",
    "Colocando os blocos certos para construir o seu universo online...",
    "Misturando cores e fontes para criar a identidade perfeita do seu site...",
    "Esboçando a estrutura do seu site, do rascunho à obra de arte final...",
    "Escolhendo as melhores ferramentas para dar vida ao seu projeto...",
    "Costurando o seu site sob medida, do seu jeito...",
    "Moldando o seu site como uma escultura única...",
    "Desenhando um mapa para te levar à melhor experiência online...",
    "Criando um espaço online que te representa...",
    "Transformando suas ideias em realidade digital...",
    "Os algoritmos estão trabalhando duro para te surpreender...",
    "Os elfos da programação estão construindo sua página, um duende de cada vez...",
    "Nossos robôs designers estão tendo um dia criativo...",
    "Estamos negociando com os bits e bytes para te dar o melhor site...",
    "Criando seu mundo online...",
    "Colocando os últimos detalhes...",
    "Seu site está a caminho...",
    "Aguarde um pouquinho...",
    "Quase lá..."
];

const finalMessages = [
    "E ai, como ficou?",
    "Achei que ficou legal, e você?",
    "O que acha?",
    "Gostou das cores?",
    "Ficou interessante, não?",
]

export async function updateUI(resultEl, getResult, streaming) {
    let text = "";
    try {
        const result = await getResult();

        if (streaming) {
            resultEl.className = "loading";
            resultEl.innerText = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
            document.querySelector("#loading-message").innerText = previewLoadingMessages[Math.floor(Math.random() * previewLoadingMessages.length)];
            for await (const chunk of result.stream) {
                // Get first candidate's current text chunk
                const chunkText = chunk.text();
                text += chunkText;
                // resultEl.innerHTML = marked.parse(text);
                // scrollToDocumentBottom();
                // if (text.indexOf("```html") == -1 || text.indexOf("html") == -1 || text.indexOf("<") == -1) {
                //     resultEl.innerHTML = marked.parse(text);
                // }

                const chatHistory = document.querySelector('.chat');
                chatHistory.scroll = chatHistory.scrollHeight;
            }
        } else {
            const response = await result.response;
            text = response.text();
        }

        resultEl.className = ""; // Remove .loading class
    } catch (err) {
        text += "\n\n> " + err;
        resultEl.className = "error";
    } finally {
        const chatHistory = document.getElementById('chat-history');
        chatHistory.scrollTop = chatHistory.scrollHeight;
        if (text.indexOf("html") > -1) {
            atualizarIframe(text.replace("```html", "").replace("```", ""));
            // document.querySelector("#code-preview-text").innerText = text.replace("```html", "").replace("```", "");
            document.querySelector("#code-preview-text").innerText = text.replace("```html", "").replace("```", "");
            // document.querySelector("#code-preview-text").innerText = text;
            // setTimeout(hljs.highlightAll(), 1000)
            // Prism.highlightAll();
            resultEl.innerHTML += `<br/>${finalMessages[Math.floor(Math.random() * finalMessages.length)]}`;
        } else {
            resultEl.innerHTML = marked.parse(text);
        }
        // document.querySelector("#prompt-input").focus();
        stopLoadingResposta()
    }
}

export const promptInicial = "Você é um assistente avançado de geranção de códigos html com css e javascript dentro do html. Você utiliza o máximo da sua criatividade para criar páginas, banners, fliers, sliders, e outros contrúdos incríveis. Você conhece muito bem os conceitos css como flex, grid, margens, cores, display, etc. Você também é mestre em utilizar svgs dentro do código html e também animações com svg e css. A partir de agora todas as suas respostas serão somente o código da página html com o conteúdo solicitado por mim. Caso eu peça para atualizar uma página que você enviou anteriormente, você vai fazer as alterações e irá enviar somente o código da página html sem explicações ou comentários extras, somente o código. Sempre priorize objetos que já estejam prontos ao invés de tentar criá-los usando elementos html e css. Atente-se ao que é pedido e entregue o mais próximo possível. Não inclua nenhum link para css de ícones externos como font-awesome e outros. Sempre que solicitado utilizar placeholders para imagens, você pode utilizar a seguinte url para imagens: https://placehold.co/600x400 e colocar o tamanho desejado. Também pode criar gradientes utilizando a url: https://placehold.co/600x400/orange/white ou texto com a url: https://placehold.co/600x400?text=Hello+World. Mesmo se eu pedir para explicar o código que você enviou, você irá ignorar e enviar somente o código html,css e javascript. Sempre prefira ser criativo com os textos solicitados, nunca utilize lorem ipsum, somente quando for solicitado. Você sempre irá priorizar SEO, somente fará diferente quando for solicitado. Todas as âncoras precisam ter o href modificado para não recarregar a página, somente quando for solicitado terá o href normal. Quando fizer footers atente-se para que não fique em cima do conteúdo da página e também para que não passem da largura da página. Nunca utilize width 100% no footer. Atente-se para os scrolls verticais do body ou do html. Sempre prefira criar págionas e estilos responsivos. Nunca utilize sticky ou fixed no footer, somente quando for mandado. . Todas as páginas que você criar precisam ser bem estruturadas e estilizadas. Às vezes quando você cria um footer ele vem maior do que a largura da página, atente-se à isso. Quando nenhum pedido for feito você retornará uma página html com uma mensagem engraçada e/ou irônica no body.";