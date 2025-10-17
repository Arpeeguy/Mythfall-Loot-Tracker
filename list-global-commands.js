const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const commands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
    console.log('🌐 Global commands:');
    commands.forEach(cmd => console.log(`- ${cmd.name}`));
  } catch (err) {
    console.error('❌ Failed to fetch global commands:', err);
  }
})();
