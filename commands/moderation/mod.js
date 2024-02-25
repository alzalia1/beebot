const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const Sanctions = require("../../databaseModels/sanctions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mod")
        .setDescription("Appliquer une sanction")
        .addStringOption((option) =>
            option
                .setName("sanction")
                .setDescription("Quelle type de sanction")
                .setChoices(
                    { name: "warn", value: "warn" },
                    { name: "mute", value: "mute" },
                    { name: "kick", value: "kick" },
                    { name: "ban", value: "ban" }
                )
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur à sanctionner")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("durée")
                .setDescription(
                    "Durée (du mute et) pdt laquelle la sanction apparaîtra ds le casier."
                )
        )
        .addStringOption((option) =>
            option.setName("raison").setDescription("Raison de la sanction")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        // FUNCTION -> generates the case id
        async function randomIdGenerator(length = 6) {
            let id = Math.random()
                .toString(36)
                .substring(2, length + 2);
            const tag = await Sanctions.findOne({ where: { case_id: id } });

            if (tag) {
                randomIdGenerator();
            } else {
                return id;
            }
        }

        // Retrieve infos | prepare sanction apply to db
        const case_id = await randomIdGenerator();
        const type = interaction.options.getString("sanction");
        const user_id = interaction.options.getUser("utilisateur").id;
        const duration =
            interaction.options.getInteger("durée") != null
                ? interaction.options.getInteger("durée")
                : 60;
        const moderator_id = interaction.user.id;
        const reason =
            interaction.options.getString("raison") != null
                ? interaction.options.getString("raison")
                : "Aucune raison spécifiée";
        const state = "open";

        // Build base embed
        let sanctionEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
                `${
                    interaction.options.getUser("utilisateur").username
                } a bien été ${type}`
            )
            .addFields(
                { name: "Raison", value: reason },
                { name: "Durée", value: `${duration} min`, inline: true },
                {
                    name: "Id de sanction",
                    value: `\`${case_id}\``,
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter({
                text: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL(),
            });

        switch (type) {
            case "warn":
                break;
            case "mute":
                interaction.guild.members
                    .fetch(user_id)
                    .then((guildUser) =>
                        guildUser.timeout(duration * 60 * 1000, reason)
                    );
                break;
            case "kick":
                break;
            case "ban":
                if (
                    !interaction.user.permissions.has(
                        PermissionsBitField.Flags.BanMembers
                    )
                ) {
                    return interaction.reply(
                        "Vous n'avez pas la permission de bannir quelqu'un, contactez un modérateur de niveau supérieur pour cela !"
                    );
                }
                break;
        }

        // Apply to db
        try {
            const tag = await Sanctions.create({
                case_id: case_id,
                type: type,
                user_id: user_id,
                duration: duration,
                moderator_id: moderator_id,
                reason: reason,
                state: state,
            });

            return interaction.reply({ embeds: [sanctionEmbed] });
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return interaction.reply(
                    "Cet ID de case existe déjà. Référez vous à Alzalia merci."
                );
            }

            return interaction.reply(
                "Il y a eu un problème (Envoyez ce message à Alzalia merci) : \n" +
                    error
            );
        }
    },
};
