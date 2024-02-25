const { SlashCommandBuilder, ActivityType } = require("discord.js");
const client = require("../../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-edit")
        .setDescription("Edits some bot' info")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("activite")
                .setDescription("Défini l'activité du bot")
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Le type d'activité")
                        .addChoices(
                            { name: "Regarde", value: "Regarde" },
                            { name: "Écoute", value: "Écoute" },
                            { name: "Streame", value: "Streame" },
                            {
                                name: "Participant à :",
                                value: "Participant à :",
                            },
                            { name: "Joue à", value: "Joue à" }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("texte")
                        .setDescription("Le texte affiché")
                        .setRequired(true)
                )
        ),
    /*
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('activite')
                .setDescription('Modifier le status du bot !')
                .addSubcommand(subcommand => 
                    subcommand
                        .setName('ecoute')
                        .setDescription('Ecoute ...')
                        .addStringOption(option => option.setName('texte').setDescription('Écoute [texte]').setRequired(true)))
                .addSubcommand(subcommand => 
                    subcommand
                        .setName('joue')
                        .setDescription('Joue à ...')
                        .addStringOption(option => option.setName('texte').setDescription('Joue à [texte]').setRequired(true)))
                .addSubcommand(subcommand => 
                    subcommand
                        .setName('stream')
                        .setDescription('Streame ...')
                        .addStringOption(option => option.setName('texte').setDescription('Stream [texte]').setRequired(true)))
                .addSubcommand(subcommand => 
                    subcommand
                        .setName('regarde')
                        .setDescription('Regarde ...')
                        .addStringOption(option => option.setName('texte').setDescription('Regarde [texte]').setRequired(true)))
                .addSubcommand(subcommand => 
                    subcommand
                        .setName('participant')
                        .setDescription('Streame ...')
                        .addStringOption(option => option.setName('texte').setDescription('Participant à : [texte]').setRequired(true)))
                ),
                */
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "activite") {
            const texte = interaction.options.getString("texte");
            const activite = interaction.options.getString("type");
            switch (activite) {
                case "Regarde":
                    client.user.setActivity(texte, {
                        type: ActivityType.Watching,
                    });
                    break;
                case "Écoute":
                    client.user.setActivity(texte, {
                        type: ActivityType.Listening,
                    });
                    break;
                case "Streame":
                    client.user.setActivity(texte, {
                        type: ActivityType.Streaming,
                        url: "https://www.twitch.tv/eli_xbee",
                    });
                    break;
                case "Participant à :":
                    client.user.setActivity(texte, {
                        type: ActivityType.Competing,
                    });
                    break;
                case "Joue à":
                    client.user.setActivity(texte, {
                        type: ActivityType.Playing,
                    });
                    break;
                default:
                    client.user.setActivity("avec ses pouces", {
                        type: ActivityType.Playing,
                    });
                    break;
            }
            interaction.reply({
                content: "Activité changée pour : " + activite + " " + texte,
                ephemeral: true,
            });
        }
        /*
        if (interaction.options.getSubcommandGroup() === 'activite') {

            // LISTENING
            if (interaction.options.getSubcommand() === 'ecoute') {
			    const texte = interaction.options.getString('texte');
                client.user.setActivity(texte, { type: ActivityType.Watching });
                interaction.reply({content : 'Activité changée pour : Écoute '+texte,  ephemeral : true});
            
            // PLAYING
            } else if (interaction.options.getSubcommand() === 'joue') {
                const texte = interaction.options.getString('texte');
                client.user.setActivity(texte, { type: ActivityType.Playing });
                interaction.reply({content : 'Activité changée pour : Joue à '+texte,  ephemeral : true});
            
            // STREAMING
            } else if (interaction.options.getSubcommand() === 'stream') {
                const texte = interaction.options.getString('texte');
                client.user.setActivity(texte, { type: ActivityType.Streaming, url: "https://www.twitch.tv/eli_xbee"});
                interaction.reply({content : 'Activité changée pour : Stream '+texte,  ephemeral : true});
            
            // WATCHING
            } else if (interaction.options.getSubcommand() === 'regarde') {
                const texte = interaction.options.getString('texte');
                client.user.setActivity(texte, { type: ActivityType.Watching });
                interaction.reply({content : 'Activité changée pour : Regarde '+texte,  ephemeral : true});
            
            // COMPETING
            } else if (interaction.options.getSubcommand() === 'participant') {
                const texte = interaction.options.getString('texte');
                client.user.setActivity(texte, { type: ActivityType.Competing });
                interaction.reply({content : 'Activité changée pour : Participant à : '+texte,  ephemeral : true});
            
            }
            
        } else {
            interaction.reply('Not working bro TwT')
        };
        */
    },
};
