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

## 🔒 Segurança e Considerações

### **Riscos Potenciais:**
- **APIs Experimentais**: Chrome Prompt API ainda é experimental, pode ter bugs ou ser alterada/removida pelo Google
- **Processamento Local**: IA roda no navegador, dados não saem do dispositivo (mais seguro), mas depende do hardware local
- **Código Público**: Todo código está visível no GitHub, incluindo a lógica do chatbot e prompt do sistema

### **Mitigações Implementadas:**
- ✅ Sem dados sensíveis ou credenciais no código
- ✅ Não conecta com APIs externas - tudo roda offline
- ✅ Validações de segurança (verifica Chrome, APIs disponíveis, controle de abort)
- ✅ Escopo limitado - chatbot só responde sobre o perfil, não acessa dados do sistema

### **Recomendações Adicionais:**

#### **1. Monitore o Projeto:**
- Acompanhe atualizações do Chrome e mudanças nas APIs experimentais
- Teste regularmente o funcionamento
- Verifique logs de erro no console do navegador

#### **2. Para Uso em Produção:**
- Adicione mais validações de entrada do usuário
- Implemente rate limiting para evitar spam
- Considere migrar para APIs estáveis quando disponíveis
- Adicione monitoramento de erros

#### **3. Transparência:**
- Sempre informe aos usuários que é um projeto experimental
- Documente claramente as limitações
- Mantenha o código público para auditoria
- Informe sobre o processamento local dos dados

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