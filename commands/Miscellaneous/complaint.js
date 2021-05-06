const { Command, colors } = require('../../utils')
const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')

module.exports = class chat extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['report', 'denounce', 'watchdogsreport']
        this.category = 'Miscellaneous'
        this.subcommandsOnly = false
    }

    async run(message, args) {
        let reason = args.slice(1).join(" ")
        if(!reason) message.reply('<:2715shield:832746524416278578> Sua denúncia requer mais provas e um motivo especificado!')
        let usuario = await this.client.users.fetch(args[0].replace(/[<@!>]/g, ""))
        if (!usuario) {
            message.channel.send('Mencione um membro valido.')
        }
        let guildDocument = await this.client.database.Users.findById(usuario.id)
        if (!guildDocument) {
            new this.client.database.Users({
                _id: usuario.id
            }).save()
        }

        // gera o ID da denuncia aleatoriamente
        function makeid(length) {
            var result           = [];
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result.push(characters.charAt(Math.floor(Math.random() * 
         charactersLength)));
           }
           return result.join('');
        }

        const reportembed = new Discord.MessageEmbed()
        .setThumbnail(usuario.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setDescription(`To attach proofs of your report please copy your private code sent to your DM and send the attachments to our Trust & Safety team with your code. \n\nUser: *${usuario.user.tag}*\nReason: *${reason}*`, message.author.avatarURL({ dynamic: true, size: 1024 }))
        .addField(`Complaint ID:`, `*${makeid(24)}*`)
        .setColor(colors.mod)
        .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTimestamp(new Date());

        message.author.send(reportembed)
        await this.client.channels.cache.get('838234183566360636').send(reportembed)
        await this.client.channels.cache.get('838234183566360636').send(`Reported by: ${message.author.tag}`)
        await message.reply('<:9461systemmessageuser:832746523758166088> Thank you for your complaint!')

    }
}