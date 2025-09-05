# 🤖 Profile Chat - ChatBot AI Pessoal

<div align="center">
    <img src="./botData/avatar.webp" alt="ChatBot Avatar" width="120" height="120" style="border-radius: 50%;">
    
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://lukasdevjobs1.github.io/profile-chat/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://profile-chat-lukasdevjobs1.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AI](https://img.shields.io/badge/AI-Groq%20API-blue?style=for-the-badge&logo=robot)](https://groq.com/)

</div>

## 📋 Sobre o Projeto

**Profile Chat** é um chatbot AI inteligente desenvolvido para apresentar meu portfólio profissional de forma interativa. O bot conhece todos os meus 13 repositórios, tecnologias, projetos e pode responder perguntas sobre minha experiência como desenvolvedor.

### 🎯 Objetivo

Criar uma experiência única para recrutadores, colegas desenvolvedores e curiosos que querem conhecer meu trabalho de forma conversacional e inteligente.

## ✨ Funcionalidades

- 🤖 **ChatBot AI Inteligente** - Powered by Groq API (Llama 3.1)
- 📊 **Catálogo Completo** - Conhece todos os 13 repositórios do GitHub
- 🎨 **Interface Moderna** - Design responsivo e animações suaves
- 🔒 **Seguro** - API keys protegidas via variáveis de ambiente
- 📱 **Responsivo** - Funciona perfeitamente em mobile e desktop
- 🚀 **Deploy Automático** - GitHub Pages + Vercel
- 🎭 **Personalidade** - Respostas contextualizadas e profissionais

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica moderna
- **CSS3** - Animações, gradientes e responsividade
- **JavaScript ES6+** - Lógica do chatbot e integração com API
- **Fetch API** - Comunicação com serviços externos

### Backend/API
- **Vercel Functions** - Serverless API proxy
- **Groq API** - Modelo de linguagem Llama 3.1-8b-instant
- **GitHub API** - Integração com repositórios (futuro)

### Arquitetura
- **SDK Modular** - Arquitetura MVC organizada
- **Services Layer** - Separação de responsabilidades
- **Configuration Management** - Configurações centralizadas

## 📁 Estrutura do Projeto

```
profile-chat/
├── 📂 api/
│   └── chat.js                 # Proxy serverless para Groq API
├── 📂 botData/
│   ├── api-config.json         # Configurações da API (template)
│   ├── chatbot-config.json     # Configurações do chatbot
│   ├── projectsCatalog.json    # Catálogo completo de projetos
│   ├── systemPrompt.txt        # Prompt do sistema AI
│   └── avatar.webp            # Avatar do chatbot
├── 📂 sdk/
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Controladores MVC
│   │   ├── 📂 services/        # Serviços (API, GitHub, etc)
│   │   ├── 📂 views/          # Componentes de interface
│   │   └── index.js           # Entry point do SDK
│   ├── ew-chatbot.css         # Estilos do SDK
│   └── ew-chatbot.html        # Template do chatbot
├── index.html                 # Página principal
├── script.js                  # Lógica principal
├── styles.css                 # Estilos globais
└── vercel.json               # Configuração de deploy
```

## 🚀 Como Usar

### 1. Acesso Direto
- **GitHub Pages**: [lukasdevjobs1.github.io/profile-chat](https://lukasdevjobs1.github.io/profile-chat/)
- **Vercel**: [profile-chat-lukasdevjobs1.vercel.app](https://profile-chat-lukasdevjobs1.vercel.app/)

### 2. Instalação Local

```bash
# Clone o repositório
git clone https://github.com/lukasdevjobs1/profile-chat.git

# Entre no diretório
cd profile-chat

# Configure a API key (necessário para funcionalidade completa)
cp botData/api-config.example.json botData/api-config.json
# Edite api-config.json com sua chave da Groq API

# Sirva localmente
python -m http.server 8000
# ou
npx serve .
```

### 3. Deploy

#### GitHub Pages
```bash
# Push para branch main
git push origin main
# GitHub Pages deploy automático
```

#### Vercel
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure variável de ambiente
vercel env add GROQ_API_KEY
```

## 💬 Exemplos de Conversas

### Perguntas sobre Projetos
- *"Quais são seus principais projetos?"*
- *"Me fale sobre o Git_Projects"*
- *"Você tem experiência com Python?"*

### Perguntas Técnicas
- *"Quais tecnologias você domina?"*
- *"Você trabalha com AWS?"*
- *"Tem experiência com chatbots?"*

### Perguntas Profissionais
- *"Qual sua formação?"*
- *"Como posso entrar em contato?"*
- *"Você está disponível para projetos?"*

## 📊 Portfólio Integrado

O chatbot conhece detalhadamente:

### 🏆 Projetos Originais (5)
- **Git_Projects** - Portfólio técnico principal
- **profile-chat** - Este chatbot AI
- **Exercicios_praticos_InfinitySchool** - Exercícios Python
- **bia** - Projeto JavaScript
- **lukasdevjobs1** - Site pessoal

### 🔄 Projetos Forked (8)
- **semana-javascript-expert09** - Chatbot offline
- **grokking_algorithms** - Algoritmos e estruturas
- **developer-roadmap** - Roadmaps de carreira
- **mcp** - AWS MCP Servers
- **BibliotecaDev** - Biblioteca de livros
- **Desafios_Infinity_School** - Desafios Python
- **Agents-Prompts** - Prompts para IA

### 🛠️ Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript, Vue.js
- **Backend**: Python, Node.js
- **AI/Chatbots**: Groq API, Prompt Engineering
- **Cloud**: AWS, GitHub Pages, Vercel
- **Tools**: Git, GitHub, Cursor IDE

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# Vercel
GROQ_API_KEY=your_groq_api_key_here

# Local (.env)
GROQ_API_KEY=your_groq_api_key_here
```

### Personalização do Chatbot
Edite `botData/chatbot-config.json`:
```json
{
  "name": "Seu Nome",
  "title": "Seu Título",
  "avatar": "./botData/seu-avatar.webp",
  "primaryColor": "#sua-cor"
}
```

### Atualização do Catálogo
Edite `botData/projectsCatalog.json` para incluir seus projetos.

## 🤝 Contribuições

Contribuições são bem-vindas! Este projeto serve como template para outros desenvolvedores criarem seus próprios chatbots de portfólio.

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**Lukas Albertino Gomes**
- 📧 Email: [luk.devjobs@gmail.com](mailto:luk.devjobs@gmail.com)
- 💼 LinkedIn: [lukas-gomes-4470a2269](https://www.linkedin.com/in/lukas-gomes-4470a2269/)
- 🐙 GitHub: [@lukasdevjobs1](https://github.com/lukasdevjobs1)
- 🐦 Twitter: [@LukDev13](https://x.com/LukDev13)
- 💬 WhatsApp: [+55 85 99257-0216](https://wa.me/5585992570216)

---

<div align="center">

**🚀 Desenvolvido com paixão por tecnologia e IA**

[![GitHub Stars](https://img.shields.io/github/stars/lukasdevjobs1/profile-chat?style=social)](https://github.com/lukasdevjobs1/profile-chat/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/lukasdevjobs1/profile-chat?style=social)](https://github.com/lukasdevjobs1/profile-chat/network/members)

</div>