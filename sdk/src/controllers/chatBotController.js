export class ChatbotController {
  #chatbotView;
  #promptService;
  #abortController;

  constructor({ chatbotView, promptService }) {
    this.#chatbotView = chatbotView;
    this.#promptService = promptService;
  }

  async init({ firstBotMessage, text }) {
    this.#setupEvents();
    this.#chatbotView.renderWelcomeBubble();
    this.#chatbotView.setInputEnabled(true);
    this.#chatbotView.appendBotMessage(firstBotMessage, null, false);
    return this.#promptService.init(text);
  }

  #setupEvents() {
    this.#chatbotView.setupEventHandlers({
      onOpen: this.#onOpen.bind(this),
      onSend: this.#chatBotReply.bind(this),
      onStop: this.#handleStop.bind(this),
    });
  }

  #handleStop() {
    this.#abortController.abort();
  }

  async #chatBotReply(userMsg) {
    this.#chatbotView.showTypingIndicator();
    this.#chatbotView.setInputEnabled(false);

    try {
      this.#abortController = new AbortController();

      const contentnode = this.#chatbotView.createStreamingBotMessage();
      const response = this.#promptService.prompt(
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
      const stopGerenerating = () => {
        clearInterval(intervalId);
        updateText();
        this.#chatbotView.setInputEnabled(true);
      };

      this.#abortController.signal.addEventListener("abort", stopGerenerating);

      for await (const chunk of response) {
        if (!chunk) continue;
        fullResponse += chunk;
      }

      stopGerenerating();
    } catch (Error) {
      this.#chatbotView.hideTypingIndicator();
      if (Error.name === "AbortError")
        return console.log("Error aborted by user");

      this.#chatbotView.appendBotMessage("Erro ao processar sua solicitação. Tente novamente!");
      console.log("AI prompt error:", Error);
    }
  }

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

  #checkRequirements() {
    const errors = [];
    const iChrome = window.chrome;
    if (!iChrome) {
      errors.push(
        "⚠️ Este recurso só funciona no Google Chrome ou Chrome Canary (versão recente)."
      );
    }
    if (!(("LanguageModel" in window))) {
      errors.push("⚠️ As APIs nativas de IA não estão ativas.");
      errors.push("Ative a seguinte flag em chrome://flags/:");
      errors.push(
        "- Prompt API for Gemini Nano (chrome://flags/#prompt-api-for-gemini-nano)"
      );
      errors.push("Depois reinicie o Chrome e tente novamente.");
    }

    return errors;
  }
}