const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_chamberoftheawakened")
    .setDescription("Log a drop from Chamber of the Awakened")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Awakened Heart", value: "Awakened Heart" },
          { name: "Bone Dagger", value: "Bone Dagger" },
          { name: "Egg of the Loyal", value: "Egg of the Loyal" },
          { name: "Immortal Chains (Pg 1)", value: "Immortal Chains (Pg 1)" },
          { name: "Immortal Chains (Pg 2)", value: "Immortal Chains (Pg 2)" },
          { name: "Immortal Chains (Pg 3)", value: "Immortal Chains (Pg 3)" },
          { name: "Crystal", value: "Crystal" }
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
      .fill(`${timestamp} | ${user} | Chamber of the Awakened | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Chamber of the Awakened`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
