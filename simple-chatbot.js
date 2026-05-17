console.log("🚀 Carregando chatbot...");

(async () => {
  try {
    const [css, html, config, systemPrompt] = await Promise.all([
      fetch("./sdk/ew-chatbot.css").then((r) => r.text()),
      fetch("./sdk/ew-chatbot.html").then((r) => r.text()),
      fetch("./botData/chatbot-config.json").then((r) => r.json()),
      fetch("./botData/systemPrompt.txt").then((r) => r.text()),
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

    const openBtn = document.querySelector("#ewcb-open-btn");
    const closeBtn = document.querySelector("#ewcb-close-btn");
    const stopBtn = document.querySelector("#ewcb-stop");
    const chatWindow = document.querySelector("#ewcb-chat-window");
    const messagesDiv = document.querySelector("#ewcb-messages");
    const input = document.querySelector("#ewcb-input");
    const submitBtn = document.querySelector("#ewcb-submit");
    const form = document.querySelector("#ewcb-form");

    const setInputEnabled = (enabled) => {
      input.disabled = !enabled;
      submitBtn.disabled = !enabled;
      stopBtn.disabled = enabled;
    };

    if (openBtn && chatWindow) {
      openBtn.onclick = () => {
        chatWindow.style.display = "flex";
        if (messagesDiv && messagesDiv.children.length === 0) {
          const welcomeMsg = document.createElement("div");
          welcomeMsg.className = "ewcb-message ewcb-message-bot";
          welcomeMsg.innerHTML = `<img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" /><div class="ewcb-message-content">${config.firstBotMessage}</div>`;
          messagesDiv.appendChild(welcomeMsg);
        }
        if (input) input.focus();
      };
    }

    if (closeBtn && chatWindow) {
      closeBtn.onclick = () => { chatWindow.style.display = "none"; };
    }

    if (stopBtn) {
      stopBtn.onclick = () => {
        if (currentAbortController) currentAbortController.abort();
      };
    }

    if (form && input && messagesDiv) {
      form.onsubmit = (e) => {
        e.preventDefault();
        if (input.disabled) return;
        const message = input.value.trim();
        if (!message) return;

        const userMsg = document.createElement("div");
        userMsg.className = "ewcb-message ewcb-message-user";
        userMsg.innerHTML = `<div class="ewcb-message-content">${message}</div>`;
        messagesDiv.appendChild(userMsg);
        input.value = "";

        sendToAPI(message, messagesDiv, config, systemPrompt, setInputEnabled);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      };
    }

    const welcomeBubble = document.createElement("div");
    welcomeBubble.className = "ewcb-welcome-bubble";
    welcomeBubble.textContent = config.welcomeBubble;
    welcomeBubble.onclick = () => {
      if (openBtn) openBtn.click();
      welcomeBubble.style.display = "none";
    };
    document.body.appendChild(welcomeBubble);

    setInputEnabled(true);
    console.log("✅ Chatbot carregado!");
  } catch (error) {
    console.error("❌ Erro ao carregar chatbot:", error);
  }
})();

// Variável global para controlar cancelamento
let currentAbortController = null;

async function sendToAPI(message, messagesDiv, config, systemPrompt, setInputEnabled) {
  currentAbortController = new AbortController();
  setInputEnabled(false);

  const typingMsg = document.createElement("div");
  typingMsg.className = "ewcb-message ewcb-message-bot";
  typingMsg.innerHTML = `<img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" /><div class="ewcb-message-content">Digitando...</div>`;
  messagesDiv.appendChild(typingMsg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch("https://profile-chat.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 800,
      }),
      signal: currentAbortController.signal,
    });

    if (messagesDiv.contains(typingMsg)) messagesDiv.removeChild(typingMsg);

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    const botMsg = document.createElement("div");
    botMsg.className = "ewcb-message ewcb-message-bot";
    botMsg.innerHTML = `<img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" /><div class="ewcb-message-content"></div>`;
    messagesDiv.appendChild(botMsg);

    await typeWriterEffect(botMsg.querySelector(".ewcb-message-content"), botResponse, messagesDiv);
  } catch (error) {
    if (messagesDiv.contains(typingMsg)) messagesDiv.removeChild(typingMsg);

    if (error.name === "AbortError") {
      currentAbortController = null;
      setInputEnabled(true);
      return;
    }

    console.error("Erro na API:", error.message);
    const errorMsg = document.createElement("div");
    errorMsg.className = "ewcb-message ewcb-message-bot";
    errorMsg.innerHTML = `<img src="${config.botAvatar}" class="ewcb-avatar" alt="Bot Avatar" /><div class="ewcb-message-content">Erro ao processar. Tente novamente.</div>`;
    messagesDiv.appendChild(errorMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  currentAbortController = null;
  setInputEnabled(true);
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
