const fs = require('fs');
const path = require('path');

const dungeon = process.argv[2]; // e.g. "Pirate Cove"
if (!dungeon) {
  console.error("❌ Please provide a dungeon name.");
  process.exit(1);
}

const logPath = path.join(__dirname, '..', 'data', 'drops.log');
if (!fs.existsSync(logPath)) {
  console.error("❌ drops.log not found.");
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
const filtered = lines.filter(line => line.includes(`| ${dungeon} |`));

const total = filtered.length;
const counts = {};

filtered.forEach(line => {
  const parts = line.split('|').map(p => p.trim());
  const item = parts[3];
  counts[item] = (counts[item] || 0) + 1;
});

const stats = {};
for (const [item, count] of Object.entries(counts)) {
  const rate = ((count / total) * 100).toFixed(2);
  stats[item] = { count, rate: parseFloat(rate) };
}

console.log(JSON.stringify(stats, null, 2));
