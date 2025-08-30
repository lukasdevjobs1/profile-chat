import { ChatbotView } from './views/chatBotView.js';
import { PromptService } from './services/promptService.js'
import { ChatbotController } from './controllers/chatBotController.js';

(async () => {
    const root = new URL('../../', import.meta.url);
    const fromMainProject = (path) => new URL(path, root).toString();
    
    const [css, html, systemPrompt, config] = await Promise.all([
        fetch(fromMainProject('./sdk/ew-chatbot.css')).then(r => r.text()),
        fetch(fromMainProject('./sdk/ew-chatbot.html')).then(r => r.text()),
        fetch('./botData/systemPrompt.txt').then(r => r.text()),
        fetch('./botData/chatbot-config.json').then(r => r.json()),
    ]);

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const promptService = new PromptService();
    const chatbotView = new ChatbotView(config);
    const controller = new ChatbotController({ chatbotView, promptService });
    
    controller.init({
        firstBotMessage: config.firstBotMessage,
        text: systemPrompt,
    });
})();