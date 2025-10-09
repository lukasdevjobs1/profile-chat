// Script para atualizar repositórios do GitHub
async function fetchAllRepos() {
    try {
        console.log('🔍 Buscando repositórios do GitHub...');
        
        const response = await fetch('https://api.github.com/users/lukasdevjobs1/repos?per_page=100');
        const repos = await response.json();
        
        console.log(`📊 Encontrados ${repos.length} repositórios`);
        
        const repoData = repos.map(repo => ({
            name: repo.name,
            description: repo.description || 'Sem descrição',
            language: repo.language || 'N/A',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            fork: repo.fork,
            created: new Date(repo.created_at).getFullYear(),
            updated: new Date(repo.updated_at).toLocaleDateString('pt-BR')
        }));
        
        // Separa originais e forks
        const originals = repoData.filter(repo => !repo.fork);
        const forks = repoData.filter(repo => repo.fork);
        
        console.log(`✅ ${originals.length} originais, ${forks.length} forks`);
        
        // Gera contexto atualizado
        let context = `## PORTFÓLIO COMPLETO (${repos.length} repositórios):

### PROJETOS ORIGINAIS (${originals.length}):
`;
        
        originals.forEach((repo, index) => {
            const stars = repo.stars > 0 ? ` - ${repo.stars} star${repo.stars > 1 ? 's' : ''} ⭐` : '';
            const forks = repo.forks > 0 ? ` ${repo.forks} fork${repo.forks > 1 ? 's' : ''} 🍴` : '';
            context += `${index + 1}. **${repo.name}** (${repo.language})${stars}${forks}
   - ${repo.description}
   - Criado: ${repo.created}
   - URL: ${repo.url}
`;
        });
        
        if (forks.length > 0) {
            context += `
### PROJETOS ESTUDADOS (${forks.length} Forks):
`;
            forks.forEach(repo => {
                context += `- **${repo.name}** (${repo.language}) - ${repo.description}
`;
            });
        }
        
        // Extrai tecnologias únicas
        const languages = [...new Set(repos.map(r => r.language).filter(l => l))];
        context += `
## TECNOLOGIAS UTILIZADAS:
${languages.map(lang => `- ${lang}`).join('\n')}
`;
        
        console.log('\n📋 CONTEXTO ATUALIZADO:');
        console.log(context);
        
        return context;
        
    } catch (error) {
        console.error('❌ Erro ao buscar repositórios:', error);
        return null;
    }
}

// Executa se chamado diretamente
if (typeof window !== 'undefined') {
    fetchAllRepos();
}