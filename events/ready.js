const Discord = require('discord.js')
const settings = require('../settings.json')
module.exports = async (client) => {

  /*
    WATCHING  : !ping izliyor
    LISTENING : !ping dinliyor
    PLAYING   : !ping oynuyor 
    STREAMING : !ping yayında
  */

  const mainGuild = client.guilds.cache.get(settings.guild.id)
  if (!mainGuild) return console.log('Ana sunucununya ait bir ID bulunamadı! Lütfen sunucuya ait ID yi doğru giriniz!'), process.exit(0)
  var owner = settings.sahip[0]
  client.users.resolve(owner) ? mainOwner = await client.users.fetch(owner) : mainOwner = await client.users.fetch('675593025468235806')
  client.user.setActivity(`${mainGuild.name} 💙 ${mainOwner?.tag}`, { type: 'PLAYING', url: 'https://twitch.tv/elraenn' })
  console.log(`${client.user.username} "${mainGuild.name}" için hazır!`)
  setInterval(() => {
    client.user.setActivity(`${mainGuild.name} 💙 ${mainOwner?.tag}`, { type: 'PLAYING', url: 'https://twitch.tv/elraenn' })
  }, 60000)
}