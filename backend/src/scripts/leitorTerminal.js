// leitorTerminal.js
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Necessário para simular __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const caminhoArquivo = path.resolve(__dirname, 'usuarios.json');

rl.question('Digite o nome: ', (nome) => {
  rl.question('Digite a idade: ', (idade) => {
    const novoUsuario = { nome, idade: parseInt(idade) };

    try {
      let usuarios = [];

      if (fs.existsSync(caminhoArquivo)) {
        const dados = fs.readFileSync(caminhoArquivo, 'utf8');
        usuarios = JSON.parse(dados);
      }

      usuarios.push(novoUsuario);
      fs.writeFileSync(caminhoArquivo, JSON.stringify(usuarios, null, 2));

      console.log('\n✅ Usuário salvo com sucesso!');
      console.log('👥 Lista de todos os usuários:');
      console.log(usuarios);

      const maiores = usuarios.filter((u) => u.idade >= 18);
      console.log('\n🧑‍🦱 Usuários com 18 anos ou mais:');
      console.log(maiores);

    } catch (erro) {
      console.error('❌ Erro ao salvar o arquivo:', erro.message);
    } finally {
      rl.close();
    }
  });
});
