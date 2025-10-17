const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const commands = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID));
    console.log('🏠 Guild commands:');
    commands.forEach(cmd => {
      console.log(`- ${cmd.name}`);
      cmd.options?.forEach(opt => {
        console.log(`   • ${opt.name} (${opt.type}) autocomplete: ${opt.autocomplete}`);
      });
    });
  } catch (err) {
    console.error('❌ Failed to fetch guild commands:', err);
  }
})();
