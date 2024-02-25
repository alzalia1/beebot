const { Sequelize } = require("sequelize");
const Sanctions = require("../../databaseModels/sanctions");
const { EmbedBuilder } = require("discord.js");
const cron = require("cron");

const test = (client) =>
    new cron.CronJob("*/5 * * * *", async () => {
        console.log(client.user.tag);

        const now = Date.now();
        const openSanctions = await Sanctions.findAll({
            where: { state: "open" },
        });

        async function unmod(data, channel) {
            // Get expiration Date (undefficient but tkt)
            let expirationDate = new Date();
            let createdAt = data.createdAt;
            let duration = new Date(data.duration * 1000 * 60);
            expirationDate.setTime(createdAt.getTime() + duration.getTime());

            let now = Date.now();

            if (expirationDate.getTime() <= now) {
                // Modif de la db
                Sanctions.update(
                    { state: "closed" },
                    { where: { case_id: data.case_id } }
                );

                // ### Création de l'embed ###
                // Def champs
                const userSanc = client.users.fetch(data.user_id);
                const moderator = client.users.fetch(data.moderator_id);

                // Création embed
                let sanctionEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`${userSanc.username} a bien été un${type}`)
                    .addFields(
                        { name: "Raison", value: "Sanction expirée" },
                        {
                            name: "Durée",
                            value: `${data.duration} min`,
                            inline: true,
                        },
                        {
                            name: "Id de sanction",
                            value: `\`${data.case_id}\``,
                            inline: true,
                        }
                    )
                    .setTimestamp();

                // Envoi de l'enmbed
                channel.send({ embeds: [sanctionEmbed] });
            } else if (expirationDate.getTime <= now + 5 * 1000 * 60) {
                let timeout = new Date();
                timeout.setTime(expirationDate.getTime() - now);
                setTimeout(unMod(), timeout);
            } else {
                channel.send(
                    `Case open but not passed : ${data.case_id} | ${expirationDate}`
                );
            }
        }

        let channel = await client.channels.fetch("1119652569023791126");

        openSanctions.forEach((element) => {
            unmod(element, channel);
        });
    });
module.exports = test;

/*
( async () => {

    console.log(client.user.tag);

    const now = Date.now();
    const openSanctions = await Sanctions.findAll({ where : {state: "open"}});
    const passedSanctions = openSanctions.map(t => ((t.createdAt + t.duration)<=now) ? t : null);
    
    async function unMod(){
        const channel = await client.channels.fetch('1119652569023791126');
        channel.send({ content: 'This is a message' });
    } 

    passedSanctions.forEach(element => {
    
        unMod();
        
    });
    
})()
*/

// Sanctions.update({ state: "closed" }, { where: { case_id: case_id } })
//.then(console.log(`Sanction levée pour l'utilisateur ${user_id} à ${new Date()}`));
