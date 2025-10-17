const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'data', 'drops.log');
const outputPath = path.join(__dirname, '..', 'data', 'piratecove.json');

const dungeon = 'piratecove';
const counts = {};

const lines = fs.readFileSync(logPath, 'utf-8').split('\n').filter(Boolean);
const pirateDrops = lines.filter(line => line.includes(`| ${dungeon} |`));

pirateDrops.forEach(line => {
  const parts = line.split('|').map(p => p.trim());
  const item = parts[3];
  counts[item] = (counts[item] || 0) + 1;
});

const total = pirateDrops.length;
const result = {};

for (const [item, count] of Object.entries(counts)) {
  result[item] = {
    count,
    rate: parseFloat(((count / total) * 100).toFixed(2))
  };
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`✅ Pirate Cove stats written to ${outputPath}`);
