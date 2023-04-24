const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(settings.guild.roles.registerAuth)) return
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send({ content: `${çarpı} Bir kullanıcıya ait ID gir ya da etiketle!` }).then(message => deleteMessage(message))
    if (member.id === client.user.id) return message.channel.send({ content: `${çarpı} Botun isimlerini kontrol edemezsin!` }).then(message => deleteMessage(message))
    if (!message.guild.members.cache.get(member.id)) return message.channel.send({ content: `${çarpı} Bu kullanıcı sunucuda değil!` }).then(message => deleteMessage(message))

    const Embed = new Discord.MessageEmbed()
        .setColor('#5865F2')
        .setTitle(`${member.user.tag} - İsimleri (${db.has(`Nicks.${member.user.id}`) ? db.fetch(`Nicks.${member.user.id}`).length : 0})`)
        .setDescription(db.has(`Nicks.${member.user.id}`) ? db.fetch(`Nicks.${member.user.id}`).join('\n') : 'Bu kullanıcıya ait hiç isim kayıtlı değil!')
        .setFooter({ text: `${member.user.tag} - ${member.user.id}`, iconURL: member.user.avatarURL({ size: 2048, dynamic: true }) })
        .setTimestamp()
    message.channel.send({ embeds: [Embed] })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['nickler', 'nick'],
    permLevel: 0
}

exports.help = {
    name: 'Nickler',
    description: 'Sunucuya yeni bir üyenin nicklerini kontrol etmek için kullanılır.',
    usage: 'nicks'
}