const { SlashCommandBuilder } = require('discord.js');
const validDrops = require('../data/validDrops');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('drop_piratecove')
    .setDescription('Log a drop from Pirate Cove')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('The item you received (case-sensitive)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const item = interaction.options.getString('item');
    const dungeon = 'piratecove';

    if (!validDrops[dungeon].includes(item)) {
      await interaction.reply({
        content: `❌ "${item}" is not a valid drop from Pirate Cove.\n\nValid items:\n${validDrops[dungeon].join(', ')}`,
        ephemeral: true
      });
      return;
    }

    const user = interaction.user.tag;
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | ${user} | ${dungeon} | ${item}\n`;

    const logPath = path.join(__dirname, '..', 'data', 'drops.log');
    fs.appendFileSync(logPath, logEntry);

    await interaction.reply(`✅ Logged drop: **${item}** from Pirate Cove`);
  }
};