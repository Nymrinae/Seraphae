import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'

export default class PingCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'ping',
      group: 'bot',
      memberName: 'ping',
      description: 'Ping-pong!',
      examples: ['ping']
    })
  }

  run = (msg: CommandoMessage) => msg.say('pong')
}