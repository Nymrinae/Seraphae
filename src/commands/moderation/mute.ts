import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import { MessageEmbed } from 'discord.js'

export default class KickCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'mute',
      group: 'moderation',
      memberName: 'mute',
      description: 'Mute someone.',
      examples: ['mute'],
      args: [{
        key: 'user',
        prompt: 'None',
        type: 'user',
        default: (msg: CommandoMessage) => msg.author
      }]
    })
  }

  run = (msg: CommandoMessage, { user }) => {
    return msg.say('Muted!')
  }
}