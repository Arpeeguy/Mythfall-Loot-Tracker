const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_stoneheartforest")
    .setDescription("Log a drop from Stoneheart Forest")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item that dropped")
        .setRequired(true)
        .addChoices(
          { name: "Rockshard Club", value: "Rockshard Club" },
          { name: "Granite Greatblade", value: "Granite Greatblade" },
          { name: "Granite Cape", value: "Granite Cape" },
          { name: "Stony Egg", value: "Stony Egg" },
          { name: "Book of Stone (Pg 1)", value: "Book of Stone (Pg 1)" },
          { name: "Book of Stone (Pg 2)", value: "Book of Stone (Pg 2)" },
          { name: "Book of Stone (Pg 3)", value: "Book of Stone (Pg 3)" },
          { name: "Shard", value: "Shard" }
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
    const dungeon = "Stoneheart Forest";
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

      interaction.reply({ content: `✅ Logged ${quantity}x ${drop} from Stoneheart Forest`, ephemeral: true });
    });
  }
};
