const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_piratecove")
    .setDescription("Log a drop from Pirate Cove")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item you received")
        .setRequired(true)
        .addChoices(
          { name: "Cutlass", value: "Cutlass" },
          { name: "Blunderbuss", value: "Blunderbuss" },
          { name: "Captain's Hat", value: "Captain's Hat" },
          { name: "Gunpowder Egg", value: "Gunpowder Egg" },
          { name: "Captain's Cape", value: "Captain's Cape" },
          { name: "Pirate Diary (Pg 1)", value: "Pirate Diary (Pg 1)" },
          { name: "Pirate Diary (Pg 2)", value: "Pirate Diary (Pg 2)" }
        )
    )
    .addIntegerOption(option =>
      option.setName("quantity")
        .setDescription("How many times you received this item")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(99)
    ),

  async execute(interaction) {
    const item = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity") || 1;
    const dungeon = "Pirate Cove";
    const user = interaction.user.tag;
    const timestamp = new Date().toISOString();
    const logPath = path.join(__dirname, "..", "data", "drops.log");

    for (let i = 0; i < quantity; i++) {
      const logEntry = `${timestamp} | ${user} | ${dungeon} | ${item}\n`;
      fs.appendFileSync(logPath, logEntry);
    }

    await interaction.reply(`✅ Logged ${quantity} drop${quantity > 1 ? "s" : ""}: **${item}** from ${dungeon}`);
  }
};
