const { Command, colors } = require('../../utils')
const { MessageEmbed } = require('discord.js')

module.exports = class SlowMode extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['modolento']
        this.category = 'Moderation'
    }

    async run(message, args) {
        const embedA = new MessageEmbed()

            .setTimestamp()
            .setColor(colors.default)
            .setTitle('**Err:**', `${message.author}`, true)
            .setDescription('Missing Permissions') // inline false
            .addField('*Verifique se você possui a permissão:*', '`MANAGE_GUILD`', true)
            .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
        if (!message.member.hasPermission('MANAGE_GUILD'))
            return message.channel.send(embedA)
        const time = args[0]
        if (!time) return message.reply(`Indique um numero válido.`)
        if (time > 600) return message.reply(`Você não pode colocar 600 segundos de slowmode burrinho.`)
        if (0 < time) {
            message.channel.setRateLimitPerUser(time).then(() => {
                message.reply(`Slow mode ativado em: ${time}.`)
            })
        } else {
            message.channel.setRateLimitPerUser(time).then(() => {
                message.reply(`Slow mode desativado.`)
            })
        }
    }
}