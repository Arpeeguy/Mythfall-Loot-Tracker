const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_eldertreethicket")
    .setDescription("Log a drop from Eldertree Thicket")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("The item that dropped")
        .setRequired(true)
        .addChoices(
          { name: "Rootspike Shuriken", value: "Rootspike Shuriken" },
          { name: "Rootspike Dagger", value: "Rootspike Dagger" },
          { name: "Acorn Ring", value: "Acorn Ring" },
          { name: "Deciduous Vest", value: "Deciduous Vest" },
          { name: "Verdant Egg", value: "Verdant Egg" },
          { name: "Elderwood Book (Pg 1)", value: "Elderwood Book (Pg 1)" },
          { name: "Elderwood Book (Pg 2)", value: "Elderwood Book (Pg 2)" },
          { name: "Elderwood Book (Pg 3)", value: "Elderwood Book (Pg 3)" },
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
    const dungeon = "Eldertree Thicket";
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

      interaction.reply({ content: `✅ Logged ${quantity}x ${drop} from Eldertree Thicket`, ephemeral: true });
    });
  }
};
