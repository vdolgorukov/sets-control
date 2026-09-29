// Запуск: node tests/run.js — извлекает ядро и генератор из index.html и гоняет автотесты.
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const grab = id => { const m = new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>').exec(html); if (!m) throw new Error('нет скрипта ' + id); return m[1]; };
const sandbox = { console, Math, JSON }; sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(grab('set-core'), sandbox);
vm.runInContext(grab('set-gen'), sandbox);
const a = sandbox.SetCore.selfTest(), b = sandbox.SetGen.selfTest();
const all = a.results.concat(b.results);
for (const r of all) console.log((r.ok ? '✓ ' : '✗ ') + r.name + (r.detail ? ' — ' + r.detail : ''));
const passed = all.filter(r => r.ok).length;
console.log(`\nИтого: ${passed} из ${all.length}`);
process.exit(passed === all.length ? 0 : 1);
