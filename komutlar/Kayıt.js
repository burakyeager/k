const Discord = require('discord.js')
const settings = require('../settings.json')

exports.run = async (client, message, args) => {
   if (!message.member.roles.cache.has(settings.guild.roles.registerAuth)) return
   if (message.channel.id !== settings.guild.registerChannel) return message.channel.send({ content: `${çarpı} Bu komutu bu kanalda kullanamazsın!` }).then(message => deleteMessage(message))
   const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
   if (!member) return message.channel.send({ content: `${çarpı} Bir kullanıcıya ait ID gir ya da etiketle!` }).then(message => deleteMessage(message))
   if (member.id === message.author.id) return message.channel.send({ content: `${çarpı} Kendinizi kayıt edemezsiniz!` }).then(message => deleteMessage(message))
   if (member.id === client.user.id) return message.channel.send({ content: `${çarpı} Kendi botunuzu kayıt edemezsiniz!` }).then(message => deleteMessage(message))
   const row = new Discord.MessageActionRow()
      .addComponents(
         new Discord.MessageButton()
            .setCustomId(`register.${member.id}`)
            .setEmoji('🌴')
            .setLabel('Kayıt etmek için tıklayın.')
            .setStyle('SECONDARY')
      )
   message.channel.send({ components: [row] })
}

exports.conf = {
   enabled: true,
   guildOnly: true,
   aliases: ['kayıt'],
   permLevel: 0
}

exports.help = {
   name: 'Kayıt',
   description: 'Sunucuya yeni bir üye kayıt etmek için kullanılır.',
   usage: 'kayıt'
}