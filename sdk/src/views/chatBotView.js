import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

/**
 * Classe responsável pela interface visual do chatbot
 * 
 * Gerencia todos os aspectos visuais e de interação:
 * - Renderização de mensagens (usuário e bot)
 * - Controle de estados da interface (aberto/fechado, habilitado/desabilitado)
 * - Animações e indicadores visuais
 * - Aplicação de temas e personalização
 * - Processamento de Markdown nas respostas
 */
export class ChatbotView {
    /** @private {Object} Configurações do chatbot */
    #config;
    /** @private {HTMLElement} Container principal do widget */
    #container = document.querySelector("#ewcb-widget");
    /** @private {HTMLElement} Cabeçalho do chat */
    #header = document.querySelector(".ewcb-chat-header");
    /** @private {HTMLElement} Área de mensagens */
    #messages = document.querySelector("#ewcb-messages");
    /** @private {HTMLInputElement} Campo de entrada de texto */
    #input = document.querySelector("#ewcb-input");
    /** @private {HTMLFormElement} Formulário de envio */
    #form = document.querySelector("#ewcb-form");
    /** @private {HTMLButtonElement} Botão para abrir chat */
    #openBtn = document.querySelector("#ewcb-open-btn");
    /** @private {HTMLButtonElement} Botão para parar geração */
    #stopBtn = document.querySelector("#ewcb-stop");
    /** @private {HTMLButtonElement} Botão para fechar chat */
    #closeBtn = document.querySelector("#ewcb-close-btn");
    /** @private {HTMLElement} Janela do chat */
    #chatWin = document.querySelector("#ewcb-chat-window");
    /** @private {HTMLImageElement} Ícone flutuante */
    #floatingIcon = document.querySelector("#ewcb-icon");
    /** @private {HTMLElement} Badge do ícone flutuante */
    #floatingIconBadge = document.querySelector(".ewcb-btn-badge");
    /** @private {HTMLElement|null} Bolha de boas-vindas */
    #welcomeBubble = null;

    /**
     * Inicializa a interface com configurações personalizadas
     * 
     * @param {Object} config - Configurações de aparência e comportamento
     */
    constructor(config) {
        this.#config = config;
        this.#applyTheme();
        this.#setHeader();
        this.#setFloatingIcon();
        this.setTypingDotDuration();
    }

    /**
     * Configura event listeners para interações do usuário
     * 
     * @param {Object} handlers - Callbacks para eventos
     * @param {Function} handlers.onOpen - Executado quando chat é aberto
     * @param {Function} handlers.onSend - Executado quando mensagem é enviada
     * @param {Function} handlers.onStop - Executado quando geração é interrompida
     */
    setupEventHandlers({ onOpen, onSend, onStop }) {
        this.#openBtn.onclick = () => { this.openChat(); onOpen(); };
        this.#stopBtn.onclick = () => { onStop(); };
        this.#closeBtn.onclick = () => { this.closeChat(); };
        this.#form.onsubmit = (e) => {
            e.preventDefault();
            const val = this.#input.value.trim();
            if (!val) return;
            this.appendUserMessage(val);
            this.clearInput();
            onSend(val);
        };
    }

    /**
     * Controla o estado de habilitação dos controles de entrada
     * 
     * @param {boolean} enabled - Se os controles devem estar habilitados
     */
    setInputEnabled(enabled) {
        this.#input.disabled = !enabled;
        this.#form.querySelector("button[type=submit]").disabled = !enabled;
        this.#stopBtn.disabled = enabled;
    }

    /**
     * Abre a janela do chat
     */
    openChat() {
        this.#chatWin.style.display = "flex";
        this.#floatingIconBadge.style.display = "none";
        setTimeout(() => this.focusInput(), 180);
        this.hideWelcomeBubble();
    }
    
    /**
     * Fecha a janela do chat
     */
    closeChat() { 
        this.#chatWin.style.display = "none"; 
    }

    /**
     * Renderiza bolha de boas-vindas flutuante
     */
    renderWelcomeBubble() {
        this.#removeElement(this.#welcomeBubble);
        const bubble = document.createElement('div');
        bubble.className = 'ewcb-welcome-bubble';
        bubble.textContent = this.#config.welcomeBubble;
        bubble.onclick = () => {
            this.openChat();
        };
        document.body.appendChild(bubble);
        this.#welcomeBubble = bubble;
    }

    /**
     * Oculta a bolha de boas-vindas
     */
    hideWelcomeBubble() {
        if (this.#welcomeBubble) this.#welcomeBubble.style.display = 'none';
    }

    /**
     * Gera HTML para mensagem do bot
     * 
     * @private
     * @param {string} text - Texto da mensagem
     * @param {boolean} renderMarkdown - Se deve processar Markdown
     * @returns {string} HTML da mensagem
     */
    #renderBotMessageHTML(text, renderMarkdown = true) {
        return `
            <img src="${this.#config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
            <div class="ewcb-message-content">${renderMarkdown ? marked.parse(text) : text}</div>
        `;
    }

    /**
     * Adiciona mensagem do bot ao chat
     * 
     * @param {string} text - Texto da mensagem
     * @param {HTMLElement|null} element - Elemento existente (opcional)
     * @param {boolean} renderMarkdown - Se deve processar Markdown
     */
    appendBotMessage(text, element = null, renderMarkdown = true) {
        const el = element || this.#createBotMessage();
        el.innerHTML = this.#renderBotMessageHTML(text, renderMarkdown);
        this.#append(el);
    }

    /**
     * Cria elemento para mensagem do bot em streaming
     * 
     * @returns {HTMLElement} Elemento da mensagem
     */
    createStreamingBotMessage() {
        const element = this.#createBotMessage();
        this.#append(element);
        return element;
    }

    /**
     * Atualiza mensagem do bot durante streaming
     * 
     * @param {HTMLElement} element - Elemento da mensagem
     * @param {string} text - Novo texto
     * @param {boolean} renderMarkdown - Se deve processar Markdown
     */
    updateStreamingBotMessage(element, text, renderMarkdown = true) {
        element.innerHTML = this.#renderBotMessageHTML(text, renderMarkdown);
        this.#scrollToBottom();
    }

    /**
     * Rola o chat para a última mensagem
     * @private
     */
    #scrollToBottom() {
        this.#messages.scrollTop = this.#messages.scrollHeight;
    }

    /**
     * Adiciona mensagem do usuário ao chat
     * 
     * @param {string} text - Texto da mensagem
     */
    appendUserMessage(text) {
        const msg = this.#createUserMessage(text);
        this.#append(msg);
    }

    /**
     * Cria elemento HTML para mensagem do bot
     * 
     * @private
     * @returns {HTMLElement} Elemento da mensagem
     */
    #createBotMessage() {
        const msg = document.createElement('div');
        msg.className = 'ewcb-message ewcb-message-bot';
        return msg;
    }

    /**
     * Cria elemento HTML para mensagem do usuário
     * 
     * @private
     * @param {string} text - Texto da mensagem
     * @returns {HTMLElement} Elemento da mensagem
     */
    #createUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'ewcb-message ewcb-message-user';
        msg.innerHTML = `<div class="ewcb-message-content">${text}</div>`;
        return msg;
    }

    /**
     * Exibe indicador de digitação (três pontos animados)
     */
    showTypingIndicator() {
        this.hideTypingIndicator()

        const indicator = document.createElement('div');
        indicator.className = 'ewcb-typing-indicator';
        indicator.innerHTML = `
            <span class="ewcb-typing-dot"></span>
            <span class="ewcb-typing-dot"></span>
            <span class="ewcb-typing-dot"></span>
        `;
        this.#append(indicator);
    }

    /**
     * Oculta indicador de digitação
     */
    hideTypingIndicator() {
        this.#removeElement(this.#messages.querySelector('.ewcb-typing-indicator'));
    }

    /**
     * Limpa o campo de entrada de texto
     */
    clearInput() { this.#input.value = ''; }
    
    /**
     * Foca no campo de entrada de texto
     */
    focusInput() { this.#input.focus(); }

    /**
     * Configura duração da animação dos pontos de digitação
     */
    setTypingDotDuration() {
        const delayMs = Number(this.#config.typingDelay) || 800;
        const durationSec = Math.max(0.6, delayMs / 1000 * 0.66);
        this.#container.style.setProperty('--typingDotDuration', `${durationSec}s`);
    }

    /**
     * Adiciona elemento ao chat e rola para baixo
     * 
     * @private
     * @param {HTMLElement} msgNode - Elemento a ser adicionado
     */
    #append(msgNode) {
        this.#messages.appendChild(msgNode);
        this.#scrollToBottom();
    }

    /**
     * Remove elemento do DOM de forma segura
     * 
     * @private
     * @param {HTMLElement|null} el - Elemento a ser removido
     */
    #removeElement(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    /**
     * Aplica tema personalizado baseado nas configurações
     * 
     * @private
     */
    #applyTheme() {
        Object.entries(this.#config).forEach(([k, v]) => {
            if (
                typeof v === "string" &&
                (k.endsWith('Color') || k.endsWith('Bubble') || k.endsWith('Text') || k === "buttonColor")
            ) {
                this.#container.style.setProperty(`--${k}`, v);
            }
        });
    }
    
    /**
     * Configura cabeçalho do chat com ícone e nome
     * 
     * @private
     */
    #setHeader() {
        this.#header.querySelector("#ewcb-header-icon").src = this.#config.iconUrl;
        this.#header.querySelector("#ewcb-chatbot-name").textContent = this.#config.chatbotName;
    }
    
    /**
     * Configura ícone flutuante
     * 
     * @private
     */
    #setFloatingIcon() {
        this.#floatingIcon.src = this.#config.iconUrl;
    }
}