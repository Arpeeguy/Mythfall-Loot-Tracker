const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️ Command at ${filePath} is missing "data" or "execute"`);
  }
}

// Log when bot is ready
client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`🆔 Application ID: ${client.application.id}`);
});

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  console.log('⚡ Interaction received:', {
    type: interaction.type,
    commandName: interaction.commandName
  });

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`❌ No command found for ${interaction.commandName}`);
    try {
      await interaction.reply({ content: 'Command not found.', ephemeral: true });
    } catch (err) {
      console.error('❌ Failed to reply to unknown command:', err);
    }
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error executing this command.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
      }
    } catch (err) {
      console.error('❌ Failed to reply to error:', err);
    }
  }
});

// Heartbeat to confirm container stays alive
setInterval(() => console.log('💓 Bot heartbeat'), 1800000);

// Login
client.login(process.env.DISCORD_TOKEN);
