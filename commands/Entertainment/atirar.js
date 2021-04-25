const { Command, colors } = require('../../utils')
const Discord = require("discord.js");

module.exports = class atirar extends Command {
  constructor(name, client) {
    super(name, client)

    this.aliases = []
    this.category = 'Entertainment'
  }
  async run(message, args) {
    let user = message.mentions.members.first();

    if (!user) return message.channel.send('Mencione alguém');
    if (user.user.id == message.author.id) return message.channel.send('Você não pode atirar em si mesmo');

    let gifs = ['https://i.pinimg.com/originals/40/49/b5/4049b559d6f08dc8ac5c174a53d109d4.gif', 'https://pa1.narvii.com/6553/291bada149c311fe54df1ca479732115c321a5f2_hq.gif', 'https://i.pinimg.com/originals/2d/fa/a9/2dfaa995a09d81a07cad24d3ce18e011.gif']

    let aEmbed = new Discord.MessageEmbed()

      .setTimestamp()
      .setColor(colors.default)
      .setTitle(`:scream: ${message.author.username} **atirou no(a)** ${user.user.username}`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)])
      .setFooter(message.author.tag, message.author.displayAvatarURL())
    try {
      message.delete({ timeout: 100 }).catch(() => { })
      message.channel.send(aEmbed);
    } catch (error) {
      console.log(error);
      message.channel.send(`${error}`);
    }
  }
}