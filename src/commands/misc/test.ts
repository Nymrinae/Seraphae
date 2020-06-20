import { CommandoMessage } from 'discord.js-commando'
import Seraphae from '../../core/Client'
import SeraphaeCommand from '../../core/Command'
import { Guild } from 'discord.js'
import axios from 'axios'

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
  }
}