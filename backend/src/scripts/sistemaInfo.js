// sistemaInfo.js
import os from 'os';

console.log('🔍 Informações do sistema:\n');

console.log('🖥️ Sistema operacional:', os.type());
console.log('⏱️ Tempo de atividade da máquina (segundos):', os.uptime());
console.log('💾 Memória total (bytes):', os.totalmem());
console.log('📂 Memória livre (bytes):', os.freemem());
