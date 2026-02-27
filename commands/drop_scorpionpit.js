const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_scorpionpit")
    .setDescription("Log a drop from Scorpion Pit")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Scorpion Stinger", value: "Scorpion Stinger" },
          { name: "Scorpion Diadem", value: "Scorpion Diadem" },
          { name: "Scorpion King's Ring", value: "Scorpion King's Ring" },
          { name: "Chitin Fragment", value: "Chitin Fragment" },
          { name: "Brood Egg", value: "Brood Egg" },
          { name: "Shard", value: "Shard" },
          { name: "Scorpion Scribblings (Pg 1)", value: "Scorpion Scribblings (Pg 1)" },
          { name: "Scorpion Scribblings (Pg 2)", value: "Scorpion Scribblings (Pg 2)" },
          { name: "Scorpion Scribblings (Pg 3)", value: "Scorpion Scribblings (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | Scorpion Pit | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Scorpion Pit`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
