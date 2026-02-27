const chokidar = require("chokidar");
const { execSync } = require("child_process");
const git = require("simple-git")();
const path = require("path");
const fs = require("fs");

const logPath = path.join(__dirname, "../data/drops.log");

const dungeons = [
  { name: "Pirate Cove", json: "piratecove.json" },
  { name: "Coolcrab Grotto", json: "coolcrabgrotto.json" },
  { name: "Luminous Cavern", json: "luminouscavern.json" },
  { name: "Eldertree Thicket", json: "eldertreethicket.json" },
  { name: "Stoneheart Forest", json: "stoneheartforest.json" },
  { name: "Goopy Grove", json: "goopygrove.json" },
  { name: "Lorendel's Garden", json: "lorendelsgarden.json" },
  { name: "Ancient Ruins", json: "ancientruins.json" },
  { name: "Gorthan's Labyrinth", json: "gorthanslabyrinth.json" },
  { name: "Alivarg's Tower", json: "alivargstower.json" },
  { name: "Temple of Anubis", json: "templeofanubis.json" },
  { name: "Scorpion Pit", json: "scorpionpit.json" },
  { name: "Grug Pit", json: "grugpit.json" },
  { name: "The Hanging Temple", json: "thehangingtemple.json" },
  { name: "Volcanic Mines", json: "volcanicmines.json" },
  { name: "Succubus Lair", json: "succubuslair.json" },
  { name: "Volcanic Core", json: "volcaniccore.json" },
  { name: "Chamber of the Awakened", json: "chamberoftheawakened.json" },
  { name: "Necromancer's Garden", json: "necromancersgarden.json" }
];

const pushQueue = [];
let isProcessing = false;
let lastLineCount = 0;

function getNewDungeons() {
  try {
    const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n");
    const newLines = lines.slice(lastLineCount);
    lastLineCount = lines.length;

    const dungeonsLogged = newLines
      .map(line => line.split("|")[2]?.trim())
      .filter(Boolean);

    return [...new Set(dungeonsLogged)];
  } catch (err) {
    console.error("❌ Failed to read drops.log:", err);
    return [];
  }
}

async function regenerateStats(dungeon, jsonFile) {
  try {
    execSync(`node scripts/generateStats.js "${dungeon}"`, { stdio: "inherit" });
    console.log(`✅ Stats regenerated for ${dungeon}`);

    const statsPath = path.join(__dirname, "..", "data", jsonFile);
    console.log(`📁 Committing ${statsPath}`);

    await git.pull("origin", "main");
    await git.add(statsPath);
    await git.commit(`Auto-update ${dungeon} stats`);
    await git.push("origin", "main");

    console.log(`🚀 Pushed ${dungeon} stats to GitHub`);
  } catch (err) {
    console.error(`❌ Git push failed for ${dungeon}:`, err);
  }
}

async function processQueue() {
  if (isProcessing || pushQueue.length === 0) return;

  isProcessing = true;
  const dungeon = pushQueue.shift();
  const entry = dungeons.find(d => d.name === dungeon);

  if (!entry) {
    console.warn(`⚠️ Unknown dungeon: ${dungeon}`);
    isProcessing = false;
    return processQueue();
  }

  await regenerateStats(entry.name, entry.json);
  isProcessing = false;
  processQueue();
}

chokidar.watch(logPath).on("change", () => {
  const newDungeons = getNewDungeons();
  for (const dungeon of newDungeons) {
    if (!pushQueue.includes(dungeon)) {
      pushQueue.push(dungeon);
      console.log(`📥 Queued push for ${dungeon}`);
    } else {
      console.log(`⏳ ${dungeon} already queued`);
    }
  }
  processQueue();
});
