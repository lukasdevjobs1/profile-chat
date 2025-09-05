# 📋 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2025-01-13

### 🚀 MAJOR UPDATE - Integração com GitHub API

#### ✨ Adicionado
- **GitHubService**: Serviço completo para buscar dados reais dos repositórios
- **Dados dinâmicos**: IA agora acessa README, tecnologias e estatísticas em tempo real
- **Detecção inteligente**: Reconhece automaticamente menções de projetos específicos
- **Cache otimizado**: Sistema de cache de 10 minutos para melhor performance
- **Linguagem natural**: IA entende perguntas naturais sobre projetos
- **Proteção de dados**: .gitignore configurado para proteger API keys

#### 🔄 Modificado
- **GroqService**: Integrado com GitHubService para respostas mais precisas
- **SystemPrompt**: Atualizado com perfil realista de desenvolvedor junior
- **Detecção de projetos**: Sistema avançado para identificar menções específicas
- **Streaming**: Melhorado para respostas mais naturais

#### 🛡️ Segurança
- **API Keys protegidas**: Arquivo api-config.json no .gitignore
- **Arquivo exemplo**: api-config.example.json para configuração
- **Dados sensíveis**: Todos protegidos contra commits acidentais

#### 📁 Arquivos adicionados
- `sdk/src/services/githubService.js` - Serviço de integração GitHub
- `botData/api-config.example.json` - Exemplo de configuração
- `.gitignore` - Proteção de dados sensíveis

#### 📁 Arquivos modificados
- `sdk/src/services/groqService.js` - Integração com GitHub API
- `botData/systemPrompt.txt` - Perfil realista e instruções melhoradas

---

## [1.1.0] - 2024-12-19

### ✨ Adicionado
- **Chatbot otimizado para recrutadores**: Respostas mais direcionadas para oportunidades profissionais
- **Apresentação automática de tecnologias**: Destaque para React, JavaScript, Python, AWS
- **Direcionamento para projetos**: Links automáticos para repositórios GitHub

### 🔄 Modificado
- **Prompt do sistema**: Atualizado para focar em recrutadores e curiosos
- **Mensagem de boas-vindas**: Mais amigável e direcionada
- **Primeira interação**: Apresenta automaticamente projetos e tecnologias

### 📁 Arquivos alterados
- `botData/systemPrompt.txt` - Novo prompt focado em networking profissional
- `botData/chatbot-config.json` - Mensagens de boas-vindas atualizadas

---

## [1.0.0] - 2024-12-18

### ✨ Inicial
- Implementação do chatbot AI pessoal
- Integração com GitHub Pages
- Interface responsiva e moderna