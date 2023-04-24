const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settings.guild.roles.registerAuth)) return

    if (args[0] === 'genel') {
        const data = Object.keys(db.fetch("Kayıtg")).sort((a,b) => db.fetch(`Kayıtg.${b}`) - db.fetch(`Kayıtg.${a}`))
        const Embed = new Discord.MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`${message.guild.name} - Top 10 Yetkili sıralaması (kayıt)`)
        .setDescription(`${data.slice(0, 10).map((index, item) => `**${item+1}.** ${client.users.cache.get(index) ? client.users.cache.get(index) : 'Unknown User#0000'} - **${db.fetch(`Kayıt.${index}`)}** kayıt (**${db.has(`Kayıte.${index}`) ? db.fetch(`Kayıte.${index}`) : 0}** erkek, **${db.has(`Kayıtk.${index}`) ? db.fetch(`Kayıtk.${index}`) : 0}** kadın, **${db.has(`Kayıtd.${index}`) ? db.fetch(`Kayıtd.${index}`) : 0}** diğer) \n`).toString().replace(/,/g, '') || 'Veri yok.'}`)
        .setTimestamp()
        message.channel.send({ embeds: [Embed] })
    } else {
        const Embed = new Discord.MessageEmbed()
            .setColor('#5865F2')
            .setTitle(`${message.author.tag} - Kayıt Bilgileri`)
            .setThumbnail(message.author.avatarURL({ size: 2048, dynamic: true }))
            .setDescription(`Toplam **${db.has(`Kayıtg.${message.author.id}`) ? db.fetch(`Kayıtg.${message.author.id}`) : 0}** kayıta sahipsin! 👏!

✅ **${db.has(`Kayıt.${message.author.id}`) ? db.fetch(`Kayıt.${message.author.id}`) : 0}** toplam kayıt
👩 **${db.has(`Kayıtk.${message.author.id}`) ? db.fetch(`Kayıtk.${message.author.id}`) : 0}** kadın kayıt
👨 **${db.has(`Kayıte.${message.author.id}`) ? db.fetch(`Kayıte.${message.author.id}`) : 0}** erkek kayıt
✨ **${db.has(`Kayıtd.${message.author.id}`) ? db.fetch(`Kayıtd.${message.author.id}`) : 0}** diğer kayıt

Son kayıt tarihi: **${db.has(`SonKayıt.${message.author.id}`) ? db.fetch(`SonKayıt.${message.author.id}`) : 0}**`)

            .setFooter({ text: `${message.author.tag} - ${message.author.id}`, iconURL: message.author.avatarURL({ size: 2048, dynamic: true }) })
            .setTimestamp()
        message.channel.send({ embeds: [Embed] })
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['stat'],
    permLevel: 0
}

exports.help = {
    name: 'Stat',
    description: 'Sunucuya yeni bir üyenin nicklerini kontrol etmek için kullanılır.',
    usage: 'stat'
}