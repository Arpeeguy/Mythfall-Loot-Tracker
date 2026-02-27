const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_goopygrove")
    .setDescription("Log a drop from Goopy Grove")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Slime Heart", value: "Slime Heart" },
          { name: "Goopy Cape", value: "Goopy Cape" },
          { name: "Ring of Pain", value: "Ring of Pain" },
          { name: "Nightcap", value: "Nightcap" },
          { name: "Slimy Egg", value: "Slimy Egg" },
          { name: "Book of Slime (Pg 1)", value: "Book of Slime (Pg 1)" },
          { name: "Book of Slime (Pg 2)", value: "Book of Slime (Pg 2)" },
          { name: "Book of Slime (Pg 3)", value: "Book of Slime (Pg 3)" },
          { name: "Shard", value: "Shard" }
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
      .fill(`${timestamp} | ${user} | Goopy Grove | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Goopy Grove`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
