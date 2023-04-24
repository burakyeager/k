const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settings.guild.roles.generalAuth)) return
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `${çarpı} Bir kullanıcıya ait ID gir ya da etiketle!` }).then(message => deleteMessage(message))
    if (member.id === client.user.id) return message.channel.send({ content: `${çarpı} Botun verilerini sıfırlayamazsınız!` }).then(message => deleteMessage(message))
    //if (member.id === message.author.id) return message.channel.send({ content: `${çarpı} Kendinizin verilerini sıfırlayamazsınız!` }).then(message => deleteMessage(message))
    if (!message.guild.members.cache.get(member.id)) return message.channel.send({ content: `${çarpı} Bu kullanıcı sunucuda değil!` }).then(message => deleteMessage(message))
    if (!message.guild.members.cache.get(member.id).roles.cache.has(settings.guild.roles.registerAuth)) return message.channel.send({ content: `${çarpı} Bu kullanıcı zaten kayıt yetkilisi değil!` }).then(message => deleteMessage(message))
    db.delete(`Kayıt.${member.id}`)
    db.delete(`Kayıtk.${member.id}`)
    db.delete(`Kayıte.${member.id}`)
    db.delete(`Kayıtd.${member.id}`)
    db.delete(`Kayıtg.${member.id}`)
    
    message.channel.send({ content: `${onay} ${member.user.tag} başarıyla sıfırlandı!` }).then(message => deleteMessage(message))
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['teyit-sıfırla'],
  permLevel: 0
}

exports.help = {
  name: 'Teyit Sıfırla',
  description: 'Üyeyi teyit sıfırlar',
  usage: 'teyit-sıfırla'
}