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

    // Configuração padrão para modo proxy (produção)
    this.config = {
      groq: {
        apiKey: "proxy_mode", // Não usado em produção (proxy handle isso)
        model: "llama-3.1-8b-instant",
        baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      },
    };

    // Não tenta mais carregar arquivo de configuração
    // Usa apenas configuração padrão
    console.log('Usando configuração padrão (sem arquivo)');

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

    // GitHub Pages não suporta APIs, usa Vercel
    const apiUrl = isProduction
      ? 'https://profile-chat.vercel.app/api/chat' // Vercel API
      : this.config.groq.baseUrl; // API direta (desenvolvimento)

    let ambiente = "Local";
    if (isGitHubPages) ambiente = "GitHub Pages";
    if (isVercel) ambiente = "Vercel";

    console.log("Ambiente:", ambiente);
    console.log("URL da API:", apiUrl);
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
      console.log("isProduction:", isProduction);
      console.log("apiKey:", this.config.groq.apiKey);
      console.log(
        "apiKey !== proxy_mode:",
        this.config.groq.apiKey !== "proxy_mode"
      );

      // Adiciona Authorization apenas se não for produção (proxy)
      if (!isProduction && this.config.groq.apiKey !== "proxy_mode") {
        headers["Authorization"] = `Bearer ${this.config.groq.apiKey}`;
        console.log("Usando API key local");
      } else {
        console.log("Usando servidor proxy (sem API key)");
      }

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
        throw new Error(`Groq API error: ${response.status}`);
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
      console.error("Groq API error:", error);
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

    // Detecta cumprimentos
    if (textLower.match(/\b(oi|olá|hey|ola|e ai)\b/)) {
      return "Olá! Sou o assistente do Lukas, desenvolvedor junior em evolução de Fortaleza-CE! Posso falar sobre seus 13 repositórios, projetos com IA e tecnologias. O que você quer saber?";
    }

    // Detecta perguntas sobre projetos específicos
    if (
      textLower.includes("git_projects") ||
      textLower.includes("git-projects")
    ) {
      return "O Git_Projects é um repositório de aprendizado onde o Lukas está desenvolvendo algoritmos, interfaces gráficas e integrações. Inclui implementação de Fibonacci, GUI com Python e integração com GitHub API. Quer que eu busque os detalhes reais do repositório?";
    }

    // Detecta perguntas sobre chatbots
    if (textLower.includes("chatbot") || textLower.includes("bot")) {
      return "O Lukas tem 2 chatbots: este que você está usando (profile-chat) com sistema híbrido Chrome AI + Groq, e o semana-javascript-expert09 do desafio do Erick Wendel. Quer saber mais sobre algum?";
    }

    // Resposta padrão genérica
    return "Sou o assistente do Lukas Gomes! Posso falar sobre seus projetos, tecnologias (JavaScript, Python) e jornada como desenvolvedor. Mencione um projeto específico e eu busco os dados reais do GitHub! O que você quer saber?";
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
