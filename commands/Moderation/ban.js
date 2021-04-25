const { Command, colors } = require('../../utils')
const Discord = require('discord.js')

module.exports = class Ban extends Command {
  constructor(name, client) {
    super(name, client)

    this.aliases = ['banir', 'vaza', 'some']
    this.category = 'Moderation'
  }

  async run(message, args) {

    const escolha = new Discord.MessageEmbed()
      .setColor(colors.default)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTitle('Sistema Trust & Safety')
      .setDescription('**Por favor, escolha um motivo válido abaixo para aplicar o banimento!** \n<a:JT1:739977300564639835> - Conteúdo pornográfico/Gore \n<a:JT2:739977300921024522> - Promover ou participar de Raids a outros servidores \n<a:JT3:739977300895858708> - Discurso de ódio ou Racismo e derivados \n<a:JT4:739977300472234078> - Apologia ao Nazismo e/ou pornografia infântil \n<a:JT5:739977300719697941> - Ações que comprometem o servidor ou os usuários \n<a:JT6:739977300795457687> - Divulgação inapropriada')
      .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))

      // motivo dos banimentos
    let primeiro = "Conteúdo pornográfico/Gore"
    let segundo = "Promover ou participar de Raids a outros servidores"
    let terceiro = "Discurso de ódio ou Racismo e derivados"
    let quarto = "Apologia ao Nazismo e/ou pornografia infântil"
    let quinto = "Ações que comprometem o servidor ou os usuários"
    let sexto = "Divulgação inapropriada"


    const embedA = new Discord.MessageEmbed()

      .setTimestamp()
      .setColor(colors.mod)
      .setTitle('**Err:**', true)
      .setDescription('Missing Permissions') // inline false
      .addField('*Verifique se você possui a permissão:*', '`BAN_MEMBERS`', true)
      .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(embedA)
    let userDocuent = await this.client.database.Users.findById(message.author.id)
    if (!args[0]) return message.reply("mencione ou informe o ID do usuário")
    // ban padrão 17
    let membro17 = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!membro17) return message.reply("eu procurei, procurei, e não achei este usuário")

    const warnembed17 = new Discord.MessageEmbed()

      .setThumbnail(membro17.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTitle('Ação | Ban')
      .setColor("#ff112b")
      .setImage(`${userDocuent.gifban || ""}`)
      .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTimestamp(new Date());

    // banimento private
    let bans = await message.guild.fetchBans('716845015678320661');
    let membro14 = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!membro14) return message.reply("eu procurei, procurei, e não achei este usuário")
    let bannable = message.guild.member(membro17, membro14)
    if (bannable) {
      if (!bannable.bannable) return message.reply("eu não posso banir este usuário, o cargo dele é maior que o meu.")
      if (bannable.roles.highest.position > message.member.roles.highest.position) return message.reply(`você não pode banir esse usuário, pois o cargo dele é maior ou igual ao seu.`)
    }

    let reason = args.slice(1).join(" ") || "Nenhum motivo especificado";

    const warnembed14 = new Discord.MessageEmbed()

      .setThumbnail(membro14.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setAuthor(`${message.author.username} Já baniu ${bans.size} usuários`, message.author.avatarURL({ dynamic: true, size: 1024 }))
      .setColor("#ff112b")
      .setImage(`${userDocuent.gifban || ""}`)
      .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTimestamp(new Date());

    const warnembed18 = new Discord.MessageEmbed()

      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTitle(`${message.author.username}`)
      .setDescription(`:do_not_litter: **Você foi banido do servidor ${message.guild.name} :no_entry_sign:**`)
      .setColor("#ffefad")
      .addField('<:pepe:651487933148299291> **Staffer:**', `${message.author.username}`)
      .addField('📝 Motivo:', `${reason}`)
      .setFooter('Se você acha que a punição foi aplicada incorretamente, recorra ao staffer! 🥶')
      .setImage('https://media1.tenor.com/images/4c906e41166d0d154317eda78cae957a/tenor.gif?itemid=12646581')
      .setTimestamp(new Date());

    let argumentos = args.slice(1).join(" ");
    if (argumentos) {
      if (!membro14.bannable) {
        message.channel.send(`Erro ${Error}`)
      } else {
      message.guild.members.ban(membro14)
      warnembed18.fields[1].value = argumentos
      warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${argumentos}`)
      warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${argumentos}`)
      message.channel.send(warnembed14)
        try {
          membro14.send(warnembed18)
        } catch { }
    }
       } else {
    message.channel.send(escolha).then(m => {

      m.react('739977300564639835')
      m.react('739977300921024522')
      m.react('739977300895858708')
      m.react('739977300472234078')
      m.react('739977300719697941')
      m.react('739977300795457687').then(() =>
        m.delete({ timeout: 15000 })
      )

      const collector = m.createReactionCollector(
        ((_, u) => _ && u.id === message.author.id),
        { time: 60000 }
      )

      collector.on('collect', (reaction) => {

        console.log(reaction.emoji.name)

        switch(reaction.emoji.name) {

          case 'JT1':
            reason = primeiro
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          case 'JT2':
            reason = segundo
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          case 'JT3':
            reason = terceiro
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          case 'JT4':
            reason = quarto
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          case 'JT5':
            reason = quinto
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          case 'JT6':
            reason = sexto
            warnembed18.fields[1].value = reason
            warnembed17.setDescription(`\n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro17.user.username} \n**ID:** ${membro17.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            warnembed14.setDescription(`**Banido!** \n \n<:Kaeltec:673592197177933864> **Staff:** ${message.author.username} \n**ID:** ${message.author.id}` + `\n<:Kaeltec:673592197177933864> **Banido:** ${membro14.user.username} \n**ID:** ${membro14.id}` + `\n<:Registrado:673592197077270558> **Motivo:** ${reason}`)
            collector.stop()
            message.guild.members.ban(membro14.id, {
              reason: reason
            }).then(() => {
              message.channel.send(warnembed14)
              try {
                membro14.send(warnembed18)
              } catch { }
            }).catch(erro => message.reply(`Algum erro ocorreu ao tentar banir esse usuário.\nErro:\n\`\`\`erro\`\`\``))
            break
          } 
        })
      })
    }
  }
}