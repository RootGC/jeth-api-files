const { Command, colors } = require('../../utils')
const Discord = require('discord.js')

module.exports = class serverinfo extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['sugestão']
        this.category = 'Miscellaneous'
        this.subcommandsOnly = false
    }

    async run(message, args) {
        const embedA = new Discord.MessageEmbed()

            .setTimestamp()
            .setColor(colors.mod)
            .setTitle('**Err:**', `${message.author}`, true)
            .setDescription('Missing Permissions') // inline false
            .addField('*Verifique se você possui a permissão:*', '`MANAGE_GUILD`', true)
            .setFooter('🧁・Discord da Jeth', message.author.displayAvatarURL())
        if (!message.member.hasPermission('MANAGE_GUILD'))
            return message.channel.send(embedA)
        let guildDocument = await this.client.database.Guilds.findById(message.guild.id)
        let documento = await this.client.database.Guilds.findById(message.guild.id)
        let prefix = documento.prefix
        const mododeuso = new Discord.MessageEmbed()

            .setTimestamp()
            .setColor(colors.default)
            .setTitle('**PAINEL DE AJUDA**')
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(`Para definir o canal de sugestão basta utilizar o comando\n **${prefix}suggestion canal <#canal>** \n\nAssim que o canal for definido, qualquer mensagem enviada nele, receberá a reação dos emojis Sim, não ou não especificado.\nCaso queira desativar o canal de sugestões basta utilizar \n**${prefix}suggestion remover**`) // inline false
            .setFooter('🧁・Discord da Jeth', message.author.displayAvatarURL())
        if (!args[0]) message.channel.send(mododeuso)
        if (args[0] === 'canal') {
            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(' ')) || message.guild.channels.cache.get(args[1]) || message.mentions.channels.first()
            if (!channel || channel.type === 'category') return message.channel.send('Coloque um canal válido!')

            guildDocument.sugesChannel = channel.id
            guildDocument.sugesModule = true
            guildDocument.save().then(async () => {
                await message.channel.send(`Canal definido: ${channel}\n<:b_verified:742270909225893989> O Canal de sugestões foi definido e está ativo!`)
            })
        }
        else if (args[0] === 'remover') {
            guildDocument.sugesChannel = ''
            guildDocument.sugesModule = false
            guildDocument.save().then(async () => {
                await message.channel.send(`<a:warnRoxo:664240941175144489> O canal de sugestões foi desativado`)
            })
        }
    }
}
exports.help = {
    name: "serverinfo"
}