const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/’|‘/g, "'")
    .replace(/“|”/g, '"')
    .replace(/[^a-z0-9 ]/gi, "")
    .trim();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rdrop")
    .setDescription("Remove a drop you've logged")
    .addStringOption(option =>
      option.setName("dungeon")
        .setDescription("Select the dungeon")
        .setRequired(true)
        .addChoices(
          { name: "Pirate Cove", value: "Pirate Cove" },
          { name: "Coolcrab Grotto", value: "Coolcrab Grotto" },
          { name: "Luminous Cavern", value: "Luminous Cavern" },
          { name: "Eldertree Thicket", value: "Eldertree Thicket" },
          { name: "Stoneheart Forest", value: "Stoneheart Forest" },
          { name: "Goopy Grove", value: "Goopy Grove" },
          { name: "Lorendel's Garden", value: "Lorendel's Garden" },
          { name: "Ancient Ruins", value: "Ancient Ruins" },
          { name: "Gorthan's Labyrinth", value: "Gorthan's Labyrinth" },
          { name: "Alivarg's Tower", value: "Alivarg's Tower" },
          { name: "Temple of Anubis", value: "Temple of Anubis" },
          { name: "Scorpion Pit", value: "Scorpion Pit" },
          { name: "Grug Pit", value: "Grug Pit" },
          { name: "The Hanging Temple", value: "The Hanging Temple" },
          { name: "Volcanic Mines", value: "Volcanic Mines" },
          { name: "Succubus Lair", value: "Succubus Lair" },
          { name: "Volcanic Core", value: "Volcanic Core" },
          { name: "Chamber of the Awakened", value: "Chamber of the Awakened" },
          { name: "Necromancer's Garden", value: "Necromancer's Garden" }
        )
    )
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
    const rawDungeon = interaction.options.getString("dungeon");
    const rawItem = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity");
    const user = interaction.user.username;
    const logPath = path.join(__dirname, "../data/drops.log");

    const targetItem = normalize(rawItem);
    const targetDungeon = normalize(rawDungeon);

    let logData;
    try {
      logData = fs.readFileSync(logPath, "utf8");
    } catch (err) {
      console.error("❌ Failed to read drops.log:", err);
      return interaction.reply({ content: "Failed to read drop history.", ephemeral: true });
    }

    const lines = logData.split("\n").filter(Boolean);
    const retained = [];
    let removed = 0;

    for (const line of lines) {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length < 4) {
        retained.push(line);
        continue;
      }

      const [timestamp, username, dungeon, item] = parts;

      if (
        removed < quantity &&
        username === user &&
        normalize(dungeon) === targetDungeon &&
        normalize(item) === targetItem
      ) {
        removed++;
        continue;
      }

      retained.push(line);
    }

    if (removed === 0) {
      return interaction.reply({
        content: `You haven't logged any "${rawItem}" drops from "${rawDungeon}" to remove.`,
        ephemeral: true
      });
    }

    try {
      fs.writeFileSync(logPath, retained.join("\n") + "\n", "utf8");
    } catch (err) {
      console.error("❌ Failed to update drops.log:", err);
      return interaction.reply({ content: "Failed to update drop history.", ephemeral: true });
    }

    interaction.reply({
      content: `🗑️ Removed ${removed}x "${rawItem}" from "${rawDungeon}" in your drop history.`,
      ephemeral: true
    });
  }
};
