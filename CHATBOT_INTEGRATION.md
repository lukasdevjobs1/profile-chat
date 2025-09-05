# 🤖 Integração do Chatbot - Portfolio LukG

## ✅ Status da Integração

O chatbot foi **integrado com sucesso** ao portfolio! 

### Funcionalidades Implementadas:

- ✅ **Interface Moderna**: Design consistente com o tema do portfolio
- ✅ **IA Híbrida**: Groq API + Chrome AI como fallback
- ✅ **Respostas Inteligentes**: Conhece projetos, tecnologias e experiências do LukG
- ✅ **Integração GitHub**: Busca dados reais dos repositórios
- ✅ **Streaming de Respostas**: Efeito de digitação em tempo real
- ✅ **Responsivo**: Funciona em desktop e mobile
- ✅ **Markdown Support**: Formatação rica nas respostas

## 🚀 Como Funciona

### 1. Carregamento Automático
```html
<!-- No index.html -->
<script type="module" src="./sdk/src/index.js"></script>
```

### 2. Inicialização
- Carrega CSS e HTML do chatbot
- Configura tema baseado nas variáveis CSS do portfolio
- Inicializa serviços de IA (Groq + Chrome AI)
- Exibe mensagem de boas-vindas

### 3. Fluxo de Conversação
1. Usuário digita mensagem
2. Sistema detecta menções a projetos específicos
3. Busca dados reais do GitHub (se necessário)
4. Envia para IA com contexto enriquecido
5. Processa resposta em streaming
6. Exibe com formatação Markdown

## 🎨 Personalização Visual

### Variáveis CSS Integradas:
```css
:root {
    --primaryColor: #0969da;
    --backgroundColor: #0d1117;
    --headerColor: #161b22;
    --userBubble: #21262d;
    --botBubble: #0d1117;
    --userText: #f0f6fc;
    --botText: #f0f6fc;
}
```

### Elementos Visuais:
- **Botão Flutuante**: Canto inferior direito com badge
- **Interface Chat**: Janela moderna com header personalizado
- **Mensagens**: Bolhas diferenciadas para usuário e bot
- **Animações**: Indicador de digitação e transições suaves

## 🧠 Inteligência Artificial

### Serviços Configurados:

#### 1. Groq API (Principal)
- **Modelo**: llama-3.1-8b-instant
- **Modo**: Produção via proxy (Vercel)
- **Fallback**: Respostas simuladas se API falhar

#### 2. Chrome AI (Fallback)
- **Disponibilidade**: Apenas Chrome com flags experimentais
- **Uso**: Backup quando Groq não disponível

### Prompt do Sistema:
```
Você é o assistente pessoal do LukG, um desenvolvedor apaixonado por tecnologia...
- Desenvolvedor Full Stack com foco em JavaScript/TypeScript, Node.js, Python, AWS
- Responder sobre projetos e tecnologias
- Tom amigável e profissional
- Sempre em português brasileiro
```

## 📁 Estrutura de Arquivos

```
profile-chat/
├── sdk/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── chatBotController.js    # Controle principal
│   │   ├── services/
│   │   │   ├── hybridPromptService.js  # Gerenciador de IA
│   │   │   ├── groqService.js          # Integração Groq
│   │   │   ├── promptService.js        # Chrome AI
│   │   │   └── githubService.js        # API GitHub
│   │   ├── views/
│   │   │   └── chatBotView.js          # Interface visual
│   │   └── index.js                    # Ponto de entrada
│   ├── ew-chatbot.css                  # Estilos do chatbot
│   └── ew-chatbot.html                 # Template HTML
├── botData/
│   ├── chatbot-config.json             # Configurações visuais
│   ├── api-config.json                 # Chaves da API
│   ├── systemPrompt.txt                # Prompt do sistema
│   └── logo2.webp                      # Avatar do bot
└── index.html                          # Página principal
```

## 🔧 Configuração

### 1. Configurações Visuais (`botData/chatbot-config.json`):
```json
{
  "primaryColor": "#0969da",
  "chatbotName": "LukG AI Assistant",
  "welcomeBubble": "👋 Olá! Sou o assistente do LukG",
  "firstBotMessage": "Sou o assistente pessoal do LukG..."
}
```

### 2. API Keys (`botData/api-config.json`):
```json
{
  "groq": {
    "apiKey": "gsk_...",
    "model": "llama-3.1-8b-instant",
    "baseUrl": "https://api.groq.com/openai/v1/chat/completions"
  }
}
```

## 🌐 Deploy

### Ambientes Suportados:
- ✅ **GitHub Pages**: `lukasdevjobs1.github.io/profile-chat`
- ✅ **Vercel**: Servidor proxy para APIs
- ✅ **Local**: Desenvolvimento com API keys

### URLs de Produção:
- **Site**: https://lukasdevjobs1.github.io/profile-chat
- **API Proxy**: https://lukasdevjobs1.vercel.app/api/chat

## 🧪 Teste

### Arquivo de Teste:
```bash
# Abrir no navegador
test-chatbot.html
```

### Comandos de Teste:
- "Olá" - Teste básico
- "Fale sobre os projetos do LukG" - Teste de contexto
- "Conte sobre o projeto profile-chat" - Teste de integração GitHub
- "Quais tecnologias o LukG usa?" - Teste de conhecimento

## 🔍 Debugging

### Console Logs:
```javascript
// Verificar inicialização
console.log('✅ Usando Groq API (confiável)');

// Verificar ambiente
console.log('Ambiente:', ambiente);
console.log('URL da API:', apiUrl);

// Verificar projetos
console.log('Buscando dados reais do projeto:', projectName);
```

### Verificações:
1. **Widget carregado**: `document.getElementById('ewcb-widget')`
2. **Serviços ativos**: Mensagens no console
3. **API funcionando**: Respostas do bot
4. **GitHub integrado**: Dados reais dos projetos

## 📈 Próximos Passos

### Melhorias Futuras:
- [ ] Histórico de conversas persistente
- [ ] Sugestões de perguntas
- [ ] Integração com mais APIs (LinkedIn, etc.)
- [ ] Analytics de conversas
- [ ] Modo offline com respostas cached

---

**Status**: ✅ **INTEGRAÇÃO COMPLETA E FUNCIONAL**

O chatbot está totalmente integrado ao portfolio e pronto para interagir com visitantes!