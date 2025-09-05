// Script para minificar o código do chatbot
const fs = require('fs');
const path = require('path');

// Função simples de minificação
function minifyJS(code) {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários
        .replace(/\/\/.*$/gm, '') // Remove comentários de linha
        .replace(/\s+/g, ' ') // Remove espaços extras
        .replace(/;\s*}/g, '}') // Remove ponto e vírgula antes de }
        .trim();
}

// Minifica todos os arquivos JS do SDK
const sdkPath = './sdk/src';
const outputPath = './sdk-min';

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

function processDirectory(dir, outputDir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const outputFilePath = path.join(outputDir, file);
        
        if (fs.statSync(filePath).isDirectory()) {
            if (!fs.existsSync(outputFilePath)) {
                fs.mkdirSync(outputFilePath);
            }
            processDirectory(filePath, outputFilePath);
        } else if (file.endsWith('.js')) {
            const code = fs.readFileSync(filePath, 'utf8');
            const minified = minifyJS(code);
            fs.writeFileSync(outputFilePath, minified);
            console.log(`Minificado: ${file}`);
        }
    });
}

processDirectory(sdkPath, outputPath);
console.log('Minificação concluída!');