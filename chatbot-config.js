// Configuração do chatbot via proxy Vercel
window.CHATBOT_CONFIG = {
    apiUrl: 'https://lukasdevjobs1.vercel.app/api/chat',
    proxyUrl: 'https://lukasdevjobs1.vercel.app/chatbot.js',
    theme: {
        primaryColor: '#0969da',
        backgroundColor: '#0d1117',
        headerColor: '#161b22',
        userBubble: '#21262d',
        botBubble: '#0d1117',
        userText: '#f0f6fc',
        botText: '#f0f6fc'
    },
    chatbot: {
        name: 'LukG AI Assistant',
        avatar: 'https://lukasdevjobs1.github.io/profile-chat/botData/logo2.webp',
        welcomeMessage: '👋 Olá! Sou o assistente do LukG',
        firstMessage: 'Sou o assistente pessoal do LukG. Posso te ajudar com informações sobre projetos, tecnologias e experiências dele. O que você gostaria de saber?'
    }
};