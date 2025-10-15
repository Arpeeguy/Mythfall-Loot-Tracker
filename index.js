require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { 
  Client, 
  GatewayIntentBits, 
  ActivityType, 
  Events 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Load all slash commands from /commands
client.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Bot is ready
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'Tracking loot', type: ActivityType.Watching }]
  });
});

// Fallback text command
client.on(Events.MessageCreate, (message) => {
  if (message.content === '/logdrop') {
    message.reply('🧭 Loot drop logged!');
  }
});

// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ 
      content: '❌ There was an error executing that command.', 
      ephemeral: true 
    });
  }
});

client.login(process.env.DISCORD_TOKEN);