import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'
import SeraphaeCommand from '../../core/Command'

export default class AvatarCommand extends SeraphaeCommand {
  constructor(client: CommandoClient) {
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
      .setImage(user.displayAvatarURL())

    return msg.embed(embed)
  }
}