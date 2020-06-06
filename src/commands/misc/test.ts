import { CommandoMessage } from 'discord.js-commando'
import Seraphae from '../../core/Client'
import SeraphaeCommand from '../../core/Command'

export default class TestCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'test',
      group: 'misc',
      memberName: 'test',
      description: 'test command',
      examples: ['test']
    })
  }

  run = (msg: CommandoMessage) => {
    return msg.say((this.client as Seraphae).test())
  }
}