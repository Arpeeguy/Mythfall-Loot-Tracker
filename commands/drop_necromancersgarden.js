const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drop_necromancersgarden")
    .setDescription("Log a drop from Necromancer's Garden")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Select the item you received")
        .setRequired(true)
        .addChoices(
          { name: "Dawnwood", value: "Dawnwood" },
          { name: "Sunleaf Cloak", value: "Sunleaf Cloak" },
          { name: "Sunleaf Hood", value: "Sunleaf Hood" },
          { name: "Sunleaf Boots", value: "Sunleaf Boots" },
          { name: "Duskwood", value: "Duskwood" },
          { name: "Shadowleaf Cloak", value: "Shadowleaf Cloak" },
          { name: "Shadowleaf Hood", value: "Shadowleaf Hood" },
          { name: "Shadowleaf Boots", value: "Shadowleaf Boots" },
          { name: "Rotted Egg", value: "Rotted Egg" },
          { name: "Crystal", value: "Crystal" },
          { name: "Dawnlight Tome (Pg 1)", value: "Dawnlight Tome (Pg 1)" },
          { name: "Dawnlight Tome (Pg 2)", value: "Dawnlight Tome (Pg 2)" },
          { name: "Dawnlight Tome (Pg 3)", value: "Dawnlight Tome (Pg 3)" },
          { name: "Shadowstep Tome (Pg 1)", value: "Shadowstep Tome (Pg 1)" },
          { name: "Shadowstep Tome (Pg 2)", value: "Shadowstep Tome (Pg 2)" },
          { name: "Shadowstep Tome (Pg 3)", value: "Shadowstep Tome (Pg 3)" }
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
      .fill(`${timestamp} | ${user} | Necromancer's Garden | ${item}`)
      .join("\n") + "\n";

    try {
      fs.appendFileSync(logPath, logLines);
      await interaction.reply({
        content: `✅ Logged ${quantity}x ${item} from Necromancer's Garden`,
        ephemeral: true
      });
    } catch (err) {
      console.error("❌ Failed to log drop:", err);
      await interaction.reply({ content: "Failed to log your drop.", ephemeral: true });
    }
  }
};
