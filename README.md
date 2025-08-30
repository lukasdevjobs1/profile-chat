# 🤖 LukG GitHub Profile Chat

Chat AI inteligente para perfil do GitHub, rodando 100% offline no navegador usando Chrome Prompt API.

## 🎯 Sobre

Este é um chatbot personalizado que pode ser integrado ao seu perfil do GitHub ou qualquer site pessoal. Ele roda completamente no navegador usando as APIs experimentais de IA do Chrome, sem necessidade de backend.

## ✨ Características

- 🔒 **100% Offline** - Nenhum dado é enviado para servidores externos
- 🎨 **Tema GitHub** - Design inspirado no GitHub com cores personalizadas
- 💬 **Streaming de Respostas** - Respostas em tempo real com indicador de digitação
- 🛑 **Controle de Parada** - Possibilidade de interromper a geração de respostas
- 📱 **Responsivo** - Funciona perfeitamente em dispositivos móveis

## 🚀 Como usar

### Pré-requisitos

1. **Google Chrome** (versão recente)
2. Ativar a flag experimental:
   - Acesse: `chrome://flags/#prompt-api-for-gemini-nano`
   - Defina como "Enabled"
   - Reinicie o Chrome

### Instalação Local

```bash
# Clone o repositório
git clone [seu-repositorio]

# Entre na pasta do projeto
cd github-profile-chat

# Instale as dependências
npm install

# Execute o servidor local
npm start
```

Acesse: `http://localhost:3000`

### Integração em Outros Sites

Para usar o chatbot em qualquer site, adicione este código no final do `<body>`:

```html
<script type="module" src="https://seu-dominio.com/sdk/src/index.js"></script>
```

## 🎨 Personalização

### Configuração do Bot

Edite `botData/chatbot-config.json`:

```json
{
  "primaryColor": "#0969da",
  "chatbotName": "Seu Nome AI Assistant",
  "welcomeBubble": "👋 Olá! Como posso ajudar?",
  "firstBotMessage": "Sua mensagem inicial aqui..."
}
```

### Prompt do Sistema

Edite `botData/systemPrompt.txt` para personalizar o comportamento do assistente.

### Avatar

Substitua `botData/avatar.webp` pela sua imagem (recomendado: 128x128px).

## 📁 Estrutura do Projeto

```
github-profile-chat/
├── botData/
│   ├── avatar.webp          # Avatar do bot
│   ├── chatbot-config.json  # Configurações
│   └── systemPrompt.txt     # Prompt do sistema
├── sdk/
│   ├── src/
│   │   ├── controllers/     # Lógica de controle
│   │   ├── views/          # Interface do usuário
│   │   ├── services/       # Serviços de IA
│   │   └── index.js        # Inicializador
│   ├── ew-chatbot.css      # Estilos
│   └── ew-chatbot.html     # Template HTML
├── index.html              # Página de exemplo
└── package.json
```

## 🔧 Tecnologias

- **Chrome Prompt API** - IA local do navegador
- **Vanilla JavaScript** - Sem frameworks pesados
- **CSS Custom Properties** - Temas personalizáveis
- **ES6 Modules** - Arquitetura modular

## ⚠️ Limitações

- Funciona apenas no Google Chrome
- Requer flags experimentais ativadas
- Depende do hardware local para processamento de IA
- Projeto educacional - não recomendado para produção sem revisões

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

---

Feito com 💜 por LukG