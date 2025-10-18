const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_coolcrabgrotto")
    .setDescription("Log a drop from Coolcrab Grotto")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item that dropped")
        .setRequired(true)
        .addChoices(
          { name: "Coolcrab Shades", value: "Coolcrab Shades" },
          { name: "Dancing Boots", value: "Dancing Boots" },
          { name: "Wedding Band", value: "Wedding Band" },
          { name: "Tidal Egg", value: "Tidal Egg" },
          { name: "Dance Notes (Pg 1)", value: "Dance Notes (Pg 1)" },
          { name: "Dance Notes (Pg 2)", value: "Dance Notes (Pg 2)" }
        )
    ),
  async execute(interaction) {
    const drop = interaction.options.getString("item");
    const user = interaction.user.username;
    const timestamp = new Date().toISOString();
    const dungeon = "Coolcrab Grotto";

    const logLine = `${timestamp} | ${user} | ${dungeon} | ${drop}\n`;
    const logPath = path.join(__dirname, "../data/drops.log");

    fs.appendFile(logPath, logLine, err => {
      if (err) {
        console.error("❌ Failed to log drop:", err);
        return interaction.reply({ content: "Failed to log drop.", ephemeral: true });
      }

      interaction.reply({ content: `✅ Logged: ${drop} from Coolcrab Grotto`, ephemeral: true });
    });
  }
};
