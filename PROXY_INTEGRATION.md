# 🔒 Integração via Proxy - Chatbot Privado

## 📋 Arquitetura Atual

### Repositórios Separados:
- **🌐 Portfolio (Público)**: `lukasdevjobs1/profile-chat`
- **🤖 Chatbot (Privado)**: Repositório separado com SDK completo

### 🔄 Integração via Proxy Vercel:
```
Portfolio Público → Vercel Proxy → Chatbot Privado → Groq API
```

## 🚀 Como Funciona

### 1. Portfolio Público (Este Repo):
```html
<!-- Configuração local -->
<script src="chatbot-config.js"></script>

<!-- Chatbot via proxy -->
<script src="https://lukasdevjobs1.vercel.app/chatbot.js"></script>
```

### 2. Proxy Vercel:
- **URL**: `https://lukasdevjobs1.vercel.app/chatbot.js`
- **Função**: Serve o SDK do chatbot do repositório privado
- **API**: `https://lukasdevjobs1.vercel.app/api/chat`

### 3. Repositório Privado:
- Contém todo o código do SDK (`/sdk/`)
- Configurações sensíveis (`/botData/`)
- API keys e prompts do sistema
- Deploy automático no Vercel

## 📁 Estrutura do Portfolio Público

```
profile-chat/ (PÚBLICO)
├── index.html              # Portfolio principal
├── styles.css              # Estilos (com variáveis do chatbot)
├── script.js               # Lógica do portfolio
├── chatbot-config.js       # Configuração pública do chatbot
├── data/                   # Dados dos projetos
├── botData/
│   └── logo2.webp         # Avatar do bot (público)
└── .gitignore             # Exclui SDK e configs sensíveis
```

## ⚙️ Configuração Pública

### `chatbot-config.js`:
```javascript
window.CHATBOT_CONFIG = {
    apiUrl: 'https://lukasdevjobs1.vercel.app/api/chat',
    theme: { /* cores do portfolio */ },
    chatbot: { /* configurações visuais */ }
};
```

## 🔐 Arquivos Privados (Não no Repo Público)

### Excluídos pelo .gitignore:
```
sdk/                        # SDK completo do chatbot
api/                        # Endpoints da API
botData/api-config.json     # Chaves da API
botData/systemPrompt.txt    # Prompt do sistema
```

## 🌐 Deploy

### Portfolio (GitHub Pages):
```bash
# Automático via GitHub Pages
https://lukasdevjobs1.github.io/profile-chat
```

### Chatbot (Vercel):
```bash
# Deploy do repositório privado
https://lukasdevjobs1.vercel.app
```

## ✅ Vantagens desta Arquitetura

1. **🔒 Segurança**: Código proprietário e API keys protegidos
2. **🌐 Público**: Portfolio acessível para recrutadores
3. **🔄 Flexibilidade**: Atualizações do chatbot independentes
4. **⚡ Performance**: CDN do Vercel para o chatbot
5. **📱 Compatibilidade**: Funciona em qualquer ambiente

## 🧪 Teste da Integração

### Verificações:
1. **Portfolio carrega**: ✅ GitHub Pages
2. **Chatbot aparece**: ✅ Botão flutuante visível
3. **Proxy funciona**: ✅ Script carrega do Vercel
4. **API responde**: ✅ Bot conversa normalmente

### URLs de Teste:
- **Portfolio**: https://lukasdevjobs1.github.io/profile-chat
- **Chatbot JS**: https://lukasdevjobs1.vercel.app/chatbot.js
- **API Chat**: https://lukasdevjobs1.vercel.app/api/chat

## 🔧 Manutenção

### Atualizações do Portfolio:
- Editar arquivos públicos normalmente
- Commit e push para GitHub
- Deploy automático via GitHub Pages

### Atualizações do Chatbot:
- Editar no repositório privado
- Deploy automático no Vercel
- Portfolio usa nova versão automaticamente

---

**Status**: ✅ **INTEGRAÇÃO VIA PROXY CONFIGURADA**

O portfolio agora usa o chatbot via proxy, mantendo o código proprietário seguro!