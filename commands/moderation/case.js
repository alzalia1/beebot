const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Sanctions = require("../../databaseModels/sanctions");
const Sequelize = require("sequelize");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("case")
        .setDescription("Afficher ou modifier une sanction")
        .addSubcommand((command) =>
            command
                .setName("fetch")
                .setDescription("Afficher les informations d'une sanction")
                .addStringOption((option) =>
                    option
                        .setName("case_id")
                        .setDescription("Id de la sanction")
                )
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() == "fetch") {
            const case_id = interaction.options.getString("case_id");
            //const caseData = {};
            const caseData = await Sanctions.findOne({
                where: { case_id: case_id },
            });

            let sanctionEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Sanction \`${case_id}\``)
                .addFields(
                    {
                        name: `Type de sanction : ${caseData.type}`,
                        value: "\u200B",
                    },
                    { name: "Raison", value: caseData.reason },
                    {
                        name: "Durée",
                        value: `${caseData.duration} min`,
                        inline: true,
                    },
                    {
                        name: "Sanctionné",
                        value: interaction.guild.members
                            .fetch(caseData.user_id)
                            .then((user) => user.username),
                        inline: true,
                    },
                    {
                        name: "Modérateur",
                        value: interaction.guild.members
                            .fetch(caseData.moderator_id)
                            .then((user) => user.username),
                        inline: true,
                    },
                    { name: `Etat : ${caseData.state}`, value: "\u200B" }
                )
                .setTimestamp()
                .setFooter({
                    text: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                });

            interaction.reply(
                `Case : ${caseData.case_id} \n State : ${caseData.state} \n`
            );
        }
    },
};
