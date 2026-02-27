const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_alivargstower")
    .setDescription("Log a drop from Alivarg's Tower")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Jester Hat", value: "Jester Hat" },
          { name: "Broken Crown", value: "Broken Crown" },
          { name: "Wizard's Cape", value: "Wizard's Cape" },
          { name: "Wizard Boots", value: "Wizard Boots" },
          { name: "Spellthief Tome (Pg 1)", value: "Spellthief Tome (Pg 1)" },
          { name: "Spellthief Tome (Pg 2)", value: "Spellthief Tome (Pg 2)" },
          { name: "Spellthief Tome (Pg 3)", value: "Spellthief Tome (Pg 3)" },
          { name: "Cube Egg", value: "Cube Egg" },
          { name: "Willpower Crystal", value: "Willpower Crystal" },
          { name: "Vitality Crystal", value: "Vitality Crystal" },
          { name: "Dexterity Crystal", value: "Dexterity Crystal" },
          { name: "Strength Crystal", value: "Strength Crystal" },
          { name: "Defense Crystal", value: "Defense Crystal" },
          { name: "Speed Crystal", value: "Speed Crystal" }
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
      .fill(`${timestamp} | ${user} | Alivarg's Tower | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Alivarg's Tower`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
