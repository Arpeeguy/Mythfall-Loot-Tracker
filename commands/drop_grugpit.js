const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_grugpit")
    .setDescription("Log a drop from Grug Pit")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Skull Mask", value: "Skull Mask" },
          { name: "Grug's Skull Club", value: "Grug's Skull Club" },
          { name: "Executioner's Hood", value: "Executioner's Hood" },
          { name: "Orcish Egg", value: "Orcish Egg" },
          { name: "The Might of Grug (Pg 1)", value: "The Might of Grug (Pg 1)" },
          { name: "The Might of Grug (Pg 2)", value: "The Might of Grug (Pg 2)" },
          { name: "The Might of Grug (Pg 3)", value: "The Might of Grug (Pg 3)" },
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
      .fill(`${timestamp} | ${user} | Grug Pit | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Grug Pit`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
