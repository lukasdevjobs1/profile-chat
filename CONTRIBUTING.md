# 🤝 Contribuindo para Profile Chat

Obrigado por considerar contribuir para o Profile Chat! Este guia ajudará você a começar.

## 🚀 Como Contribuir

### 1. Fork o Projeto
```bash
git fork https://github.com/lukasdevjobs1/profile-chat.git
```

### 2. Clone seu Fork
```bash
git clone https://github.com/SEU_USUARIO/profile-chat.git
cd profile-chat
```

### 3. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### 4. Configure o Ambiente
```bash
# Copie o arquivo de configuração
cp botData/api-config.example.json botData/api-config.json

# Adicione sua API key do Groq
# Edite botData/api-config.json
```

### 5. Faça suas Alterações
- Mantenha o código limpo e bem documentado
- Siga os padrões existentes do projeto
- Teste suas alterações

### 6. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 7. Abra um Pull Request
- Descreva claramente suas alterações
- Referencie issues relacionadas
- Aguarde o review

## 📋 Diretrizes

### Código
- Use JavaScript ES6+
- Mantenha funções pequenas e focadas
- Comente código complexo
- Siga a estrutura MVC existente

### Commits
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Seja descritivo mas conciso
- Um commit por funcionalidade

### Issues
- Use templates quando disponíveis
- Seja específico sobre o problema
- Inclua passos para reproduzir bugs

## 🛠️ Desenvolvimento Local

```bash
# Servidor local
npm run dev
# ou
python -m http.server 8000
```

Acesse: `http://localhost:8000`

## 📞 Dúvidas?

Entre em contato:
- Email: luk.devjobs@gmail.com
- GitHub: @lukasdevjobs1