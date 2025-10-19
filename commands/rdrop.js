const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“|”/g, '"')
    .replace(/[^a-z0-9 ]/gi, "") // remove punctuation
    .trim();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rdrop")
    .setDescription("Remove a drop you've logged")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item to remove")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("quantity")
        .setDescription("How many drops to remove")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    ),

  async execute(interaction) {
    const rawItem = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity");
    const user = interaction.user.username;
    const logPath = path.join(__dirname, "../data/drops.log");

    const target = normalize(rawItem);

    let logData;
    try {
      logData = fs.readFileSync(logPath, "utf8");
    } catch (err) {
      console.error("❌ Failed to read drops.log:", err);
      return interaction.reply({ content: "Failed to read drop history.", ephemeral: true });
    }

    const lines = logData.split("\n");
    const retained = [];
    let removed = 0;

    for (const line of lines) {
      const parts = line.split(" | ");
      if (parts.length < 4) {
        retained.push(line);
        continue;
      }

      const [timestamp, username, dungeon, item] = parts;
      const normalizedItem = normalize(item);

      if (
        removed < quantity &&
        username === user &&
        normalizedItem === target
      ) {
        removed++;
        continue; // skip this line
      }

      retained.push(line);
    }

    if (removed === 0) {
      return interaction.reply({
        content: `You haven't logged any "${rawItem}" drops to remove.`,
        ephemeral: true
      });
    }

    try {
      fs.writeFileSync(logPath, retained.join("\n"));
    } catch (err) {
      console.error("❌ Failed to update drops.log:", err);
      return interaction.reply({ content: "Failed to update drop history.", ephemeral: true });
    }

    interaction.reply({
      content: `🗑️ Removed ${removed}x "${rawItem}" from your drop history.`,
      ephemeral: true
    });
  }
};
