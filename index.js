const Discord = require('discord.js')
const client = new Discord.Client({ intents: new Discord.Intents(32767) })
const discordModals = require('discord-modals')
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals')
const settings = require('./settings.json')
const db = require('quick.db')
const fs = require('fs')
const http = require('http')
const express = require('express')
const app = express()
const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')
require('./util/eventLoader.js')(client)
discordModals(client)

global.log = (message) => console.log('[CUSTY REGISTER LOG]', message)
global.db = db
global.çarpı = "❌"
global.onay = "✅"
global.deleteMessage = (message) => setTimeout(() => { message?.delete() }, 5000)

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
fs.readdir('./komutlar/', (Error, Files) => {
    if (Error) console.error(Error)
    console.log(`${Files.length} Komut Yüklenecek!`)
    Files.forEach(Pepe => {
        let Props = require(`./komutlar/${Pepe}`)
        console.log(`→ Yüklenen Komut: ${Props.help.name}.`)
        client.commands.set(Props.help.name, Props)
        Props.conf.aliases.forEach(Alias => {
            client.aliases.set(Alias, Props.help.name)
        })
    })
})

process.on('uncaughtException', err => {
    return console.error(`=======================

    Error: ${err}

=======================`)
})

client.on('guildMemberAdd', async member => {
    log(`[+] ${member.user.tag} (${member.id}) kullanıcısı "${member.guild.name}" sunucuya katıldı!`)
    member.guild.channels.cache.get(settings.guild.registerChannel)?.send({
        content: `\`•\` Sunucuya hoş geldin ${member}! 🎉

\`•\` Sunucuya erişim sağlamak için lütfen soldaki \`ses teyit odalarına\` giriş yapın 🔉

\`•\` Hesabın \`${moment(member.user.createdAt).format('LLLL')}\` (\`${convertDate(member.user.createdAt)} önce\`) tarihinde oluşturulmuş 📅

\`•\` Sunucuya girdiğiniz andan itibaren \`kuralları okumuş ve kabul edilmiş sayılacaksınız\`. Eğer bir kural ihlali yaparsan \`ceza işlemi uygulanacak\` 📜`, files: ["https://cdn.discordapp.com/attachments/993635573627637831/997938880261148752/happy-cute.gif"]})//.send({ embeds: [new Discord.MessageEmbed().setColor('AQUA').setDescription()] })
member.roles.add(settings.guild.roles.unRegistered)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (!interaction.member.roles.cache.has(settings.guild.roles.registerAuth)) return;

    if (interaction.customId.startsWith('register.')) {
        const user = interaction.customId.split('.')[1]
        const member = interaction.guild.members.cache.get(user)
        if (!member) return interaction.reply({ content: `${çarpı} Kullanıcıyı sunucuda bulamadım!`, ephemeral: true })
        if (!member.roles.cache.has(settings.guild.roles.unRegistered)) return interaction.reply({ content: `${çarpı} Kullanıcıda kayıtsız rolü yok!`, ephemeral: true })
        const modal = new Modal()
            .setCustomId(`kayıt.${user}`)
            .setTitle(`${member.user.tag} - Sunucu Kayıt`)
            .addComponents(
                new TextInputComponent()
                    .setCustomId(`isim.${user}`)
                    .setLabel('İsim')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(32)
                    .setPlaceholder('İsim yazın.'),
                new TextInputComponent()
                    .setCustomId(`yaş.${user}`)
                    .setLabel('Yaş')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setPlaceholder('Yaş yazın.'),
                new TextInputComponent()
                    .setCustomId(`tür.${user}`)
                    .setLabel('Kayıt Türü')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(1)
                    .setPlaceholder('Erkek (e), Kadın(k), Diğer(d).')
            )
        showModal(modal, {
            client: client,
            interaction: interaction
        })
    }
})

client.on('modalSubmit', async (modal) => {
    if (!modal.guild.members.cache.get(modal.user.id).roles.cache.has(settings.guild.roles.registerAuth)) return
    if (modal.customId.startsWith('kayıt')) {
        const userId = modal.customId.split('.')[1]
        const user = modal.guild.members.cache.get(userId)
        if (!user) return modal.reply({ content: `${çarpı} Kullanıcıyı sunucuda bulamadım!`, ephemeral: true })
        if (!user.roles.cache.has(settings.guild.roles.unRegistered)) return modal.reply({ content: `${çarpı} Kullanıcıda kayıtsız rolü yok!`, ephemeral: true })
        const isim = modal.getTextInputValue(`isim.${userId}`)
        const yaş = modal.getTextInputValue(`yaş.${userId}`)
        const tür = modal.getTextInputValue(`tür.${userId}`)?.toLowerCase()
        if (db.fetch('taglıAlım') === true && settings.guild.tag.length > 0 && !user.user.username.includes(settings.guild.tag)) return modal.channel.send({ embeds: [new Discord.MessageEmbed().setColor('#ff0000').setDescription(`${çarpı} Sunucu şu an taglı alımda. Kullanıcının isminde tag bulunmadığı için kayıt edemezsin!`)], ephemeral: true })
        if (!isim) return modal.reply({ content: `${çarpı} Geçersiz isim tanımı.`, ephemeral: true })
        if (!yaş || isNaN(yaş)) return modal.reply({ content: `${çarpı} Geçersiz yaş tanımı (harf içeriyor olabilir).`, ephemeral: true })
        if (!tür || !['e', 'k', 'd'].includes(tür)) return modal.reply({ content: `${çarpı} Geçersiz kayıt türü [Erkek(e), Kadın(k), Diğer(d)].`, ephemeral: true })
        if (typeof settings.normalName !== 'boolean') return modal.reply({ content: `Hata meydana geldi. Konsola göz atın.`, ephemeral: true }), log('settings.normalName is not boolean. (true or false)')
        user.setNickname(settings.normalName === true ? (settings.guild.tag.length > 0 ? `${settings.guild.tag} ${isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()} ${settings.line.trim()} ${yaş}` : `${isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()} ${settings.line.trim()} ${yaş}`) : settings.guild.tag.length > 0 ? `${settings.guild.tag} ${isim} ${settings.line} ${yaş}` : ``)
        user.roles.remove(settings.guild.roles.unRegistered)
        if (tür === 'e') {
            user.roles.add(settings.guild.roles.man)
            db.add(`Kayıte.${modal.user.id}`, 1)
            log(`${user.user.tag} Erkek olarak kayıt edildi.`)
        } else if (tür === 'k') {
            user.roles.add(settings.guild.roles.woman)
            db.add(`Kayıtk.${modal.user.id}`, 1)
            log(`${user.user.tag} Kadın olarak kayıt edildi.`)
        } else if (tür === 'd') {
            user.roles.add(settings.guild.roles.other)
            db.add(`Kayıtd.${modal.user.id}`, 1)
            log(`${user.user.tag} Diğer olarak kayıt edildi.`)
        }
        db.add(`Kayıt.${modal.user.id}`, 1)
        db.add(`Kayıtg.${modal.user.id}`, 1)
        db.push(`Nicks.${userId}`, `${isim} ${yaş} (${tür}) - \`${moment().format('LLLL')}\``)
        db.set(`Kayıtçı.${userId}`, { Register: modal.user.id, Type: tür })
        db.set(`SonKayıt.${modal.user.id}`, moment().format('LLLL'))
        modal.reply({ embeds: [new Discord.MessageEmbed().setColor('#03fc07').setDescription(`${onay} ${user} (**${userId}**) kullanıcısı sunucuya ${modal.user} (**${modal.user.id}**) tarafından kayıt edildi!`)] })
    }
})

client.on('guildMemberRemove', async member => {
    if (db.has(`Kayıtçı.${member.user.id}`)) {
        const data = db.fetch(`Kayıtçı.${member.user.id}`)
        db.subtract(`Kayıt${data.Type}.${data.Register}`, 1)
        db.subtract(`Kayıtg.${data.Register}`, 1)
    }
})

global.convertDate = (date) => {
    const startedAt = Date.parse(date)
    var msecs = Math.abs(new Date() - startedAt)

    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365))
    msecs -= years * 1000 * 60 * 60 * 24 * 365
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30))
    msecs -= months * 1000 * 60 * 60 * 24 * 30
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7))
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24))
    msecs -= days * 1000 * 60 * 60 * 24
    const hours = Math.floor(msecs / (1000 * 60 * 60))
    msecs -= hours * 1000 * 60 * 60
    const mins = Math.floor((msecs / (1000 * 60)))
    msecs -= mins * 1000 * 60
    const secs = Math.floor(msecs / 1000)
    msecs -= secs * 1000

    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`

    string = string.trim()
    return `${string}`
}

client.login(settings.token)