const { Command, colors } = require('../../utils')
const { MessageEmbed } = require('discord.js')

module.exports = class welcome extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['bem-vindo', 'bemvindo']
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
        let guildDocument = await this.client.database.Guilds.findById(message.guild.id)
        if (args[0] === 'canal') {
            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(' ')) || message.guild.channels.cache.get(args[1]) || message.mentions.channels.first()
            if (!channel || channel.type === 'category') return message.channel.send('Coloque um canal válido!')

            guildDocument.channelWelcome = channel.id
            guildDocument.save().then(async () => {
                await message.channel.send(`Canal definido: ${channel}`)
            })
        } else if (args[0] === 'mensagem') {
            let mensagem = args.slice(1).join(' ')

            if (!mensagem) return message.channel.send(`Coloque qual será a mensagem do welcome, lembre-se nósso sistema aceita embed...`)

            guildDocument.welcomeMessage = mensagem
            guildDocument.save().then(async () => {
                guildDocument.welcomeModule = true
                guildDocument.save().then(async () => {
                    let defaultChannel = await message.guild.channels.cache.get(guildDocument.channelWelcome)
                    if (!defaultChannel) return message.channel.send(`Este servidor não possui um canal definido no welcome...\nUse: \`${message.prefix}welcome canal #canal\` para definir um e use o comando novamente!`)
                    await message.channel.send(`Mensagem definida\nWelcome Ativado...`)
                })
            })
        } else if (args[0] === 'autorole') {
            var role = message.mentions.roles.first();
            if (!role) return message.channel.send(`${message.author},por favor mencione o cargo.`)
            guildDocument.novato = role.id;
            guildDocument.save().then(() => {
                let embed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`Você definiu o cargo ${role} como auto-role Com sucesso.`)
                    .setColor(colors.default)
                    .setFooter("🧁・Discord da Jeth", message.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setTimestamp();
                message.channel.send(embed)
            })
        } else if (args[0] === 'desativar') {
            if (!guildDocument.welcomeModule) return message.channel.send(`Este servidor não possui um welcome ativado!`)
            let lastChannel = message.guild.channels.cache.get(guildDocument.channelWelcome)
            guildDocument.welcomeModule = false
            guildDocument.channelWelcome = ''
            guildDocument.welcomeMessage = ''

            guildDocument.save().then(async () => {
                await message.channel.send(`O welcome foi removido do canal ${lastChannel} e desativado`)
            })
        } else {
            let embed = new MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setDescription(`Dúvidas de como usar o welcome?\nAqui vai algumas dicas...`)
                .setColor(colors.default)
                .addField('Modos de usar', [
                    `\`${guildDocument.prefix}welcome canal #canal\` - Define o canal onde o welcome será definido.`,
                    `\`${guildDocument.prefix}welcome mensagem <mensagem>\` - Define a mensagem que será exibida no welcome.`,
                    `\`${guildDocument.prefix}welcome desativar\` - Caso haja algum welcome ligado/definido, ele será removido e o sistema desligado.`,
                    `\`${guildDocument.prefix}welcome autorole @role\` - Para setar uma role ao usuario entrar automatico.`,
                    `\n**Lembre-se se ver os \`Placeholders\` abaixo para não errar nada!**\n`
                ].join('\n'), false)
                .addField('Placeholders', [
                    `O sistema de welcome(bem-vindo) aceita embed!`,
                    `Não sabe fazer uma? é facil clique aqui: **[[CLIQUE]](https://leovoel.github.io/embed-visualizer/)**`,
                    `**[Utilize ${guildDocument.prefix}embed para mais informações]**`,
                    `\n**Lembre-se se ver os \`Parâmetros\` abaixo para não errar nada!**\n`
                ].join('\n'), false)
                .addField('Parâmetros.', [
                    '**${USER}** - Para marcar o membro na entrada.',
                    '**${CONTA-CRIADA}** - Para saber a data de criação da conta do membro.',
                    '**${AVATAR}** - Para definir o avatar do membro.',
                    '**${USER-ID}** - Para definir o **ID** do membro.',
                    '**${USER-NAME}** - Para definir o nome do membro.',
                ].join('\n'), false)

            let embed2 = new MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(`Dúvidas de como esta o welcome?\nAqui vai o seu painel...`)
                .setColor(colors.default)
            let canalBemVindo = `<:rejected:739831089543118890> Desativado`;
            if (guildDocument.channelWelcome.length) {
                canalBemVindo = `<:concludo:739830713792331817> Ativo | Canal: <#${guildDocument.channelWelcome}>`;
            }
            embed2.addField("Welcome | Canal:", canalBemVindo);
            let MsgAt = `<a:warnRoxo:664240941175144489> Desativado`;
            if (guildDocument.novato.length) {
                MsgAt = `<:concludo:739830713792331817> Ativo: <@&${guildDocument.novato}>`;
            }
            embed2.addField("Welcome | Auto-Role:", MsgAt);
            let MsgCount = `<:rejected:739831089543118890> Desativado`;
            if (guildDocument.welcomeMessage.length) {
                MsgCount = `<:concludo:739830713792331817> Ativo | Mensagem: ${guildDocument.welcomeMessage.length > 800 ? `${guildDocument.welcomeMessage.slice(0, 801)}[...]` : guildDocument.welcomeMessage}`;
            }
            embed2.addField("Welcome | Mensagem de Bem-vindo:", MsgCount);
            let msgWelcome = guildDocument.welcomeModule ?
                `<:concludo:739830713792331817> Ativo` :
                `<:rejected:739831089543118890> Desativado`
            embed2.addField("Welcome está:", msgWelcome)


            let embedCount = 1
            message.channel.send({ embed }).then(async m => {
                await m.react('666762183249494027')// ir para frente
                let col = m.createReactionCollector((e, u) => (u.id == message.author.id) &&
                    (e.emoji.id == '666762183249494027' /* para frente */ || e.emoji.id == '665721366514892839') /* para trás */,
                    { time: 180000, errors: ['time'] })
                let reacoes = col.on('collect', async (e, u) => {
                    if (embedCount != 2 && e.emoji.id == '666762183249494027') { // ir para frente

                        await m.react('665721366514892839')
                        e.users.cache.map(u => e.remove(u.id))
                        m.edit(embed2)
                        embedCount = 2
                        await m.react('665721366514892839')// volta para trás
                    } else if (e.emoji.id == '665721366514892839' && embedCount == 2) {

                        await m.react('666762183249494027')
                        e.users.cache.map(u => e.remove(u.id))

                        m.edit(embed)
                        embedCount = 1
                    }
                })
            })
        }
    }
}