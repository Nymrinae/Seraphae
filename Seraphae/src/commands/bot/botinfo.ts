import { CommandoMessage } from 'discord.js-commando'
import { MessageEmbed, version } from 'discord.js'
import SeraphaeCommand from '../../core/Command'

export default class BotInfoCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'botinfo',
      aliases: ['bi'],
      group: 'bot',
      memberName: 'bot information',
      description: 'Display bot\'s information',
      examples: ['botinfo']
    })
  }

  run = (msg: CommandoMessage) => {
    const embed = new MessageEmbed()
      .setAuthor(this.client.user.username, this.client.user.avatarURL())
      .setDescription('Ciaossu! I am Seraphae!')
      .setThumbnail(this.client.user.avatarURL())
      .addField('Serving', `${this.client.guilds.cache.size} guilds`, true)
      .addField('NodeJS Version', `${process.version}`, true)
      .addField('DiscordJS version', `${version}`, true)

    return msg.embed(embed)
  }
}