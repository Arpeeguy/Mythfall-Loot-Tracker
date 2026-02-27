const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_gorthanslabyrinth")
    .setDescription("Log a drop from Gorthan's Labyrinth")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Bullkin Egg", value: "Bullkin Egg" },
          { name: "Shackles", value: "Shackles" },
          { name: "Chipped Labrys", value: "Chipped Labrys" },
          { name: "Minotaur Horn", value: "Minotaur Horn" },
          { name: "Severing Tome (Pg 1)", value: "Severing Tome (Pg 1)" },
          { name: "Severing Tome (Pg 2)", value: "Severing Tome (Pg 2)" },
          { name: "Severing Tome (Pg 3)", value: "Severing Tome (Pg 3)" },
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
      .fill(`${timestamp} | ${user} | Gorthan's Labyrinth | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Gorthan's Labyrinth`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
