/**
 * Controlador principal do chatbot
 *
 * Responsável por orquestrar a comunicação entre a interface do usuário
 * e os serviços de IA, gerenciando o fluxo de conversação e estados da aplicação.
 */
export class ChatbotController {
  /** @private {ChatbotView} Interface visual do chatbot */
  #chatbotView;
  /** @private {HybridPromptService} Serviço de IA híbrido */
  #promptService;
  /** @private {AbortController} Controlador para cancelar requisições */
  #abortController;
  /** @private {boolean} Impede envios concorrentes durante geração */
  #isGenerating = false;

  /**
   * Inicializa o controlador com dependências necessárias
   *
   * @param {Object} dependencies - Dependências do controlador
   * @param {ChatbotView} dependencies.chatbotView - Interface do chatbot
   * @param {HybridPromptService} dependencies.promptService - Serviço de IA
   */
  constructor({ chatbotView, promptService }) {
    this.#chatbotView = chatbotView;
    this.#promptService = promptService;
  }

  /**
   * Inicializa o chatbot com configurações iniciais
   *
   * @param {Object} config - Configurações de inicialização
   * @param {string} config.firstBotMessage - Primeira mensagem do bot
   * @param {string} config.text - Prompt do sistema para a IA
   * @returns {Promise<boolean>} Sucesso da inicialização
   */
  async init({ firstBotMessage, text }) {
    this.#setupEvents();
    this.#chatbotView.renderWelcomeBubble();
    this.#chatbotView.setInputEnabled(true);
    this.#chatbotView.appendBotMessage(firstBotMessage, null, false);
    return this.#promptService.init(text);
  }

  /**
   * Configura event listeners para interações do usuário
   * @private
   */
  #setupEvents() {
    this.#chatbotView.setupEventHandlers({
      onOpen: this.#onOpen.bind(this),
      onSend: this.#chatBotReply.bind(this),
      onStop: this.#handleStop.bind(this),
    });
  }

  /**
   * Interrompe a geração de resposta atual
   * @private
   */
  #handleStop() {
    this.#abortController.abort();
  }

  /**
   * Processa mensagem do usuário e gera resposta da IA
   *
   * Gerencia todo o fluxo de conversação:
   * - Exibe indicador de digitação
   * - Desabilita entrada do usuário
   * - Processa resposta via IA
   * - Exibe resposta em streaming
   * - Trata erros e timeouts
   *
   * @private
   * @param {string} userMsg - Mensagem enviada pelo usuário
   */
  async #chatBotReply(userMsg) {
    if (this.#isGenerating) return;
    this.#isGenerating = true;

    this.#chatbotView.showTypingIndicator();
    this.#chatbotView.setInputEnabled(false);

    const done = () => {
      this.#isGenerating = false;
      this.#chatbotView.setInputEnabled(true);
    };

    try {
      this.#abortController = new AbortController();

      const contentnode = this.#chatbotView.createStreamingBotMessage();
      const response = await this.#promptService.prompt(
        userMsg,
        this.#abortController.signal
      );

      let fullResponse = "";
      let lastMessage = "noop";

      const updateText = () => {
        if (!fullResponse) return;
        if (fullResponse === lastMessage) return;

        lastMessage = fullResponse;
        this.#chatbotView.hideTypingIndicator();
        this.#chatbotView.updateStreamingBotMessage(contentnode, fullResponse);
      };

      const intervalId = setInterval(updateText, 200);

      const finish = () => {
        clearInterval(intervalId);
        updateText();
        done();
      };

      this.#abortController.signal.addEventListener("abort", finish);

      for await (const chunk of response) {
        if (this.#abortController.signal.aborted) break;
        if (!chunk) continue;
        fullResponse += chunk;
      }

      finish();
    } catch (error) {
      this.#chatbotView.hideTypingIndicator();
      done();
      if (error.name === "AbortError") return;

      this.#chatbotView.appendBotMessage(
        "Erro ao processar sua solicitação. Tente novamente!"
      );
      console.log("AI prompt error:", error);
    }
  }

  /**
   * Executa verificações quando o chat é aberto
   * @private
   */
  async #onOpen() {
    const errors = this.#checkRequirements();
    if (errors.length) {
      const messages = errors.join("\n\n");
      this.#chatbotView.appendBotMessage(messages);
      this.#chatbotView.setInputEnabled(false);
      return;
    }
    this.#chatbotView.setInputEnabled(true);
  }

  /**
   * Verifica requisitos do sistema para funcionamento do chatbot
   *
   * @private
   * @returns {string[]} Lista de erros encontrados (vazia se tudo OK)
   */
  #checkRequirements() {
    // Funciona em qualquer navegador com fallback
    return [];
  }
}
