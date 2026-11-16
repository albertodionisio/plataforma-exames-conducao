// Auditoria de estilo dos exames (só relatório; não falha). Uso: node scripts/auditar-estilo.js [N ...]
// Ver docs/GUIA-PERGUNTAS.md. Indica, por exame: artigos citados, enunciados «Segundo o Código…»,
// respostas certas que são as únicas mais longas, posições das respostas e enunciados curtos (sem situação).
const fs = require('fs'), path = require('path');
global.window = { EXAMES: {} };
const dir = path.join(__dirname, '..', 'data', 'exames');
const alvo = process.argv.slice(2).map(Number);
const ficheiros = fs.readdirSync(dir).filter(f => /^exame\d+\.js$/.test(f))
  .sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)));
console.log('Exame | artigos | «Segundo o Código» | certa+longa | posições A/B/C/D | enunciados curtos');
for (const f of ficheiros) {
  const n = parseInt(f.slice(5)); if (alvo.length && !alvo.includes(n)) continue;
  require(path.join(dir, f)); const E = window.EXAMES[n] || [];
  const txt = q => q.enunciado + ' ' + q.opcoes.join(' ') + ' ' + q.explicacao;
  const art = E.filter(q => /\bArt(igo|\.)|n\.º|alínea|Decreto/i.test(txt(q))).length;
  const seg = E.filter(q => /Código|Segundo (o|a)|De acordo com|nos termos/i.test(q.enunciado)).length;
  const lg = E.filter(q => { const L = q.opcoes.map(o => o.length), m = Math.max(...L); return L[q.correta] === m && L.filter(x => x === m).length === 1; }).length;
  const c = [0, 0, 0, 0]; E.forEach(q => c[q.correta]++);
  const curtos = E.filter(q => q.enunciado.length <= 90).length;
  const aviso = (art || seg || lg > 7) ? '  <-- rever' : '';
  console.log(`${String(n).padStart(5)} | ${String(art).padStart(7)} | ${String(seg).padStart(18)} | ${String(lg).padStart(11)} | ${c.join('/')} | ${curtos}${aviso}`);
}
