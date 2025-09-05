import { PromptService } from './promptService.js';
import { GroqService } from './groqService.js';

/**
 * Serviço híbrido de IA que gerencia múltiplos provedores
 * 
 * Implementa estratégia de fallback entre diferentes serviços de IA:
 * 1. Groq API (principal) - Funciona em produção via proxy
 * 2. Chrome AI (fallback) - Funciona apenas em Chrome com flags experimentais
 * 
 * Garante que o chatbot funcione mesmo se um serviço falhar.
 */
export class HybridPromptService {
  /** @private {PromptService} Serviço Chrome AI nativo */
  chromeService;
  /** @private {GroqService} Serviço Groq API */
  groqService;
  /** @private {PromptService|GroqService|null} Serviço ativo atual */
  activeService;

  /**
   * Inicializa ambos os serviços de IA
   */
  constructor() {
    this.chromeService = new PromptService();
    this.groqService = new GroqService();
    this.activeService = null;
  }

  /**
   * Inicializa serviços de IA com estratégia de fallback
   * 
   * Tenta inicializar na ordem de preferência:
   * 1. Groq API (mais confiável, funciona sempre)
   * 2. Chrome AI (fallback, requer flags experimentais)
   * 
   * @param {string} systemPrompt - Prompt do sistema para configurar a IA
   * @returns {Promise<boolean>} Sucesso da inicialização
   */
  async init(systemPrompt) {
    // Tenta usar Groq primeiro (serviço principal)
    try {
      await this.groqService.init(systemPrompt);
      this.activeService = this.groqService;
      console.log('✅ Usando Groq API (confiável)');
      return true;
    } catch (error) {
      console.warn('Groq falhou, tentando Chrome AI:', error);
    }

    // Fallback para Chrome AI (se disponível no navegador)
    if (window.LanguageModel) {
      try {
        await this.chromeService.init(systemPrompt);
        this.activeService = this.chromeService;
        console.log('✅ Usando Chrome AI (fallback)');
        return true;
      } catch (error) {
        console.error('Chrome AI também falhou:', error);
      }
    }

    console.error('Todos os serviços falharam');
    return false;
  }

  /**
   * Envia prompt para o serviço de IA ativo
   * 
   * @param {string} text - Texto do usuário para processar
   * @param {AbortSignal} signal - Sinal para cancelar a requisição
   * @returns {Promise<AsyncIterable<string>>} Stream de resposta da IA
   * @throws {Error} Se nenhum serviço estiver disponível
   */
  async prompt(text, signal) {
    if (!this.activeService) {
      throw new Error('Nenhum serviço de IA disponível');
    }

    return this.activeService.prompt(text, signal);
  }
}