# 🤖 Chatbot AI Pessoal - Lukas Gomes

## 🎯 Visão Geral

Chatbot AI pessoal desenvolvido com integração real de IA (Groq) e GitHub API, projetado para apresentar automaticamente projetos, tecnologias e facilitar networking profissional.

## 🚀 Demo

**[🔗 Acesse o Chatbot](https://lukasdevjobs1.github.io/lukasdevjobs1/)**

## ✨ Funcionalidades

- 🧠 **IA Conversacional Real** - Powered by Groq Llama 3.1-8B
- 📊 **Integração GitHub API** - Dados reais dos repositórios
- 🎯 **Detecção de Projetos** - Reconhece e apresenta projetos específicos
- 💬 **Linguagem Natural** - Conversação fluida e contextual
- 📝 **Histórico Inteligente** - Mantém contexto da conversa
- ⚡ **Performance Otimizada** - Cache e respostas rápidas
- 🔒 **Arquitetura Segura** - API keys protegidas no servidor

## 🏗️ Arquitetura

```
Frontend (GitHub Pages) → Servidor Proxy (Vercel) → Groq API + GitHub API
```

### Componentes

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js 22.x (Vercel Serverless)
- **IA**: Groq API (Llama 3.1-8B Instant)
- **APIs**: GitHub REST API v4
- **Deploy**: GitHub Pages + Vercel

## 📁 Estrutura do Projeto

```
├── api/
│   └── chat.js                 # API endpoint Vercel
├── botData/
│   ├── api-config.json         # Configurações da API
│   ├── avatar.webp            # Avatar do bot
│   ├── chatbot-config.json    # Configurações gerais
│   ├── projectsCatalog.json   # Catálogo de projetos
│   └── systemPrompt.txt       # Prompt do sistema
├── sdk/
│   ├── src/
│   │   ├── controllers/       # Controladores
│   │   ├── services/          # Serviços (IA, GitHub, etc)
│   │   └── views/             # Interface do usuário
│   ├── ew-chatbot.css        # Estilos do chatbot
│   └── ew-chatbot.html       # Interface principal
├── index.html                 # Página inicial
├── package.json              # Dependências
└── vercel.json               # Configuração Vercel
```

## 🔧 Configuração

### Pré-requisitos

- Node.js 22.x
- Conta Groq (API Key)
- Conta Vercel (para deploy)

### Variáveis de Ambiente

```bash
GROQ_API_KEY=sua_api_key_aqui
```

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/lukasdevjobs1/lukasdevjobs1.git

# Entre no diretório
cd "seu_repositorio_aqui"

# Execute localmente
npm run dev
```

## 🌐 Deploy

### GitHub Pages
- Automaticamente deployado em: `https://lukasdevjobs1.github.io/lukasdevjobs1/`

### Vercel (API)
- API endpoint: `https://lukasdevjobs1.vercel.app/api/chat`
- Deploy automático via GitHub integration

## 🔒 Segurança

- ✅ API keys protegidas no servidor Vercel
- ✅ CORS configurado para domínios específicos
- ✅ Servidor proxy impede exposição de credenciais
- ✅ Variáveis de ambiente seguras
- ✅ Sem dados sensíveis no frontend

## 📊 Performance

- **Tempo de resposta IA**: ~1-2s
- **GitHub API**: ~200-300ms
- **CORS otimizado**
- **Cache inteligente**
- **Detecção automática de ambiente**

## 🎨 Interface

- Interface moderna e responsiva
- Conversação natural fluida
- Respostas contextuais precisas
- Dados reais dos projetos GitHub
- Histórico de conversação
- Feedback visual em tempo real

## 🤖 Funcionalidades da IA

### Capacidades
- Apresentação pessoal e profissional
- Detalhes sobre projetos específicos
- Informações sobre tecnologias utilizadas
- Experiência e formação acadêmica
- Links para contato e redes sociais
- Recomendações personalizadas

### Exemplos de Perguntas
- "Me fale sobre seus projetos"
- "Quais tecnologias você domina?"
- "Como posso entrar em contato?"
- "Conte sobre sua experiência"
- "Quais são seus projetos mais recentes?"

## 📈 Métricas

- ✅ IA real funcionando (Groq API)
- ✅ GitHub API integrada
- ✅ Deploy em produção estável
- ✅ Arquitetura segura implementada
- ✅ Performance otimizada
- ✅ Experiência do usuário fluida

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Vercel Serverless
- **IA**: Groq API (Llama 3.1-8B)
- **APIs**: GitHub REST API
- **Deploy**: GitHub Pages, Vercel
- **Arquitetura**: JAMstack, Serverless

## 📞 Contato

- **LinkedIn**: [Lukas Gomes](https://www.linkedin.com/in/lukas-gomes-4470a2269/)
- **GitHub**: [@lukasdevjobs1](https://github.com/lukasdevjobs1)
- **Email**: luk.devjobs@gmail.com
- **WhatsApp**: [+55 85 99257-0216](https://wa.me/5585992570216)

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ por Lukas Gomes**

> Habilidades em IA, APIs, arquitetura segura e desenvolvimento full-stack!