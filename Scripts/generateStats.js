const fs = require("fs");
const path = require("path");

const dungeonName = process.argv[2];
if (!dungeonName) {
  console.error("Please provide a dungeon name.");
  process.exit(1);
}

const sanitize = str => str.toLowerCase().replace(/[^a-z0-9]/gi, "");
const logPath = path.join(__dirname, "..", "data", "drops.log");
const outputPath = path.join(__dirname, "..", "data", `${sanitize(dungeonName)}.json`);

if (!fs.existsSync(logPath)) {
  console.error("Missing data/drops.log file.");
  process.exit(1);
}

const lines = fs.readFileSync(logPath, "utf8").split("\n").filter(Boolean);

const filtered = lines
  .map(line => {
    const parts = line.split("|").map(p => p.trim());
    if (parts.length !== 4) {
      console.warn(`⚠️ Skipping malformed line: ${line}`);
      return null;
    }
    const [timestamp, user, dungeon, drop] = parts;
    return { dungeon, drop };
  })
  .filter(entry => entry && entry.dungeon === dungeonName);

const total = filtered.length;
const counts = {};

for (const entry of filtered) {
  const drop = entry.drop;
  if (!counts[drop]) counts[drop] = 0;
  counts[drop]++;
}

const stats = {};
for (const [drop, count] of Object.entries(counts)) {
  const rate = ((count / total) * 100).toFixed(1);
  stats[drop] = { count, rate: parseFloat(rate) };
}

const sortedStats = Object.entries(stats)
  .sort((a, b) => b[1].rate - a[1].rate)
  .reduce((obj, [drop, data]) => {
    obj[drop] = data;
    return obj;
  }, {});

const output = {
  dungeon: dungeonName,
  totalDrops: total,
  items: sortedStats
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), { encoding: "utf8" });
console.log(`✅ Stats written to ${outputPath}`);
