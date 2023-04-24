const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settings.guild.roles.registerAuth)) return
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `${çarpı} Bir kullanıcıya ait ID gir ya da etiketle!` }).then(message => deleteMessage(message))
    if (member.id === client.user.id) return message.channel.send({ content: `${çarpı} Botun isimlerini kontrol edemezsin!` }).then(message => deleteMessage(message))
    if (!message.guild.members.cache.get(member.id)) return message.channel.send({ content: `${çarpı} Bu kullanıcı sunucuda değil!` }).then(message => deleteMessage(message))
    message.guild.members.cache.get(member.id).setNickname('')
    db.delete(`Nicks.${member.id}`)
    db.delete(`Kayıtçı.${member.id}`)
    message.guild.members.cache.get(member.id).roles.cache.filter(role => role.name !== '@everyone').map(x => message.guild.members.cache.get(member.id).roles.remove(x.id))
    message.guild.members.cache.get(member.id).roles.add(settings.guild.roles.unRegistered)
    message.channel.send({ content: `${onay} ${member.user.tag} başarıyla kayıtsıza atıldı!` }).then(message => deleteMessage(message))
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['kayıtsız'],
    permLevel: 0
}

exports.help = {
    name: 'Kayıtsız',
    description: 'Üyeyi kayıtsıza atar',
    usage: 'kayıtsız'
}