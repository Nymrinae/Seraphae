import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class RandomCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'random',
      group: 'miscellaneous',
      memberName: 'random',
      description: 'Display random value of an array',
      examples: ['random'],
      args: [{
        key: 'values',
        prompt: 'None',
        type: 'string',
      }]
    })
  }

  run = (msg: CommandoMessage, { values }) => {
    const args = values.split(',')

    return msg.say(args[Math.floor(Math.random() * args.length)])
  }
}