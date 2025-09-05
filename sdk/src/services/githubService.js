/**
 * Serviço para integração com a API do GitHub
 * 
 * Busca informações detalhadas dos repositórios do usuário,
 * incluindo metadados, tecnologias, README e estatísticas.
 * Implementa cache para otimizar performance e reduzir requisições.
 */
export class GitHubService {
  /** @private {string} URL base da API do GitHub */
  baseUrl;
  /** @private {string} Nome de usuário do GitHub */
  username;
  /** @private {Map} Cache de respostas da API */
  cache;

  /**
   * Inicializa o serviço com configurações padrão
   */
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.username = 'lukasdevjobs1';
    this.cache = new Map();
  }

  /**
   * Busca detalhes completos de um repositório
   * 
   * Coleta informações de múltiplos endpoints da API:
   * - Dados básicos do repositório
   * - Linguagens/tecnologias utilizadas
   * - Conteúdo do README
   * 
   * @param {string} repoName - Nome do repositório
   * @returns {Promise<Object|null>} Detalhes do projeto ou null se não encontrado
   */
  async getRepositoryDetails(repoName) {
    const cacheKey = `repo_${repoName}`;
    
    // Verifica cache (válido por 10 minutos)
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      // Busca metadados do repositório
      const repoResponse = await fetch(`${this.baseUrl}/repos/${this.username}/${repoName}`);
      if (!repoResponse.ok) {
        throw new Error(`Repository not found: ${repoName}`);
      }
      const repoData = await repoResponse.json();

      // Busca linguagens/tecnologias utilizadas
      const languagesResponse = await fetch(`${this.baseUrl}/repos/${this.username}/${repoName}/languages`);
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};

      // Busca conteúdo do README
      let readmeContent = '';
      try {
        const readmeResponse = await fetch(`${this.baseUrl}/repos/${this.username}/${repoName}/readme`);
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          // Decodifica conteúdo base64
          readmeContent = atob(readmeData.content.replace(/\n/g, ''));
        }
      } catch (error) {
        console.log(`No README found for ${repoName}`);
      }

      // Monta objeto com todos os detalhes
      const projectDetails = {
        name: repoData.name,
        description: repoData.description || 'Sem descrição',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language,
        languages: languages,
        size: repoData.size,
        created: repoData.created_at,
        updated: repoData.updated_at,
        homepage: repoData.homepage,
        topics: repoData.topics || [],
        readme: readmeContent.substring(0, 2000), // Limita tamanho do README
        url: repoData.html_url,
        isForked: repoData.fork
      };

      // Armazena no cache com timestamp
      this.cache.set(cacheKey, {
        data: projectDetails,
        timestamp: Date.now()
      });

      return projectDetails;
    } catch (error) {
      console.error(`Error fetching repository ${repoName}:`, error);
      return null;
    }
  }

  /**
   * Busca lista de todos os repositórios do usuário
   * 
   * @returns {Promise<Array>} Lista de repositórios ou array vazio se falhar
   */
  async getAllRepositories() {
    const cacheKey = 'all_repos';
    
    // Verifica cache (válido por 10 minutos)
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      // Busca repositórios ordenados por última atualização
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos?per_page=100&sort=updated`);
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const repos = await response.json();
      
      // Armazena no cache
      this.cache.set(cacheKey, {
        data: repos,
        timestamp: Date.now()
      });

      return repos;
    } catch (error) {
      console.error('Error fetching all repositories:', error);
      return [];
    }
  }

  /**
   * Formata informações do projeto para exibição
   * 
   * Cria texto formatado em Markdown com:
   * - Metadados básicos (nome, descrição, stats)
   * - Tecnologias utilizadas
   * - Datas de criação e atualização
   * - Links e tags
   * - Resumo do README
   * 
   * @param {Object|null} projectDetails - Detalhes do projeto
   * @returns {string} Texto formatado para exibição
   */
  formatProjectInfo(projectDetails) {
    if (!projectDetails) return 'Projeto não encontrado.';

    // Processa lista de linguagens
    const languagesList = Object.keys(projectDetails.languages).join(', ') || projectDetails.language || 'Não especificado';
    const createdDate = new Date(projectDetails.created).toLocaleDateString('pt-BR');
    const updatedDate = new Date(projectDetails.updated).toLocaleDateString('pt-BR');

    // Monta informações formatadas
    let info = `**${projectDetails.name}** ${projectDetails.isForked ? '(Fork)' : '(Original)'}\n`;
    info += `📝 ${projectDetails.description}\n`;
    info += `⭐ ${projectDetails.stars} stars | 🍴 ${projectDetails.forks} forks\n`;
    info += `💻 Tecnologias: ${languagesList}\n`;
    info += `📅 Criado: ${createdDate} | Atualizado: ${updatedDate}\n`;
    
    // Adiciona homepage se disponível
    if (projectDetails.homepage) {
      info += `🌐 Site: ${projectDetails.homepage}\n`;
    }
    
    // Adiciona tags se disponíveis
    if (projectDetails.topics.length > 0) {
      info += `🏷️ Tags: ${projectDetails.topics.join(', ')}\n`;
    }

    info += `🔗 GitHub: ${projectDetails.url}\n`;

    // Adiciona resumo do README se disponível
    if (projectDetails.readme && projectDetails.readme.length > 100) {
      info += `\n📖 **Sobre o projeto:**\n${projectDetails.readme.substring(0, 500)}...\n`;
    }

    return info;
  }
}