/**
 * Serviço para integração com Chrome AI nativo (experimental)
 * 
 * Utiliza a API experimental LanguageModel do Chrome para processamento
 * de linguagem natural local. Requer flags experimentais habilitadas:
 * - chrome://flags/#optimization-guide-on-device-model
 * - chrome://flags/#prompt-api-for-gemini-nano
 */
export class PromptService {
  /** @private {Object|null} Sessão ativa do Chrome AI */
  #session = null;
  /** @private {string|null} Prompts iniciais salvos */
  #initialPrompts = null;
  
  /**
   * Inicializa sessão do Chrome AI com prompts do sistema
   * 
   * @param {string} initialPrompts - Prompt do sistema para configurar comportamento
   * @returns {Promise<Object|null>} Sessão criada ou null se falhar
   */
  async init(initialPrompts) {
    // Verifica se Chrome AI está disponível
    if (!window.LanguageModel) return;
    
    this.#initialPrompts = initialPrompts;

    try {
      // Cria sessão com prompt do sistema
      this.#session = await LanguageModel.create({
        initialPrompts: [{
          role: "system",
          content: initialPrompts
        }]
      });
      return this.#session;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      return null;
    }
  }

  /**
   * Envia prompt para o Chrome AI
   * 
   * @param {string} text - Mensagem do usuário
   * @param {AbortSignal} signal - Sinal para cancelar requisição
   * @returns {Promise<AsyncIterable<string>>} Resposta da IA
   * @throws {Error} Se a sessão não estiver disponível
   */
  async prompt(text, signal) {
    // Tenta recriar sessão se necessário
    if (!this.#session && this.#initialPrompts) {
      await this.init(this.#initialPrompts);
    }
    
    if (!this.#session) {
      throw new Error('Sessão de IA não disponível');
    }

    // Envia prompt e retorna resposta
    const response = await this.#session.prompt(text, { signal });
    return this.#createAsyncIterator(response);
  }

  /**
   * Converte resposta em iterador assíncrono
   * 
   * @private
   * @param {string} text - Resposta completa
   * @yields {string} Texto completo (Chrome AI não suporta streaming)
   */
  async *#createAsyncIterator(text) {
    yield text;
  }
}