# 🚀 Guia de Deploy para GitHub Pages

## Passo a Passo para Publicar seu Chat AI

### 1. Preparar o Repositório

```bash
# Criar novo repositório no GitHub
# Exemplo: profile-chat

# Clonar localmente
git clone https://github.com/seu-usuario/profile-chat.git
cd profile-chat

# Copiar arquivos necessários
cp -r github-profile-chat/* .
```

### 2. Estrutura Mínima para Deploy

Você precisa apenas destes arquivos no repositório:

```
profile-chat/
├── botData/
│   ├── avatar.webp
│   ├── chatbot-config.json
│   └── systemPrompt.txt
├── sdk/
│   ├── src/
│   │   ├── controllers/chatBotController.js
│   │   ├── views/chatBotView.js
│   │   ├── services/promptService.js
│   │   └── index.js
│   ├── ew-chatbot.css
│   └── ew-chatbot.html
└── index.html (opcional - para teste)
```

### 3. Configurar GitHub Pages

1. Vá para **Settings** do repositório
2. Navegue até **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Escolha **main** branch
5. Clique em **Save**

### 4. Testar a URL

Após alguns minutos, seu chat estará disponível em:
```
https://seu-usuario.github.io/profile-chat/
```

### 5. Integrar no seu Perfil

Adicione este código em qualquer página onde quiser o chat:

```html
<script type="module" src="https://seu-usuario.github.io/profile-chat/sdk/src/index.js"></script>
```

### 6. Para usar no README do GitHub

Infelizmente, o GitHub não permite JavaScript em README.md, mas você pode:

1. **Criar uma GitHub Page pessoal** (repositório `seu-usuario.github.io`)
2. **Adicionar o chat lá** e direcionar visitantes para essa página
3. **Usar em sites externos** que referenciem seu perfil

### 7. Exemplo de Integração

```html
<!DOCTYPE html>
<html>
<head>
    <title>Meu Perfil</title>
</head>
<body>
    <h1>Bem-vindo ao meu perfil!</h1>
    <p>Converse comigo através do chat AI no canto da tela!</p>
    
    <!-- Chat AI -->
    <script type="module" src="https://seu-usuario.github.io/profile-chat/sdk/src/index.js"></script>
</body>
</html>
```

### 8. Personalização Rápida

Edite apenas estes arquivos para personalizar:

- `botData/chatbot-config.json` - Cores, nome, mensagens
- `botData/systemPrompt.txt` - Comportamento do assistente
- `botData/avatar.webp` - Sua foto/avatar

### 9. Comandos Git para Deploy

```bash
# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adicionar chat AI ao perfil"

# Push para GitHub
git push origin main
```

### 10. Verificar Funcionamento

1. Acesse sua URL do GitHub Pages
2. Verifique se o chat aparece no canto inferior direito
3. Teste no Chrome com as flags ativadas:
   - `chrome://flags/#prompt-api-for-gemini-nano`

## 🔧 Troubleshooting

**Chat não aparece?**
- Verifique se todos os arquivos foram enviados
- Confirme se o GitHub Pages está ativo
- Teste a URL diretamente

**Erro de CORS?**
- Certifique-se de que está acessando via HTTPS
- GitHub Pages serve automaticamente via HTTPS

**IA não responde?**
- Verifique se está usando Chrome
- Confirme se as flags experimentais estão ativas
- Reinicie o navegador após ativar as flags

## 📝 URLs de Exemplo

- **Repositório**: `https://github.com/lukasdevjobs1/profile-chat`
- **GitHub Pages**: `https://lukasdevjobs1.github.io/profile-chat/`
- **Integração**: `<script src="https://lukg.github.io/profile-chat/sdk/src/index.js"></script>`
