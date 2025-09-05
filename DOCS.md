# 📚 DOCUMENTAÇÃO DO PORTFOLIO

## 🎯 Visão Geral

Portfolio moderno e responsivo inspirado no design do **Cursor**, desenvolvido para apresentar projetos, habilidades e informações profissionais de forma atrativa e interativa.

## 🏗️ Arquitetura do Projeto

```
lukasdevjobs1/
├── 📄 index.html          # Página principal
├── 🎨 styles.css          # Estilos CSS modernos
├── ⚡ script.js           # JavaScript interativo
├── 🤖 botData/            # Dados do chatbot
│   └── projectsCatalog.json
├── 🔧 sdk/                # SDK do chatbot
└── 📚 DOCS.md             # Esta documentação
```

## 🎨 Design System

### Paleta de Cores
```css
--bg-primary: #0a0a0a      /* Fundo principal */
--accent-blue: #007aff     /* Azul iOS */
--accent-purple: #5856d6   /* Roxo complementar */
--text-primary: #ffffff    /* Texto principal */
--gradient: linear-gradient(135deg, #007aff 0%, #5856d6 100%)
```

### Tipografia
- **Fonte**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Hierarquia**: H1 (6rem) → H2 (2.5rem) → H3 (1.25rem)

## 🧩 Componentes Principais

### 1. Header (`<header class="header">`)
- **Função**: Navegação fixa no topo
- **Recursos**: 
  - Menu desktop horizontal
  - Menu mobile (hamburger)
  - Efeito glass (backdrop-filter)
  - Transições suaves

### 2. Hero Section (`<section id="home">`)
- **Função**: Apresentação principal
- **Elementos**:
  - Nome com gradiente
  - Descrição profissional
  - Call-to-Action button
  - Animações de entrada

### 3. Projects Grid (`<div class="projects-grid">`)
- **Função**: Showcase de projetos
- **Recursos**:
  - Cards interativos
  - Carregamento dinâmico via JSON
  - Links para GitHub e demos
  - Tags de tecnologias

### 4. Tech Categories (`<div class="tech-grid">`)
- **Função**: Habilidades técnicas
- **Organização**:
  - Frontend, Backend, IA, Cloud
  - Níveis de proficiência
  - Projetos relacionados

## ⚡ JavaScript - Funcionalidades

### Classe Principal: `PortfolioApp`

```javascript
class PortfolioApp {
    constructor()           // Inicialização
    async loadProjects()    // Carrega dados JSON
    setupNavigation()       // Configura menu
    showSection()          // Navegação SPA
    renderProjects()       // Renderiza projetos
    renderTechnologies()   // Renderiza skills
}
```

### Fluxo de Execução
1. **Inicialização** → Carrega dados do `projectsCatalog.json`
2. **Navegação** → Sistema SPA (Single Page Application)
3. **Renderização** → Conteúdo dinâmico baseado em dados
4. **Interatividade** → Animações e efeitos hover

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 1024px (layout completo)
- **Tablet**: 768px - 1024px (grid adaptado)
- **Mobile**: < 768px (menu hamburger, layout vertical)

### Estratégias Mobile
- Menu hamburger com slide animation
- Grid de 1 coluna em telas pequenas
- Fontes e espaçamentos reduzidos
- Touch-friendly buttons (44px mínimo)

## 🎭 Animações e Efeitos

### CSS Animations
```css
@keyframes fadeInUp     /* Entrada de elementos */
@keyframes slideDown    /* Menu mobile */
@keyframes pulse        /* Chat indicator */
```

### Hover Effects
- **Cards**: `translateY(-5px)` + box-shadow
- **Buttons**: Gradiente + transform
- **Links**: Color transitions

### Scroll Effects
- Header background opacity
- Intersection Observer para animações
- Smooth scroll navigation

## 🔧 Configuração e Uso

### 1. Servidor Local
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code Live Server
# Extensão: Live Server
```

### 2. Personalização

#### Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --accent-blue: #sua-cor;
    --gradient: linear-gradient(135deg, #cor1, #cor2);
}
```

#### Conteúdo
Modifique `botData/projectsCatalog.json`:
```json
{
    "projects": [...],
    "technologies": {...},
    "stats": {...}
}
```

#### Textos
Edite diretamente no `index.html`:
```html
<h1>Seu Nome</h1>
<p>Sua descrição</p>
```

## 🚀 Performance

### Otimizações Implementadas
- **CSS**: `will-change` para elementos animados
- **JS**: Event delegation e debouncing
- **Images**: Lazy loading (quando aplicável)
- **Fonts**: System fonts para carregamento rápido

### Métricas Alvo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔮 Funcionalidades Futuras

### Planejadas
- [ ] Tema claro/escuro toggle
- [ ] Filtros de projetos por tecnologia
- [ ] Animações mais elaboradas (GSAP)
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)

### Melhorias Técnicas
- [ ] TypeScript migration
- [ ] CSS-in-JS ou Styled Components
- [ ] Build process (Webpack/Vite)
- [ ] Testing (Jest + Testing Library)

## 🐛 Troubleshooting

### Problemas Comuns

**1. Projetos não carregam**
- Verifique se `projectsCatalog.json` existe
- Confirme se servidor está rodando
- Veja console para erros de CORS

**2. Menu mobile não funciona**
- Verifique se JavaScript está carregando
- Confirme IDs dos elementos (`mobile-menu`, `mobile-nav`)

**3. Animações não funcionam**
- Verifique suporte do browser para CSS animations
- Confirme se `prefers-reduced-motion` não está ativo

## 📞 Suporte

Para dúvidas ou melhorias:
- **GitHub**: Issues no repositório
- **Email**: luk.devjobs@gmail.com
- **LinkedIn**: [Lukas Gomes](https://www.linkedin.com/in/lukas-gomes-4470a2269/)

---

**Desenvolvido com ❤️ e ☕ por Lukas Gomes**