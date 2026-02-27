const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("globaldrops")
    .setDescription("View total drops received across all dungeons"),

  async execute(interaction) {
    const logPath = path.join(__dirname, "../data/drops.log");
    const logLines = fs.readFileSync(logPath, "utf-8").trim().split("\n");

    const dungeonMap = {};

    for (const line of logLines) {
      const [, , dungeon, item] = line.split("|").map(s => s.trim());
      if (!dungeonMap[dungeon]) dungeonMap[dungeon] = {};
      if (!dungeonMap[dungeon][item]) dungeonMap[dungeon][item] = 0;
      dungeonMap[dungeon][item]++;
    }

    const dungeonNames = Object.keys(dungeonMap).sort();

    await interaction.reply({
      content: `📦 Total drops received across all dungeons:`,
      ephemeral: true
    });

    for (const dungeon of dungeonNames) {
      const items = dungeonMap[dungeon];
      const lines = Object.entries(items)
        .map(([item, count]) => `• ${item}: ${count}`)
        .join("\n");

      const message = `📍 **${dungeon}**\n${lines}`;
      await interaction.followUp({ content: message, ephemeral: true });
    }
  }
};
