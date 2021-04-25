const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')

module.exports = async function onMessage(message) {
    let guildDocument = await this.database.Guilds.findById(message.guild.id)
    if (message.author.bot) return
    if (message.channel.type === "dm")
    if (!guildDocument) {
        new this.database.Guilds({ _id: message.guild.id }).save()
    }
    // const hearty = "671437180669001763"
    // if (message.channel.id === "718178715657568364") {

    //     message.react(hearty);
    // }

    const thumbsup = "👍";
    const thumbsdown = "👎";
    if (message.channel.id === "718178715657568359") {

        message.react(thumbsup);
        await message.react(thumbsdown);
    }

    if (guildDocument?.sugesModule) {
        const suggestionChannel = message.guild.channels.cache.get(guildDocument?.sugesChannel)
        if (!suggestionChannel) return
        if (message.channel.id === suggestionChannel.id) {
            const sim = "673592197202837524";
            const duvida = "❓";
            const nao = "673592197341249559";

            message.react(sim);
            await message.react(duvida);
            await message.react(nao);
        }
    }

    let Users = await this.database.Users.findById(message.author.id)
    const guildPrefix = (guildDocument && guildDocument.prefix)
    const botMention = message.guild ? message.guild.me.toString() : this.user.toString()
    const prefix = message.content.startsWith(botMention) ? `${botMention} ` : (message.content.startsWith(guildPrefix) ? guildPrefix : null)
    if (Users) {
        if (guildDocument) {
            if (prefix) {
                if (Users.blacklist) {
                    message.reply('> Você está na blacklist,e não pode executar nenhum comando do bot.').then(msg => msg.delete({ timeout: 5000 }))
                    return
                }
                const args = message.content.slice(prefix.length).trim().split(' ')
                const name = args.shift()
                const command = this.commands.find(command => command.name === name || command.aliases.includes(name))
                Object.defineProperties(message, {
                    'prefix': { value: prefix },
                    'command': { value: command }
                })

                if (command) {
                    message.delete({ timeout: 100 }).catch(() => { })
                    command.process(message, args)
                }
            }
            if (guildDocument.antInvite && !message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
                if (message.channel.id === "718178715657568361") {
                    return;
                } else {
                    if (message.content.includes("https://discord.gg/") || message.content.includes("discord.gg/")) {
                        message.delete({ timeout: 100 })
                        message.reply('<:w_DiscordPartnerDisapproved:775239950664335401> Você não pode divulgar outros servidores aqui! Caso se repita você será banido!')
                        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
                        if (!muteRole) muteRole = await message.guild.createRole({ name: "Muted" }).catch(() => { });
                        if (muteRole) {
                            message.member.roles.add(muteRole).catch(() => { });
                            message.guild.channels.cache.forEach(channel => {
                                channel.overwritePermissions(muteRole, {
                                    color: "#080808",
                                    SEND_MESSAGES: false,
                                    ADD_REACTIONS: false,
                                    SPEAK: false
                                }).catch(() => { });
                            });
                        }
                        let canal = message.guild.channels.cache.get(guildDocument.infoantinv)
                        if (!canal) return;
                        message.channel.send(`Anti-invite ativado,membro: ${message.member} foi mutado automaticamente!`)
                        let embedmute = new MessageEmbed()
                        embedmute.setAuthor(message.member.user.username, message.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                        embedmute.setColor('BLACK')
                        embedmute.setDescription(`O usuário: ${message.member},enviou convite no ${message.channel} e foi mutado automaticamente com a role: ${muteRole}`)
                        canal.send(embedmute).catch(() => { })
                        message.member.roles.add(muteRole).catch(() => { })
                    }
                }
            }
            let mention = message.content.split(/ +/g)[0];
            if (mention === `<@!753778869013577739>` || mention === `<@!753778869013577739`) {
                if (message.guild.id !== '804575416098488380') {
                    return;
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setThumbnail(this.users.cache.get('753778869013577739').displayAvatarURL({ dynamic: true, size: 1024 }))
                        .setTitle(`<:chicken_OwO:804583184988635197> ${message.author.username}` + "#" + `${message.author.discriminator}`)
                        .setDescription(`**Você mencionou o <@753778869013577739> espere por uma resposta e não mencione novamente !**\n **esperamos que seja por um motivo útil desta vez.** <:9439_unsee:804583188382744576>`)
                        .setColor("BLACK")
                        .setFooter('Encontrou algum bug? por favor utilize /bug "explique o bug aqui com print se possível" 🤖')
                        .setTimestamp(new Date());

                    message.channel.send(embed).then(msg => { msg.delete({ timeout: 80000 }) })
                }
            };

            if (message.content.indexOf(prefix) !== 0) {
                if (message.mentions.members.size > 0) {
                    let mention = message.content.split(/ +/g)[0];
                    if (mention === `<@${this.user.id}>` || mention === `<@!${this.user.id}>`) {
                        message.delete({ timeout: 5000 })
                        message.channel.send(`<a:dshype:683501891493167163> **Olá !** ${message.author} Prazer em ter você utilizando de nossos comandos, tem algo em que eu possa ajudar ? Caso queira saber os meus comandos, por favor use ${guildDocument.prefix}ajuda que lhe enviarei tudo sobre meus comandos ! <a:dshype:683501891493167163>`).then(m => {
                            m.delete({ timeout: 5000 }).catch(() => { });
                        }).catch(console.error);
                    }
                }
            }
        } else {
            const newGuildDB = new this.database.Guilds({ _id: message.guild.id })
            newGuildDB.save()
            console.log(`${message.guild.name}[${message.guild.id}] adicionado ao banco de dados`)
            this.channels.cache.get('801265005894697017').send(`**\`\`${message.guild.name}[${message.guild.id}] adicionado ao banco de dados\`\`**`)
        }
    } else {
        const newGuildDB = new this.database.Users({ _id: message.author.id })
        newGuildDB.save()
        console.log(`${message.author.tag}[${message.author.id}] adicionado ao banco de dados`)
        this.channels.cache.get('801265005894697017').send(`**\`\`${message.author.tag}[${message.author.id}] adicionado ao banco de dados\`\`**`)
    }
}