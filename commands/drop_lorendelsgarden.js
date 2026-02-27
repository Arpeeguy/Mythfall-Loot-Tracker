const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_lorendelsgarden")
    .setDescription("Log a drop from Lorendel's Garden")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Leafy Crown", value: "Leafy Crown" },
          { name: "Moonstone Essence", value: "Moonstone Essence" },
          { name: "Goldleaf Boots", value: "Goldleaf Boots" },
          { name: "Lorendel's Ring", value: "Lorendel's Ring" },
          { name: "Woodland Vest", value: "Woodland Vest" },
          { name: "Gilded Egg", value: "Gilded Egg" },
          { name: "Elven Tale (Pg 1)", value: "Elven Tale (Pg 1)" },
          { name: "Elven Tale (Pg 2)", value: "Elven Tale (Pg 2)" },
          { name: "Elven Tale (Pg 3)", value: "Elven Tale (Pg 3)" },
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
      .fill(`${timestamp} | ${user} | Lorendel's Garden | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Lorendel's Garden`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
