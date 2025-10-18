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
    )
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('How many times you received this item')
        .setRequired(false)
    ),

  async execute(interaction) {
    const item = interaction.options.getString('item');
    const quantity = interaction.options.getInteger('quantity') || 1;
    const dungeon = 'Pirate Cove';

    if (!validDrops[dungeon]) {
      return interaction.reply({
        content: `❌ Dungeon "${dungeon}" not found in validDrops.`,
        ephemeral: true
      });
    }

    if (!validDrops[dungeon].includes(item)) {
      return interaction.reply({
        content: `❌ "${item}" is not a valid drop from ${dungeon}.\n\nValid items:\n${validDrops[dungeon].join(', ')}`,
        ephemeral: true
      });
    }

    const user = interaction.user.tag;
    const timestamp = new Date().toISOString();
    const logPath = path.join(__dirname, '..', 'data', 'drops.log');

    for (let i = 0; i < quantity; i++) {
      const logEntry = `${timestamp} | ${user} | ${dungeon} | ${item}\n`;
      fs.appendFileSync(logPath, logEntry);
    }

    await interaction.reply(`✅ Logged ${quantity} drop${quantity > 1 ? 's' : ''}: **${item}** from ${dungeon}`);
  }
};
