const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_volcanicmines")
    .setDescription("Log a drop from Volcanic Mines")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Defense Crystal", value: "Defense Crystal" },
          { name: "Mining Helmet", value: "Mining Helmet" },
          { name: "Dwarven Ring", value: "Dwarven Ring" },
          { name: "Ore Bag", value: "Ore Bag" },
          { name: "Bearded Egg", value: "Bearded Egg" },
          { name: "Dwarven Drums (Pg 1)", value: "Dwarven Drums (Pg 1)" },
          { name: "Dwarven Drums (Pg 2)", value: "Dwarven Drums (Pg 2)" },
          { name: "Dwarven Drums (Pg 3)", value: "Dwarven Drums (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | Volcanic Mines | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Volcanic Mines`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
