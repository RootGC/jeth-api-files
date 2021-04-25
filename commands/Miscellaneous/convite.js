const { Command, colors } = require('../../utils')
const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js");

module.exports = class Ajuda extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['invite']
        this.category = 'Miscellaneous'
        this.subcommandsOnly = false
    }

    async run(message, args) {
        let embed = new Discord.MessageEmbed()
            .setThumbnail(this.client.user.avatarURL())
            .setTitle("<:Convite:673592197064556563> **Jeth Link** <:Convite:673592197064556563>")
            .setColor(colors.default)
            .setDescription(`Quer me convidar para seu servidor ? por favor [Clique Aqui!](https://top.gg/bot/801225991242383361)\n**Entre tambem em nossa comunidade!** [Clique Aqui!](https://discord.gg/yawcWx5Geg)`)
            .setFooter("🤭・CONVITE", message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp(new Date());
        message.channel.send(embed)
    }
}