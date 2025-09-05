/**
 * Portfolio App - Gerenciador principal do site
 * 
 * Responsável por:
 * - Navegação entre seções (abas)
 * - Carregamento dinâmico de projetos
 * - Menu mobile responsivo
 * - Animações e interações
 */
class PortfolioApp {
    /**
     * Construtor da aplicação
     * Inicializa propriedades e chama método de inicialização
     */
    constructor() {
        this.currentSection = 'home';  // Seção ativa atual
        this.projects = [];            // Array de projetos carregados
        this.technologies = {};        // Objeto com tecnologias
        this.stats = {};              // Estatísticas do GitHub
        this.init();                  // Inicializa a aplicação
    }

    /**
     * Inicialização da aplicação
     * Executa todos os métodos necessários para configurar o site
     */
    async init() {
        await this.loadProjects();     // Carrega dados dos projetos
        this.setupNavigation();        // Configura navegação
        this.renderProjects();         // Renderiza cards de projetos
        this.renderTechnologies();     // Renderiza seção de tecnologias
        this.renderStats();           // Renderiza estatísticas
        this.setupScrollEffects();    // Configura efeitos de scroll
    }

    /**
     * Carrega dados dos projetos do arquivo JSON
     * 
     * Busca informações de:
     * - Projetos do GitHub
     * - Tecnologias e níveis de habilidade
     * - Estatísticas gerais
     * 
     * @async
     * @returns {Promise<void>}
     */
    async loadProjects() {
        try {
            const response = await fetch('./botData/projectsCatalog.json');
            const data = await response.json();
            
            // Armazena dados carregados
            this.projects = data.projects;         // Lista de projetos
            this.technologies = data.technologies; // Tecnologias por categoria
            this.stats = data.stats;              // Estatísticas do GitHub
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            // Em caso de erro, mantém arrays vazios para evitar crashes
        }
    }

    /**
     * Configura sistema de navegação
     * 
     * Funcionalidades:
     * - Navegação por abas (SPA - Single Page Application)
     * - Menu mobile responsivo
     * - Atualização de estados ativos
     */
    setupNavigation() {
        // Configura links de navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();                    // Previne comportamento padrão
                const section = link.dataset.section;  // Obtém seção do data-attribute
                this.showSection(section);             // Mostra seção selecionada
                this.updateActiveNav(link);            // Atualiza link ativo
                this.closeMobileMenu();                // Fecha menu mobile se aberto
            });
        });

        // Configura botão do menu mobile
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                // Toggle: abre/fecha menu mobile
                mobileNav.classList.toggle('active');
            });
        }

        // Mostra seção inicial (home)
        this.showSection('home');
    }

    /**
     * Fecha o menu mobile
     * Utilizado após navegação para melhor UX
     */
    closeMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            mobileNav.classList.remove('active');
        }
    }

    /**
     * Exibe seção específica e oculta as demais
     * 
     * @param {string} sectionName - Nome da seção a ser exibida
     */
    showSection(sectionName) {
        // Oculta todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Exibe seção selecionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Atualiza seção atual
        this.currentSection = sectionName;
    }

    /**
     * Atualiza estado visual do link ativo na navegação
     * 
     * @param {HTMLElement} activeLink - Link que deve ficar ativo
     */
    updateActiveNav(activeLink) {
        // Remove classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // Adiciona classe active ao link selecionado
        activeLink.classList.add('active');
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid || !this.projects) return;

        projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card" onclick="window.open('${project.url}', '_blank')">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <span class="project-status">${project.status}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.url}" class="project-link primary" target="_blank">
                        Ver Código
                    </a>
                    ${project.live_url ? 
                        `<a href="${project.live_url}" class="project-link" target="_blank">
                            Demo Live
                        </a>` : ''
                    }
                </div>
            </div>
        `).join('');
    }

    renderTechnologies() {
        const techGrid = document.getElementById('tech-grid');
        if (!techGrid || !this.technologies) return;

        const categories = Object.entries(this.technologies);
        
        techGrid.innerHTML = categories.map(([categoryName, techs]) => `
            <div class="tech-category">
                <h3>${this.formatCategoryName(categoryName)}</h3>
                ${Object.entries(techs).map(([techName, techData]) => `
                    <div class="tech-item">
                        <span class="tech-name">${techName}</span>
                        <span class="tech-level">${techData.level}</span>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    formatCategoryName(name) {
        const names = {
            'frontend': 'Frontend',
            'backend': 'Backend',
            'ai_chatbots': 'IA & Chatbots',
            'cloud': 'Cloud & Deploy',
            'tools': 'Ferramentas',
            'algorithms': 'Algoritmos'
        };
        return names[name] || name;
    }

    renderStats() {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid || !this.stats) return;

        const statsData = [
            { number: this.stats.totalRepositories, label: 'Repositórios' },
            { number: this.stats.originalProjects, label: 'Projetos Originais' },
            { number: this.stats.totalStars, label: 'Stars GitHub' },
            { number: this.stats.githubPagesProjects, label: 'Sites Publicados' }
        ];

        statsGrid.innerHTML = statsData.map(stat => `
            <div class="stat-card">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    setupScrollEffects() {
        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.8)';
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Utility functions for animations
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.project-card, .tech-category, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations after content loads
setTimeout(animateOnScroll, 500);