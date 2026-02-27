const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_succubuslair")
    .setDescription("Log a drop from Succubus Lair")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Vitality Crystal", value: "Vitality Crystal" },
          { name: "Demon Heart", value: "Demon Heart" },
          { name: "Demonic Corset", value: "Demonic Corset" },
          { name: "Bloodkiss Cloak", value: "Bloodkiss Cloak" },
          { name: "Demon Egg", value: "Demon Egg" },
          { name: "Bloodletting Ritual (Pg 1)", value: "Bloodletting Ritual (Pg 1)" },
          { name: "Bloodletting Ritual (Pg 2)", value: "Bloodletting Ritual (Pg 2)" },
          { name: "Bloodletting Ritual (Pg 3)", value: "Bloodletting Ritual (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | Succubus Lair | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Succubus Lair`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
