const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mydrops")
    .setDescription("View your personal drop history"),

  async execute(interaction) {
    const user = interaction.user.username;
    const logPath = path.join(__dirname, "../data/drops.log");

    let logData;
    try {
      logData = fs.readFileSync(logPath, "utf8");
    } catch (err) {
      console.error("❌ Failed to read drops.log:", err);
      return interaction.reply({ content: "Failed to read drop history.", ephemeral: true });
    }

    const lines = logData.split("\n").filter(line => line.includes(`| ${user} |`));
    if (lines.length === 0) {
      return interaction.reply({ content: "You haven't logged any drops yet.", ephemeral: true });
    }

    const grouped = {};

    for (const line of lines) {
      const parts = line.split(" | ");
      if (parts.length < 4) continue;

      const dungeon = parts[2];
      const item = parts[3];

      if (!grouped[dungeon]) grouped[dungeon] = {};
      grouped[dungeon][item] = (grouped[dungeon][item] || 0) + 1;
    }

    const dungeonNames = Object.keys(grouped).sort();

    await interaction.reply({
      content: `📜 Your drop history:`,
      ephemeral: true
    });

    for (const dungeon of dungeonNames) {
      const items = grouped[dungeon];
      const sortedItems = Object.entries(items)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([item, count]) => `• ${item}: ${count}`)
        .join("\n");

      const message = `📍 **${dungeon}**\n${sortedItems}`;
      await interaction.followUp({ content: message, ephemeral: true });
    }
  }
};
