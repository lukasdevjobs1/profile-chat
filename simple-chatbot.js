// Versão simplificada do chatbot para teste
console.log('🚀 Carregando chatbot simplificado...');

(async () => {
    try {
        // 1. Carrega recursos básicos
        console.log('📦 Carregando recursos...');
        const [css, html, config] = await Promise.all([
            fetch('./sdk/ew-chatbot.css').then(r => r.text()),
            fetch('./sdk/ew-chatbot.html').then(r => r.text()),
            fetch('./botData/chatbot-config.json').then(r => r.json())
        ]);

        // 2. Injeta CSS
        console.log('🎨 Aplicando estilos...');
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // 3. Injeta HTML
        console.log('🏗️ Criando interface...');
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // 4. Configura ícones
        console.log('🖼️ Configurando ícones...');
        const floatingIcon = document.querySelector('#ewcb-icon');
        const headerIcon = document.querySelector('#ewcb-header-icon');
        const chatbotName = document.querySelector('#ewcb-chatbot-name');
        
        if (floatingIcon) floatingIcon.src = config.iconUrl;
        if (headerIcon) headerIcon.src = config.iconUrl;
        if (chatbotName) chatbotName.textContent = config.chatbotName;

        // 5. Aplica tema
        console.log('🎨 Aplicando tema...');
        const widget = document.querySelector('#ewcb-widget');
        if (widget) {
            Object.entries(config).forEach(([key, value]) => {
                if (typeof value === 'string' && 
                    (key.endsWith('Color') || key.endsWith('Bubble') || key.endsWith('Text'))) {
                    widget.style.setProperty(`--${key}`, value);
                }
            });
        }

        // 6. Configura eventos básicos
        console.log('⚡ Configurando eventos...');
        const openBtn = document.querySelector('#ewcb-open-btn');
        const closeBtn = document.querySelector('#ewcb-close-btn');
        const chatWindow = document.querySelector('#ewcb-chat-window');
        const messagesDiv = document.querySelector('#ewcb-messages');
        const input = document.querySelector('#ewcb-input');
        const form = document.querySelector('#ewcb-form');

        // Função para abrir chat
        if (openBtn && chatWindow) {
            openBtn.onclick = () => {
                console.log('💬 Abrindo chat...');
                chatWindow.style.display = 'flex';
                
                // Adiciona mensagem de boas-vindas se não existir
                if (messagesDiv && messagesDiv.children.length === 0) {
                    const welcomeMsg = document.createElement('div');
                    welcomeMsg.className = 'ewcb-message ewcb-message-bot';
                    welcomeMsg.innerHTML = `
                        <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
                        <div class="ewcb-message-content">${config.firstBotMessage}</div>
                    `;
                    messagesDiv.appendChild(welcomeMsg);
                }
                
                if (input) input.focus();
            };
        }

        // Função para fechar chat
        if (closeBtn && chatWindow) {
            closeBtn.onclick = () => {
                console.log('❌ Fechando chat...');
                chatWindow.style.display = 'none';
            };
        }

        // Função para enviar mensagem (versão básica)
        if (form && input && messagesDiv) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const message = input.value.trim();
                if (!message) return;

                console.log('📤 Enviando mensagem:', message);

                // Adiciona mensagem do usuário
                const userMsg = document.createElement('div');
                userMsg.className = 'ewcb-message ewcb-message-user';
                userMsg.innerHTML = `<div class="ewcb-message-content">${message}</div>`;
                messagesDiv.appendChild(userMsg);

                // Limpa input
                input.value = '';

                // Chama API real
                sendToAPI(message, messagesDiv, config);

                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            };
        }

        // 7. Mostra bolha de boas-vindas
        console.log('👋 Criando bolha de boas-vindas...');
        const welcomeBubble = document.createElement('div');
        welcomeBubble.className = 'ewcb-welcome-bubble';
        welcomeBubble.textContent = config.welcomeBubble;
        welcomeBubble.onclick = () => {
            if (openBtn) openBtn.click();
            welcomeBubble.style.display = 'none';
        };
        document.body.appendChild(welcomeBubble);

        console.log('✅ Chatbot com API REAL carregado com sucesso!');
        console.log('🎉 Agora o chatbot usa IA de verdade!');
        console.log('🔥 Versão atualizada - Cache limpo!');

    } catch (error) {
        console.error('❌ Erro ao carregar chatbot:', error);
    }
})();

// Função para enviar mensagem para API
async function sendToAPI(message, messagesDiv, config) {
    // Adiciona indicador de digitação
    const typingMsg = document.createElement('div');
    typingMsg.className = 'ewcb-message ewcb-message-bot';
    typingMsg.innerHTML = `
        <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
        <div class="ewcb-message-content">Digitando...</div>
    `;
    messagesDiv.appendChild(typingMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch('https://profile-chat.vercel.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'Você é o assistente do Lukas Gomes, desenvolvedor de Fortaleza-CE. Responda de forma amigável sobre seus projetos e tecnologias.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 200
            })
        });

        // Remove indicador de digitação
        messagesDiv.removeChild(typingMsg);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;

        // Cria mensagem vazia para efeito de digitação
        const botMsg = document.createElement('div');
        botMsg.className = 'ewcb-message ewcb-message-bot';
        botMsg.innerHTML = `
            <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
            <div class="ewcb-message-content"></div>
        `;
        messagesDiv.appendChild(botMsg);
        
        // Inicia efeito de digitação
        await typeWriterEffect(botMsg.querySelector('.ewcb-message-content'), botResponse, messagesDiv);

    } catch (error) {
        console.error('=== ERRO DETALHADO DA API ===');
        console.error('Erro:', error);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        // Remove indicador de digitação
        if (messagesDiv.contains(typingMsg)) {
            messagesDiv.removeChild(typingMsg);
        }

        // Adiciona mensagem de erro
        const errorMsg = document.createElement('div');
        errorMsg.className = 'ewcb-message ewcb-message-bot';
        errorMsg.innerHTML = `
            <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
            <div class="ewcb-message-content">Desculpe, houve um erro. Verifique se a API está configurada no Vercel.</div>
        `;
        messagesDiv.appendChild(errorMsg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Função para efeito de digitação suave
async function typeWriterEffect(element, text, messagesDiv) {
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        
        // Auto-scroll suave durante a digitação
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Delay entre caracteres (30-80ms)
        const delay = text[i] === ' ' ? 50 : (30 + Math.random() * 50);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Scroll final
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}