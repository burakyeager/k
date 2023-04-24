const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settings.guild.roles.generalAuth)) return
    const Choose = args[0].toLowerCase()
    if (Choose == 'taglıalım') {
        if (args[1] == 'aç') {
            db.set(`taglıAlım`, true)
            message.channel.send({ content: `${onay} Taglı Alım açıldı.` }).then(message => deleteMessage(message))
        } else if (args[1] == 'kapat') {
            db.delete(`taglıAlım`)
            message.channel.send({ content: `${onay} Taglı Alım kapatıldı.` }).then(message => deleteMessage(message))
        } else {
            message.channel.send({ content: `Taglı alım aç/kapat? (Mevcut: **${db.has(`taglıAlım`) ? 'Açık' : 'Kapalı'}**)` }).then(message => deleteMessage(message))
        }
    }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['settings', 'ayarlar'],
  permLevel: 0
}

exports.help = {
  name: 'Ayarlar',
  description: 'Sunucu ayarlarını ayarlayın.',
  usage: 'ayarlar'
}