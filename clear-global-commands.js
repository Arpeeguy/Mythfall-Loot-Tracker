const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🧼 Removing all global commands...');
    const result = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Global commands removed:', result);
  } catch (err) {
    console.error('❌ Failed to remove global commands:', err);
  }
})();