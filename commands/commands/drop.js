const { SlashCommandBuilder } = require('discord.js');
const lootTables = require('../data/lootTables');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('drop')
    .setDescription('Log a loot drop from a dungeon')
    .addStringOption(option =>
      option.setName('dungeon')
        .setDescription('Select the dungeon')
        .setRequired(true)
        .addChoices(...Object.keys(lootTables).map(name => ({
          name,
          value: name
        })))
    )
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Select the item dropped')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('How many dropped?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const dungeon = interaction.options.getString('dungeon');
    const item = interaction.options.getString('item');
    const quantity = interaction.options.getInteger('quantity');

    await interaction.reply(`📦 Logged: ${quantity}x **${item}** from **${dungeon}**`);
  }
};