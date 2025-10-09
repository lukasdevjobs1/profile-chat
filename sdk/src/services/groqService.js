import { GitHubService } from "./githubService.js";

/**
 * Serviço de integração com a API do Groq
 *
 * Gerencia comunicação com a API do Groq para processamento de linguagem natural,
 * incluindo detecção de menções a projetos, enriquecimento de contexto via GitHub,
 * e fallback para respostas simuladas em caso de falha.
 */
export class GroqService {
  /** @private {Object|null} Configurações da API */
  config;
  /** @private {string} Prompt do sistema para a IA */
  systemPrompt;
  /** @private {Array} Histórico da conversação */
  conversationHistory;
  /** @private {GitHubService} Serviço para buscar dados do GitHub */
  githubService;

  /**
   * Inicializa o serviço Groq com dependências
   */
  constructor() {
    this.config = null;
    this.systemPrompt = "";
    this.conversationHistory = [];
    this.githubService = new GitHubService();
  }

  /**
   * Inicializa o serviço com prompt do sistema e configurações
   *
   * Configura o serviço para funcionar tanto em desenvolvimento local
   * quanto em produção (GitHub Pages/Vercel) usando servidor proxy.
   *
   * @param {string} systemPrompt - Prompt do sistema para configurar comportamento da IA
   * @returns {Promise<boolean>} Sempre retorna true (inicialização bem-sucedida)
   */
  async init(systemPrompt) {
    this.systemPrompt = systemPrompt;

    // Configuração padrão (sempre usa proxy em produção)
    this.config = {
      groq: {
        apiKey: "proxy_mode",
        model: "llama-3.1-8b-instant",
        baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      },
    };
    console.log('✅ Usando configuração segura (proxy mode)');

    return true;
  }

  /**
   * Processa prompt do usuário e retorna resposta da IA
   *
   * Fluxo completo:
   * 1. Detecta ambiente (local/produção)
   * 2. Identifica menções a projetos
   * 3. Enriquece contexto com dados do GitHub
   * 4. Envia requisição para API
   * 5. Processa resposta em streaming
   * 6. Atualiza histórico de conversação
   *
   * @param {string} text - Mensagem do usuário
   * @param {AbortSignal} signal - Sinal para cancelar requisição
   * @returns {Promise<AsyncIterable<string>>} Stream de resposta da IA
   * @throws {Error} Se o serviço não estiver configurado
   */
  async prompt(text, signal) {
    if (!this.config || !this.config.groq) {
      throw new Error("Groq não configurado");
    }

    // Detecta ambiente de execução para escolher URL da API
    const isGitHubPages =
      window.location.hostname === "lukasdevjobs1.github.io";
    const isVercel = window.location.hostname.includes("vercel.app");
    const isProduction = isGitHubPages || isVercel;
    const hasApiKey = false; // Sempre false por segurança

    // Sempre usa proxy por segurança
    const apiUrl = 'https://profile-chat.vercel.app/api/chat';

    let ambiente = "Proxy Seguro";
    if (isGitHubPages) ambiente = "GitHub Pages (Proxy)";
    if (isVercel) ambiente = "Vercel (Proxy)";

    console.log("Ambiente:", ambiente);
    console.log("URL da API:", apiUrl);
    console.log("Tem API Key:", hasApiKey);
    console.log("Hostname:", window.location.hostname);

    // Detecta menções a projetos específicos para enriquecer contexto
    const projectName = this.detectProjectMention(text);
    let enhancedSystemPrompt = this.systemPrompt;

    if (projectName) {
      console.log(`🔍 Buscando dados reais do projeto: ${projectName}`);
      try {
        const projectDetails = await this.githubService.getRepositoryDetails(
          projectName
        );
        if (projectDetails) {
          const projectInfo =
            this.githubService.formatProjectInfo(projectDetails);
          enhancedSystemPrompt += `\n\n### 📊 DADOS REAIS DO REPOSITÓRIO ${projectName.toUpperCase()} (GitHub API):\n${projectInfo}`;
          console.log(`✅ Dados do ${projectName} carregados com sucesso`);
        } else {
          console.log(`⚠️ Repositório ${projectName} não encontrado`);
        }
      } catch (error) {
        console.error(`❌ Erro ao buscar ${projectName}:`, error);
      }
    }

    try {
      const headers = { "Content-Type": "application/json" };

      // Debug: mostrar valores
      console.log("=== DEBUG GROQ SERVICE ===");
      console.log("isProduction:", isProduction);
      console.log("hasApiKey:", hasApiKey);
      console.log("apiKey:", this.config.groq.apiKey?.substring(0, 10) + '...');
      console.log("URL que será usada:", apiUrl);

      // Sempre usa proxy por segurança
      console.log("Usando servidor proxy (seguro)");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: this.config.groq.model,
          messages: [
            { role: "system", content: enhancedSystemPrompt },
            ...this.conversationHistory,
            { role: "user", content: text },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta da API:', errorText);
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Adiciona ao histórico
      this.conversationHistory.push(
        { role: "user", content: text },
        { role: "assistant", content: content }
      );

      // Mantém apenas últimas 6 mensagens (3 trocas)
      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }

      return this.createAsyncIterator(content);
    } catch (error) {
      console.error("=== ERRO NA API GROQ ===");
      console.error("Erro completo:", error);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      // Fallback para resposta simulada em caso de erro
      const mockResponse = this.generateMockResponse(text);

      this.conversationHistory.push(
        { role: "user", content: text },
        { role: "assistant", content: mockResponse }
      );

      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }

      return this.createAsyncIterator(mockResponse);
    }
  }

  /**
   * Gera resposta simulada quando a API falha
   *
   * Sistema de fallback que analisa a mensagem do usuário
   * e retorna respostas pré-definidas baseadas em padrões comuns.
   *
   * @param {string} text - Mensagem do usuário
   * @returns {string} Resposta simulada apropriada
   */
  generateMockResponse(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('oi') || textLower.includes('olá')) {
      return "Olá! Sou o assistente do Lukas Gomes, desenvolvedor de Fortaleza-CE! 🚀\n\nPosso falar sobre:\n• 13 repositórios no GitHub\n• Projetos com JavaScript e Python\n• Chatbots e IA\n• Tecnologias e experiência\n\nO que você quer saber?";
    }
    
    return "Sou o assistente do Lukas! Posso falar sobre seus projetos, tecnologias e experiência como desenvolvedor. O que te interessa?";
  }

  /**
   * Detecta menções a projetos específicos na mensagem do usuário
   *
   * Analisa o texto em busca de:
   * - Nomes diretos de repositórios
   * - Padrões como "projeto X", "sobre o X"
   * - Variações de nomenclatura (underscore vs hífen)
   *
   * @param {string} text - Mensagem do usuário
   * @returns {string|null} Nome do projeto detectado ou null
   */
  detectProjectMention(text) {
    const textLower = text.toLowerCase();

    // Lista de projetos conhecidos com variações de nomenclatura
    const projects = [
      "bia",
      "lukasdevjobs1",
      "git_projects",
      "git-projects",
      "exercicios_praticos_infinityschool",
      "exercicios-praticos-infinityschool",
      "profile-chat",
      "profile_chat",
      "semana-javascript-expert09",
      "desafios_infinity_school",
      "desafios-infinity-school",
      "grokking_algorithms",
      "grokking-algorithms",
      "mcp",
      "developer-roadmap",
      "developer_roadmap",
      "bibliotecadev",
      "agents-prompts",
      "agents_prompts",
    ];

    // Busca menções diretas de projetos
    for (const project of projects) {
      if (textLower.includes(project)) {
        console.log(`Projeto detectado: ${project}`);
        return this.normalizeProjectName(project);
      }
    }

    // Busca padrões mais amplos para capturar perguntas sobre repositórios
    const patterns = [
      /git[_-]?projects?/i,
      /reposit[oó]rio.*git/i,
      /to\s*do\s*list/i,
      /encurtador.*url/i,
      /fibonacci/i,
      /interface.*gráfica/i,
      /github.*api/i,
    ];

    for (const pattern of patterns) {
      if (pattern.test(textLower)) {
        console.log(`Padrão detectado para Git_Projects: ${pattern}`);
        return "Git_Projects";
      }
    }

    return null;
  }

  /**
   * Normaliza nomes de projetos para corresponder aos nomes reais dos repositórios
   *
   * Converte variações de nomenclatura (underscore, hífen, case)
   * para os nomes exatos dos repositórios no GitHub.
   *
   * @param {string} name - Nome do projeto a ser normalizado
   * @returns {string} Nome normalizado do repositório
   */
  normalizeProjectName(name) {
    const nameMap = {
      git_projects: "Git_Projects",
      "git-projects": "Git_Projects",
      exercicios_praticos_infinityschool: "Exercicios_praticos_InfinitySchool",
      "exercicios-praticos-infinityschool":
        "Exercicios_praticos_InfinitySchool",
      profile_chat: "profile-chat",
      desafios_infinity_school: "Desafios_Infinity_School",
      "desafios-infinity-school": "Desafios_Infinity_School",
      grokking_algorithms: "grokking_algorithms",
      "grokking-algorithms": "grokking_algorithms",
      developer_roadmap: "developer-roadmap",
      agents_prompts: "Agents-Prompts",
      "agents-prompts": "Agents-Prompts",
      bibliotecadev: "BibliotecaDev",
    };

    return nameMap[name.toLowerCase()] || name;
  }

  /**
   * Cria iterador assíncrono para simular streaming de resposta
   *
   * Simula o comportamento de streaming da IA:
   * 1. Delay inicial ("pensamento")
   * 2. Entrega palavra por palavra
   * 3. Delays variáveis entre palavras
   *
   * @param {string} text - Texto completo da resposta
   * @yields {string} Palavras individuais da resposta
   */
  async *createAsyncIterator(text) {
    // Simula delay inicial de "pensamento" da IA (1.5-2.5s)
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    );

    // Divide texto em palavras para streaming
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      yield (i > 0 ? " " : "") + words[i];

      // Delay variável entre palavras (50-150ms) para simular digitação natural
      if (i < words.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 50 + Math.random() * 100)
        );
      }
    }
  }
}
