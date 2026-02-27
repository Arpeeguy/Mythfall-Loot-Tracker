const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_ancientruins")
    .setDescription("Log a drop from Ancient Ruins")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Graviton Shard", value: "Graviton Shard" },
          { name: "Artificer's Goggles", value: "Artificer's Goggles" },
          { name: "Artificer's Rucksack", value: "Artificer's Rucksack" },
          { name: "Dexterity Crystal", value: "Dexterity Crystal" },
          { name: "Ancient Egg", value: "Ancient Egg" },
          { name: "Antibind Manual (Pg 1)", value: "Antibind Manual (Pg 1)" },
          { name: "Antibind Manual (Pg 2)", value: "Antibind Manual (Pg 2)" },
          { name: "Antibind Manual (Pg 3)", value: "Antibind Manual (Pg 3)" }
        )
    )
    .addIntegerOption(option =>
      option.setName("quantity")
        .setDescription("How many drops to log")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    ),

  async execute(interaction) {
    const item = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity");
    const user = interaction.user.username;
    const logPath = path.join(__dirname, "../data/drops.log");

    const timestamp = new Date().toISOString();
    const logLines = Array(quantity)
      .fill(`${timestamp} | ${user} | Ancient Ruins | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Ancient Ruins`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
