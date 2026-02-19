import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Garante que você possa usar __dirname mesmo com import
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const caminhoArquivo = path.resolve(__dirname, 'usuarios.json');

try {
  if (fs.existsSync(caminhoArquivo)) {
    const dados = fs.readFileSync(caminhoArquivo, 'utf8');
    const usuarios = JSON.parse(dados);

    console.log('\n👥 Lista completa de usuários:');
    console.log(usuarios);

    const maioresDeIdade = usuarios.filter(u => u.idade >= 18);

    console.log('\n🧑‍🦱 Usuários maiores de idade (18+):');
    console.log(maioresDeIdade);
  } else {
    console.log('📁 Nenhum arquivo "usuarios.json" encontrado.');
  }
} catch (erro) {
  console.error('❌ Erro ao ler o arquivo:', erro.message);
}
