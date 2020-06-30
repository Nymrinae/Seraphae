import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class AvatarCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'avatar',
      group: 'information',
      memberName: 'avatar',
      description: 'Display avatar of the user mentioned.',
      examples: ['avatar'],
      args: [{
        key: 'user',
        prompt: 'None',
        type: 'user',
        default: (msg: CommandoMessage) => msg.author
      }]
    })
  }

  run = (msg: CommandoMessage, { user }) => {
    const embed = new MessageEmbed()
      .setTitle(`${user.tag}'s avatar`)
      .setImage(`${user.displayAvatarURL()}?size=256`.replace('webp', 'gif'))

    return msg.embed(embed)
  }
}