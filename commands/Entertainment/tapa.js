const { Command, colors } = require('../../utils')
const Discord = require("discord.js");

module.exports = class tapa extends Command {
  constructor(name, client) {
    super(name, client)

    this.aliases = ['tapear', 'slap']
    this.category = 'Entertainment'
  }
  async run(message, args) {
    let slapUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!slapUser) return message.channel.send("Mencione alguém para da um tapa!");

    var gifs = ['https://68.media.tumblr.com/664045302ec83165bc35db7709d99ebd/tumblr_nbjnosotP11sfeoupo1_500.gif', 'https://i.pinimg.com/originals/bd/fd/d1/bdfdd112c36a7c2159c28ed2549eb4df.gif', 'https://media1.giphy.com/media/Zau0yrl17uzdK/giphy.gif', 'https://media1.tenor.com/images/f2e22829f9dc2e796d8e9d0590e8076c/tenor.gif'];

    let slapEmbed = new Discord.MessageEmbed()
      .setDescription(`:person_facepalming: ${message.author.username} **deu um tapa no(a)** ${message.mentions.users.first().username}`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)])
      .setColor(colors.default)
      .setFooter(`Tapa dado por ${message.author.username}`, message.author.displayAvatarURL())

    message.channel.send(slapEmbed)
  }
}