/**
 * Serviço para gerenciamento do catálogo de projetos
 * 
 * Carrega e organiza informações sobre projetos e tecnologias
 * a partir de arquivo JSON estático. Fornece métodos para:
 * - Buscar projetos por tecnologia
 * - Obter informações de tecnologias
 * - Acessar estatísticas gerais
 */
class CatalogService {
    /** @private {Object|null} Dados do catálogo carregado */
    catalog;

    /**
     * Inicializa o serviço e carrega catálogo
     */
    constructor() {
        this.catalog = null;
        this.loadCatalog();
    }

    /**
     * Carrega catálogo de projetos do arquivo JSON
     * 
     * @private
     */
    async loadCatalog() {
        try {
            const response = await fetch('./botData/projectsCatalog.json');
            this.catalog = await response.json();
        } catch (error) {
            console.error('Erro ao carregar catálogo:', error);
        }
    }

    /**
     * Busca projetos que utilizam uma tecnologia específica
     * 
     * @param {string} tech - Nome da tecnologia
     * @returns {Array} Lista de projetos que usam a tecnologia
     */
    getProjectsByTechnology(tech) {
        if (!this.catalog) return [];
        
        const projects = [];
        const techLower = tech.toLowerCase();
        
        this.catalog.projects.forEach(project => {
            if (project.technologies.some(t => t.toLowerCase().includes(techLower))) {
                projects.push(project);
            }
        });
        
        return projects;
    }

    /**
     * Obtém informações detalhadas de uma tecnologia
     * 
     * @param {string} tech - Nome da tecnologia
     * @returns {Object|null} Informações da tecnologia ou null se não encontrada
     */
    getTechnologyInfo(tech) {
        if (!this.catalog) return null;
        
        const techLower = tech.toLowerCase();
        const categories = ['frontend', 'backend', 'cloud', 'tools'];
        
        // Busca em todas as categorias de tecnologia
        for (const category of categories) {
            const techs = this.catalog.technologies[category];
            for (const [key, value] of Object.entries(techs)) {
                if (key.toLowerCase() === techLower) {
                    return { ...value, category, name: key };
                }
            }
        }
        
        return null;
    }

    /**
     * Retorna lista completa de projetos
     * 
     * @returns {Array} Todos os projetos do catálogo
     */
    getAllProjects() {
        return this.catalog?.projects || [];
    }

    /**
     * Retorna estatísticas gerais do portfólio
     * 
     * @returns {Object} Estatísticas do catálogo
     */
    getStats() {
        return this.catalog?.stats || {};
    }
}

export default CatalogService;