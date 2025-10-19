const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("globaldrops")
    .setDescription("View total drop counts for all dungeons"),

  async execute(interaction) {
    const logPath = path.join(__dirname, "../data/drops.log");

    let logData;
    try {
      logData = fs.readFileSync(logPath, "utf8");
    } catch (err) {
      console.error("❌ Failed to read drops.log:", err);
      return interaction.reply({ content: "Failed to read drop history.", ephemeral: true });
    }

    const lines = logData.split("\n").filter(line => line.trim() !== "");
    const dungeonStats = {};

    for (const line of lines) {
      const parts = line.split(" | ");
      if (parts.length < 4) continue;

      const dungeon = parts[2];
      const item = parts[3];

      if (!dungeonStats[dungeon]) dungeonStats[dungeon] = {};
      dungeonStats[dungeon][item] = (dungeonStats[dungeon][item] || 0) + 1;
    }

    const sections = Object.entries(dungeonStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dungeon, items]) => {
        const sortedItems = Object.entries(items)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([item, count]) => `• ${item}: ${count}`)
          .join("\n");

        return `📍 **${dungeon}**\n${sortedItems}`;
      });

    const reply = sections.join("\n\n");

    interaction.reply({
      content: `📦 Total drops received across all dungeons:\n\n${reply}`,
      ephemeral: true
    });
  }
};
