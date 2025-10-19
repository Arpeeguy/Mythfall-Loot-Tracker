const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_luminouscavern")
    .setDescription("Log a drop from Luminous Cavern")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item that dropped")
        .setRequired(true)
        .addChoices(
          { name: "Luminescent Egg", value: "Luminescent Egg" },
          { name: "Jellyhead Cap", value: "Jellyhead Cap" },
          { name: "White Jelly", value: "White Jelly" },
          { name: "Jelly Boots", value: "Jelly Boots" },
          { name: "Jelly Bow", value: "Jelly Bow" },
          { name: "Luminous Tome (Pg 1)", value: "Luminous Tome (Pg 1)" },
          { name: "Luminous Tome (Pg 2)", value: "Luminous Tome (Pg 2)" }
        )
    )
    .addIntegerOption(option =>
      option.setName("quantity")
        .setDescription("How many of this item dropped")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    ),

  async execute(interaction) {
    const drop = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity");
    const user = interaction.user.username;
    const timestamp = new Date().toISOString();
    const dungeon = "Luminous Cavern";
    const logPath = path.join(__dirname, "../data/drops.log");

    let logLines = "";
    for (let i = 0; i < quantity; i++) {
      logLines += `${timestamp} | ${user} | ${dungeon} | ${drop}\n`;
    }

    fs.appendFile(logPath, logLines, err => {
      if (err) {
        console.error("❌ Failed to log drop:", err);
        return interaction.reply({ content: "Failed to log drop.", ephemeral: true });
      }

      interaction.reply({ content: `✅ Logged ${quantity}x ${drop} from Luminous Cavern`, ephemeral: true });
    });
  }
};
