// Versão simplificada do chatbot para teste
console.log("🚀 Carregando chatbot simplificado...");

(async () => {
  try {
    // 1. Carrega recursos básicos
    console.log("📦 Carregando recursos...");
    const [css, html, config] = await Promise.all([
      fetch("./sdk/ew-chatbot.css").then((r) => r.text()),
      fetch("./sdk/ew-chatbot.html").then((r) => r.text()),
      fetch("./botData/chatbot-config.json").then((r) => r.json()),
    ]);

    // 2. Injeta CSS
    console.log("🎨 Aplicando estilos...");
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // 3. Injeta HTML
    console.log("🏗️ Criando interface...");
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // 4. Configura ícones
    console.log("🖼️ Configurando ícones...");
    const floatingIcon = document.querySelector("#ewcb-icon");
    const headerIcon = document.querySelector("#ewcb-header-icon");
    const chatbotName = document.querySelector("#ewcb-chatbot-name");

    if (floatingIcon) floatingIcon.src = config.iconUrl;
    if (headerIcon) headerIcon.src = config.iconUrl;
    if (chatbotName) chatbotName.textContent = config.chatbotName;

    // 5. Aplica tema
    console.log("🎨 Aplicando tema...");
    const widget = document.querySelector("#ewcb-widget");
    if (widget) {
      Object.entries(config).forEach(([key, value]) => {
        if (
          typeof value === "string" &&
          (key.endsWith("Color") ||
            key.endsWith("Bubble") ||
            key.endsWith("Text"))
        ) {
          widget.style.setProperty(`--${key}`, value);
        }
      });
    }

    // 6. Configura eventos básicos
    console.log("⚡ Configurando eventos...");
    const openBtn = document.querySelector("#ewcb-open-btn");
    const closeBtn = document.querySelector("#ewcb-close-btn");
    const chatWindow = document.querySelector("#ewcb-chat-window");
    const messagesDiv = document.querySelector("#ewcb-messages");
    const input = document.querySelector("#ewcb-input");
    const form = document.querySelector("#ewcb-form");

    // Função para abrir chat
    if (openBtn && chatWindow) {
      openBtn.onclick = () => {
        console.log("💬 Abrindo chat...");
        chatWindow.style.display = "flex";

        // Adiciona mensagem de boas-vindas se não existir
        if (messagesDiv && messagesDiv.children.length === 0) {
          const welcomeMsg = document.createElement("div");
          welcomeMsg.className = "ewcb-message ewcb-message-bot";
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
        console.log("❌ Fechando chat...");
        chatWindow.style.display = "none";
      };
    }

    // Função para enviar mensagem (versão básica)
    if (form && input && messagesDiv) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        console.log("📤 Enviando mensagem:", message);

        // Adiciona mensagem do usuário
        const userMsg = document.createElement("div");
        userMsg.className = "ewcb-message ewcb-message-user";
        userMsg.innerHTML = `<div class="ewcb-message-content">${message}</div>`;
        messagesDiv.appendChild(userMsg);

        // Limpa input
        input.value = "";

        // Chama API real
        sendToAPI(message, messagesDiv, config);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      };
    }

    // 7. Mostra bolha de boas-vindas
    console.log("👋 Criando bolha de boas-vindas...");
    const welcomeBubble = document.createElement("div");
    welcomeBubble.className = "ewcb-welcome-bubble";
    welcomeBubble.textContent = config.welcomeBubble;
    welcomeBubble.onclick = () => {
      if (openBtn) openBtn.click();
      welcomeBubble.style.display = "none";
    };
    document.body.appendChild(welcomeBubble);

    console.log("✅ Chatbot com API REAL carregado com sucesso!");
    console.log("🎉 Agora o chatbot usa IA de verdade!");
    console.log("🔥 Versão atualizada - Cache limpo!");
  } catch (error) {
    console.error("❌ Erro ao carregar chatbot:", error);
  }
})();

// Variável global para controlar cancelamento
let currentAbortController = null;

// Função para enviar mensagem para API
async function sendToAPI(message, messagesDiv, config) {
  // Cancela requisição anterior se existir
  if (currentAbortController) {
    currentAbortController.abort();
  }
  
  // Cria novo controlador de cancelamento
  currentAbortController = new AbortController();
  // Adiciona indicador de digitação
  const typingMsg = document.createElement("div");
  typingMsg.className = "ewcb-message ewcb-message-bot";
  typingMsg.innerHTML = `
        <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
        <div class="ewcb-message-content">Digitando...</div>
    `;
  messagesDiv.appendChild(typingMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch("https://profile-chat.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `Você é o assistente pessoal do Lukas Albertino Gomes (lukasdevjobs1), desenvolvedor Full Stack em constante evolução.

## Sobre o Lukas:
- Natural de Fortaleza-CE, cursando Análise e Desenvolvimento de Sistemas na UniSantaCruz
- Atualmente no curso PYIA | Python IA da Infinity School (50% concluído)
- Desenvolvedor apaixonado por tecnologia, sempre buscando as melhores práticas
- GitHub: https://github.com/lukasdevjobs1
- Contatos: LinkedIn, Gmail (luk.devjobs@gmail.com), WhatsApp, Twitter/X

## PORTFÓLIO COMPLETO (15 repositórios):

### PROJETOS ORIGINAIS (6):
1. **BarberShop** (TypeScript) - 1 star ⭐
   - Projeto de barbearia
   - Criado: 2025
2. **bia** (JavaScript) - 1 star ⭐
   - Projeto JavaScript
   - Criado: 2025
3. **Exercicios_praticos_InfinitySchool** (Python) - 2 stars ⭐ 1 fork 🍴
   - Todos os exercícios feitos durante jornada de aprendizado
   - Criado: 2025
4. **Git_Projects** (Python) - 1 star ⭐
   - Para mostrar habilidades
   - Criado: 2025
5. **lukasdevjobs1** (Profile) - 1 star ⭐
   - Repositório de perfil
   - Criado: 2025
6. **profile-chat** (JavaScript) - 3 stars ⭐
   - ChatBot AI (este projeto)
   - Criado: 2025

### PROJETOS ESTUDADOS (9 Forks):
- **Agents-Prompts** - Prompts para IA
- **agno** - Framework para sistemas multi-agente
- **BibliotecaDev** - Biblioteca de livros de programação
- **DataBase_Project** (Python) - Projeto de banco de dados em equipe
- **Desafios_Infinity_School** (Python) - Desafios de lógica com Python
- **developer-roadmap** - Roadmaps interativos para desenvolvedores
- **grokking_algorithms** - Código do livro Grokking Algorithms
- **mcp** - AWS MCP Servers
- **semana-javascript-expert09** - Chatbot 100% offline

## STACK TECNOLÓGICO:
- **Linguagens**: TypeScript, JavaScript, Python
- **Frontend**: HTML5, CSS3, JavaScript, TypeScript
- **Backend**: Python
- **AI/Chatbots**: Desenvolvimento de Chatbots, Integração com IA
- **Cloud**: AWS, GitHub Pages, Vercel
- **Tools**: Git/GitHub, Cursor IDE

## ESTATÍSTICAS ATUALIZADAS:
- Total de repositórios: 15
- Projetos originais: 6
- Projetos estudados (forks): 9
- Total de stars: 9
- Linguagens diferentes: 3 (TypeScript, JavaScript, Python)

## INSTRUÇÕES IMPORTANTES:
- Responda APENAS sobre informações fornecidas acima
- NÃO invente detalhes sobre projetos não listados
- NÃO mencione tecnologias que não estão no stack tecnológico
- Mantenha foco nos 15 repositórios do GitHub
- Se perguntado sobre algo fora do contexto, redirecione para os projetos reais
- Seja preciso e factual baseado apenas nas informações do portfólio

Responda de forma natural e conversacional sobre os projetos e tecnologias do Lukas.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
      }),
      signal: currentAbortController.signal,
    });

    // Remove indicador de digitação
    messagesDiv.removeChild(typingMsg);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    // Cria mensagem vazia para efeito de digitação
    const botMsg = document.createElement("div");
    botMsg.className = "ewcb-message ewcb-message-bot";
    botMsg.innerHTML = `
            <img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" />
            <div class="ewcb-message-content"></div>
        `;
    messagesDiv.appendChild(botMsg);

    // Inicia efeito de digitação
    await typeWriterEffect(
      botMsg.querySelector(".ewcb-message-content"),
      botResponse,
      messagesDiv
    );
  } catch (error) {
    console.error("=== ERRO DETALHADO DA API ===");
    console.error("Erro:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    // Remove indicador de digitação
    if (messagesDiv.contains(typingMsg)) {
      messagesDiv.removeChild(typingMsg);
    }

    // Adiciona mensagem de erro
    const errorMsg = document.createElement("div");
    errorMsg.className = "ewcb-message ewcb-message-bot";
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
  element.textContent = "";

  for (let i = 0; i < text.length; i++) {
    // Verifica se foi cancelado
    if (currentAbortController && currentAbortController.signal.aborted) {
      break;
    }
    
    element.textContent += text[i];

    // Auto-scroll suave durante a digitação
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Delay entre caracteres (30-80ms)
    const delay = text[i] === " " ? 25 : 15 + Math.random() * 25;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Scroll final
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  currentAbortController = null;
}
