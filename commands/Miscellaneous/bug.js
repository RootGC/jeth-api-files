const { Command, colors } = require('../../utils')
const Discord = require('discord.js')

module.exports = class bug extends Command {
  constructor(name, client) {
    super(name, client)

    this.aliases = ['reportar', 'bugreport', 'report', 'reportbug']
    this.category = 'Miscellaneous'
    this.subcommandsOnly = false
  }

  async run(message, args) {
    var dono = ['753778869013577739']
    let report = args.join(" ");
    if (!args[3]) return message.reply("<a:astaff:671435205302681603> `Err! Explique aqui detalhadamente o bug encontrado, ele será reportado diretamente para o coder do bot.`")

    let embed = new Discord.MessageEmbed()
      .setColor(colors.mod)
      .setDescription("**BUG-REPORT**")
      .addField('Ticket criado por:', `${message.author.tag}`, true)
      .addField('**ID:**', `${message.author.id}`, true)
      .addField('**Descrição:**', `${report}`, true)
      .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTimestamp(new Date())

    this.client.users.cache.get(dono.toString()).send(embed)
    message.reply(`Seu ticket foi enviado com sucesso!`);
  }
};