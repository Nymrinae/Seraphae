import { CommandoMessage } from 'discord.js-commando'
import Seraphae from '../../core/Client'
import SeraphaeCommand from '../../core/Command'

export default class TestCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'test',
      group: 'miscellaneous',
      memberName: 'test',
      description: 'test command',
      hidden: true,
      examples: ['test']
    })
  }

  // @ts-ignore
  run = async (msg: CommandoMessage) => {
    const { hello } = (this.client as Seraphae).i18n

    return msg.say(hello)
  }
}