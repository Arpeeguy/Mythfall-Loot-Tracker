const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_thehangingtemple")
    .setDescription("Log a drop from The Hanging Temple")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Speed Crystal", value: "Speed Crystal" },
          { name: "Quarterstaff", value: "Quarterstaff" },
          { name: "Monk Hood", value: "Monk Hood" },
          { name: "Monk Robe", value: "Monk Robe" },
          { name: "Monk Shawl", value: "Monk Shawl" },
          { name: "Monk Boots", value: "Monk Boots" },
          { name: "Ring of Focus", value: "Ring of Focus" },
          { name: "Simple Egg", value: "Simple Egg" },
          { name: "Monk Aegis (Pg 1)", value: "Monk Aegis (Pg 1)" },
          { name: "Monk Aegis (Pg 2)", value: "Monk Aegis (Pg 2)" },
          { name: "Monk Aegis (Pg 3)", value: "Monk Aegis (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | The Hanging Temple | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from The Hanging Temple`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
