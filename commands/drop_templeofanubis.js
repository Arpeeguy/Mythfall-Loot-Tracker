const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_templeofanubis")
    .setDescription("Log a drop from Temple of Anubis")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Strength Crystal", value: "Strength Crystal" },
          { name: "Jackal Heart", value: "Jackal Heart" },
          { name: "Nemes", value: "Nemes" },
          { name: "Khopesh", value: "Khopesh" },
          { name: "Mummified Egg", value: "Mummified Egg" },
          { name: "Book of Death (Pg 1)", value: "Book of Death (Pg 1)" },
          { name: "Book of Death (Pg 2)", value: "Book of Death (Pg 2)" },
          { name: "Book of Death (Pg 3)", value: "Book of Death (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | Temple of Anubis | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Temple of Anubis`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
