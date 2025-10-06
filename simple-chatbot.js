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

                // Adiciona resposta automática simples
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'ewcb-message ewcb-message-bot';
                    botMsg.innerHTML = `
                        <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
                        <div class="ewcb-message-content">Obrigado pela mensagem! Este é um teste básico do chatbot. Em breve estarei totalmente funcional com IA! 🤖</div>
                    `;
                    messagesDiv.appendChild(botMsg);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 1000);

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

        console.log('✅ Chatbot simplificado carregado com sucesso!');
        console.log('🎉 Você deve ver o botão do chat no canto inferior direito!');

    } catch (error) {
        console.error('❌ Erro ao carregar chatbot:', error);
    }
})();