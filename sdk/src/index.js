/**
 * Ponto de entrada principal do chatbot
 * 
 * Este arquivo é responsável por:
 * - Carregar e injetar CSS e HTML do chatbot na página
 * - Inicializar todos os serviços necessários (IA, interface, controle)
 * - Configurar o sistema de prompts e mensagens iniciais
 * - Orquestrar a inicialização completa do chatbot
 */

import { ChatbotView } from './views/chatBotView.js';
import { HybridPromptService } from './services/hybridPromptService.js'
import { ChatbotController } from './controllers/chatBotController.js';

/**
 * Função auto-executada que inicializa o chatbot
 * 
 * Carrega recursos assíncronos em paralelo para otimizar performance:
 * - CSS para estilização
 * - HTML para estrutura da interface
 * - Prompt do sistema para configuração da IA
 * - Configurações gerais do chatbot
 */
(async () => {
    // Configura URLs base para recursos do projeto
    const root = new URL('../../', import.meta.url);
    const fromMainProject = (path) => new URL(path, root).toString();
    
    // Carrega todos os recursos necessários em paralelo
    const [css, html, systemPrompt, config] = await Promise.all([
        fetch('./sdk/ew-chatbot.css').then(r => r.text()),
        fetch('./sdk/ew-chatbot.html').then(r => r.text()),
        fetch('./botData/systemPrompt.txt').then(r => r.text()),
        fetch('./botData/chatbot-config.json').then(r => r.json()),
    ]);

    // Injeta CSS na página
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Injeta HTML do chatbot na página
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // Inicializa serviços e componentes do chatbot
    const promptService = new HybridPromptService();
    const chatbotView = new ChatbotView(config);
    const controller = new ChatbotController({ chatbotView, promptService });
    
    // Inicializa o chatbot com configurações e mensagem inicial
    controller.init({
        firstBotMessage: config.firstBotMessage,
        text: systemPrompt,
    });
})();