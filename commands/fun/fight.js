const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName("fight")
        .setDescription("Comment un fight entre deux utilisateurs")
        .addUserOption((option) =>
            option
                .setName("user1")
                .setDescription("Premier utilisateur")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user2")
                .setDescription("Deuxième utilisateu")
                .setRequired(true)
        ),

    async execute(interaction) {
        user1 = interaction.options.getUser("user1");
        user2 = interaction.options.getUser("user2");

        const sent = await interaction.reply({
            content: `Lancement du fight entre ${user1.username} et ${user2.username}...`,
            fetchReply: true,
        });

        let rand = Math.random();
        let winner = {};
        let eli = false;

        if (
            user1.id == "583914712912101377" ||
            user2.id == "583914712912101377"
        ) {
            // Si c'est eli : nion (ง •̀_•́)ง
            winner = user1.id == "583914712912101377" ? user2 : user1;
            eli = true;
        } else if (rand > 0.5) {
            winner = user1;
        } else {
            winner = user2;
        }

        await setTimeout(!eli ? sayWinner() : sayWinnerEli(), 3000);

        function sayWinner() {
            interaction.editReply(
                `${user1.username} VS ${user2.username} : le gagnant est ${winner.username}`
            );
        }
        function sayWinnerEli() {
            interaction.editReply(
                `${user1.username} VS ${user2.username} : le gagnant est ${winner.username}, eli devra avoir fini la couverture avant d'avoir une chance de gagner UwU.`
            );
        }
    },
};
