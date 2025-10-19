const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("globaldroprates")
    .setDescription("View drop rates for all dungeons"),

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

      if (!dungeonStats[dungeon]) dungeonStats[dungeon] = { total: 0, items: {} };
      dungeonStats[dungeon].total++;
      dungeonStats[dungeon].items[item] = (dungeonStats[dungeon].items[item] || 0) + 1;
    }

    const sections = Object.entries(dungeonStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dungeon, { total, items }]) => {
        const sortedItems = Object.entries(items)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([item, count]) => {
            const rate = ((count / total) * 100).toFixed(2);
            return `• ${item}: ${count} (${rate}%)`;
          })
          .join("\n");

        return `📍 **${dungeon}**\n${sortedItems}`;
      });

    const reply = sections.join("\n\n");

    interaction.reply({
      content: `📊 Drop rates across all dungeons:\n\n${reply}`,
      ephemeral: true
    });
  }
};
