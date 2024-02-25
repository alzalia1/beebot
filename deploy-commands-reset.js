const { REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const clientId = "1118090764417761340";

const guildId = "1119652568113610823"; // TEST
//const guildID = "1074085210704068668"; // ELIC

const commands = [];

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		/* ==> SERVEUR SPECIFIC 
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		// */
		
		/* GLOBAL */
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		//*/		

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
