const { WebhookClient } = require("discord.js")
const { Command, TranslateFunctions, colors } = require('../utils')
const { MessageEmbed } = require('discord.js')
module.exports = async function onReady() {
    console.log(`Logado.`);
    let s = [
        { name: `🥂 v5.9.4 disponível!.`, type: 'WATCHING', url: 'https://www.youtube.com/watch?v=zWM4qq3MzFE' },
        { name: `🏆 Anda perdido ? me mencione!`, type: 'WATCHING', url: 'https://www.youtube.com/watch?v=qlbAaWq1-fs' },
        { name: `🔑 Entre em contato para reportar qualquer bug encontrado.`, type: 'WATCHING', url: 'http://www.clickjogos.com.br/' },
        { name: `⚜️ Lançamento do novo Sistema VIP!`, type: 'WATCHING', url: 'https://www.twitch.tv/cellbit' },
        { name: `♨️ Os melhores programadores da geração!`, type: 'WATCHING', url: 'https://www.twitch.tv/cellbit' },
        { name: `📣 Uma changelog vasta de atualizações!`, type: 'WATCHING', url: 'https://www.twitch.tv/cellbit' },
        { name: `🎍 Desfrute de uma moderação a nível superior!`, type: 'WATCHING', url: 'https://www.twitch.tv/cellbit' },
        { name: `👩‍🚀 Mais Comandos legais para Você!`, type: 'WATCHING', url: 'https://www.twitch.tv/cellbit' },

        // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
        // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
        // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
        // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' }

    ];

    setInterval(() => {
        let game = s[Math.floor(Math.random() * s.length)]
        this.user.setPresence({ activity: game })
    }, 15000)

    // Essa funcao busca na Db usuarios mutados e tenta remover o cargo deles
    // se ja passou tempo de mute
    const muteCheck = () => {
        const usuariosMutados = this.database.Mutados.find({})
        for (let user = 0; user < usuariosMutados.length; user++) {
            if (usuariosMutados[user].time >= Date.now()) {
                const server = this.guilds.cache.get(usuariosMutados[user].server)
                const userId = usuariosMutados[user]._id
                const channel = this.channels.cache.get(usuariosMutados[user].channel)
                try {
                    server.member(userId).roles
                        .remove(
                            server.roles.cache.find(r => r.name == "Muted Jeth")
                        )
                            .then(() => {
                                channel.send(`Usuario ${this.users.cache.get(userId)} desmutado. <:sing_Jeth:677598304371998819>`)
                                this.database.Mutados.findByIdAndDelete(userId)
                                console.log(`Usuario ${this.users.cache.get(userId).tag} foi desmutado e removido da Db`)
                            })
                }

                catch(err) {
                    console.log(`Algo errado em tentar remover cargo de ${this.users.cache.get(userId)}, ${err}`)
                    this.database.Mutados.findByIdAndDelete(userId)
                }

            }
        }
    }
    setInterval(muteCheck, 30 * 1000)

    // Aqui posta os comandos
    this.api.applications(this.user.id).commands.post({
        data: {
            name: "ping",
            description: "Mostra o ping do bot;"
        }
    })


    this.ws.on("INTERACTION_CREATE", async (interaction, message) => {
        // Faço os comandos aqui
        const command = interaction.data.name.toLowerCase()
        
        const args = interaction.data.options

        if (command === 'ping') {
            // Infelizmente tem que ter a bosta do if
            this.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                    //data: {
                        // Caso queira um slash que so author possa ver deixe habilitado
                        //flags: 1 << 6
                    //}
                }
            })
            // Responde a menssagem com um inline reply
            return await new WebhookClient(this.user.id, interaction.token).send(`<:2690chart:832746523980201994> ⇝ Ping: ${this.ws.ping}ms`)
            
        }
        if (command === 'contador') {
            // Infelizmente tem que ter a bosta do if
            this.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                    //data: {
                        // Caso queira um slash que so author possa ver deixe habilitado
                        //flags: 1 << 6
                    //}
                }
            })
                  
            module.exports = class anuncio extends Command {
                constructor(name, client) {
                    super(name, client)
            
                    this.aliases = ['anunciar', 'anunciment']
                    this.category = 'Moderation'
                }
            
            async run(message, args) {
            const embedA = new MessageEmbed()

            .setTimestamp()
            .setColor(colors.mod)
            .setTitle('**Err:**', `${message.author}`, true)
            .setDescription('Missing Permissions') // inline false
            .addField('*Verifique se você possui a permissão:*', '`MANAGE_GUILD`', true)
            .setFooter('🧁・Discord da Jeth', message.author.displayAvatarURL())
        if (!message.member.hasPermission('MANAGE_GUILD'))
            return message.channel.send(embedA)
        let guildDocument = await this.client.database.Guilds.findById(message.guild.id)
        if (args[0] === 'canal') {
            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(' ')) || message.guild.channels.cache.get(args[1]) || message.mentions.channels.first()
            if (!channel || channel.type === 'category') return message.channel.send('Coloque um canal válido!')

            guildDocument.countChannel = channel.id
            guildDocument.save().then(async () => {
                await message.channel.send(`Canal definido: ${channel}`)
            })
        } else if (args[0] === 'mensagem') {
            let mensagem = args.slice(1).join(' ')

            if (!mensagem) {
                return message.channel.send(`Coloque qual será a mensagem do contador, lembre-se "{cor - tipo}" será o tipo/cor do contador...`)
            }

            // agora é preciso separar estes includes, código por código, pois todos juntos não é aceito e da erro, burlando todo o sistema.
            if (mensagem.includes('{pinky}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{green}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{gold}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{amarelo}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{redblue}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{natal}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{bouncepink}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{roxo}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }
            if (mensagem.includes('{rainbow}') && !guildDocument.partner) {
                return message.channel.send('<a:warnRoxo:664240941175144489> Este tipo de contador é apenas para servidores premium!')
            }

            guildDocument.countMessage = mensagem
            guildDocument.count = true
            guildDocument.save()
            let defaultChannel = await message.guild.channels.cache.get(guildDocument.countChannel)
            if (!defaultChannel) return message.channel.send(`Este servidor não possui um canal definido no contador...\nUse: \`${message.prefix}contador canal #canal\` para definir um e use o comando novamente!`)
            setTimeout(async () => {
                //ja volto ai  
                await message.channel.send(`Mensagem definida como \`${guildDocument.countMessage}\`\nContador ativado...`)
                await defaultChannel.setTopic
                    (guildDocument.countMessage.replace('{azul}', TranslateFunctions.azul(message.guild.memberCount))
                        .replace('{pinky}', TranslateFunctions.pinky(message.guild.memberCount))
                        .replace('{gold}', TranslateFunctions.gold(message.guild.memberCount))
                        .replace('{green}', TranslateFunctions.green(message.guild.memberCount))
                        .replace('{rosa}', TranslateFunctions.rosa(message.guild.memberCount))
                        .replace('{red}', TranslateFunctions.red(message.guild.memberCount))
                        .replace('{ruby}', TranslateFunctions.ruby(message.guild.memberCount))
                        .replace('{amarelo}', TranslateFunctions.amarelo(message.guild.memberCount))
                        .replace('{violeta}', TranslateFunctions.violeta(message.guild.memberCount))
                        .replace('{natal}', TranslateFunctions.natal(message.guild.memberCount))
                        .replace('{redblue}', TranslateFunctions.redblue(message.guild.memberCount))
                        .replace('{redblack}', TranslateFunctions.redblack(message.guild.memberCount))
                        .replace('{aqua}', TranslateFunctions.aqua(message.guild.memberCount))
                        .replace('{ice}', TranslateFunctions.ice(message.guild.memberCount))
                        .replace('{roxo}', TranslateFunctions.roxo(message.guild.memberCount))
                        .replace('{rainbow}', TranslateFunctions.rainbow(message.guild.memberCount))
                        .replace('{blk}', TranslateFunctions.blk(message.guild.memberCount))
                        .replace('{bouncepink}', TranslateFunctions.bouncepink(message.guild.memberCount)))
            }, 5000)
        } else if (args[0] === 'remover') {
            if (!guildDocument.count) return message.channel.send(`Este servidor não possui um contador ativado!`)
            let lastChannel = message.guild.channels.cache.get(guildDocument.countChannel)
            guildDocument.count = false
            guildDocument.countChannel = ''
            guildDocument.countMessage = ''

            guildDocument.save().then(async () => {
                await lastChannel.setTopic('')
                await message.channel.send(`O contador foi removido do canal ${lastChannel} e desativado`)
            })
        } else {
            let embed = new MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(`**Seja bem vindo(a) ao painel de configuração !**`)
                .setColor(colors.default)
                .setThumbnail('https://cdn.discordapp.com/emojis/742240408658247791.png')
                .addField('**COMANDOS:**', [
                    `\`${guildDocument.prefix}contador canal #canal\` - Define o canal onde o contador será definido.`,
                    `\`${guildDocument.prefix}contador mensagem <mensagem>\` - Define a mensagem que será exibida no contador.`,
                    `\`${guildDocument.prefix}contador remover\` - Caso haja algum contador ligado/definido, ele será removido e o sistema desligado.`,
                    `\n**Clique na reação abaixo para ver os \`Placeholders\` digite-os corretamente!**\n`], false)

            let embed2 = new MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setThumbnail('https://cdn.discordapp.com/emojis/742240408658247791.png')
                .setDescription(`**Seja bem vindo(a) ao painel de configuração !**\n**Estilos de contador:**`)
                .addField('**CONTADORES**', '**GERAIS** <:supporter:667149933480247297>', false)
                .addField('**{azul}**', '<a:set1:664306595391602698>', true)
                .addField('**{aqua}**', '<a:fil2:735932752171630663>', true)
                .addField('**{violeta}**', '<a:t3:683857609023160322>', true)
                .addField('**{rosa}**', '<a:j_4:675774964997029918>', true)
                .addField('**{ruby}**', '<a:k5:683064092793110558>', true)
                .addField('**{red}**', '<a:S6:682727136519258124>', true)
                .addField('**{redblack}**', '<a:lo7:735367392703807560>', true)
                .addField('**{ice}**', '<a:8ice:737078967244423189>', true)
                .addField('**{blk}**', '<a:BLK9:770793783583309866>', true)
                .addField('**CONTADORES**', '**PARTNER** <:PartnerT:664588135119847431>', false)
                .addField('**{rainbow}**', '<a:rb_1:742627650803335209>', true)
                .addField('**{roxo}**', '<a:JT2:739977300921024522>', true)
                .addField('**{amarelo}**', '<a:j3:683858525641900103>', true)
                .addField('**{pinky}**', '<a:purple4:669217839030468608>', true)
                .addField('**{bouncepink}**', '<a:el5:735367916320587925>', true)
                .addField('**{redblue}**', '<a:dr6:684473203191578664>', true)
                .addField('**{green}**', '<a:g7:683859048638185487>', true)
                .addField('**{gold}**', '<a:gold8:669218300655435776>', true)
                .addField('**{natal}**', '<a:v9:684833174983147520>', true)
                .setColor(colors.default)
            let canalContador = `<a:warnRoxo:664240941175144489> Desativado`;
            if (guildDocument.countChannel.length) {
                canalContador = `<:JethVerificado:666762183249494027> Ativo | Canal: <#${guildDocument.countChannel}>`;
            }
            embed2.addField("<:ligado:665056984021729320> | Canal do Contador:", canalContador);
            let MsgCount = `<:rejected:739831089543118890> Desativado`;
            if (guildDocument.countMessage.length) {
                MsgCount = `<:concludo:739830713792331817> Ativo | Mensagem: ${guildDocument.countMessage.length > 800 ? `${guildDocument.countMessage.slice(0, 801)}[...]` : guildDocument.countMessage}`;
            }
            embed2.addField("<:ligado:665056984021729320> | Mensagem do Contador:", MsgCount);
            let msgWelcome = guildDocument.count ?
                `<:concludo:739830713792331817> Ativo` :
                `<:rejected:739831089543118890> Desativado`
            embed2.addField("Contador está:", msgWelcome)

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
        }
    })
}