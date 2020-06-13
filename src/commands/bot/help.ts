import { CommandoMessage, CommandGroup, Command } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'

import Seraphae from '../../core/Client'
import SeraphaeCommand from '../../core/Command'

import { capitalizeFirstLetter } from '../../helpers/functions'

export default class HelpCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'help',
      group: 'bot',
      memberName: 'help',
      description: 'Standard Help command',
      examples: ['help'],
      args: [{
        key: 'cmd',
        prompt: 'None',
        type: 'string',
        default: () => ''
      }]
    })
  }

  run = (msg: CommandoMessage, { cmd }) => {
    const groups: Array<CommandGroup> = this.client.registry.groups.map(x => x)
    const commands: Array<Command> = this.client.registry.commands.map(x => x)

    if (cmd) {
      const currentCommand = commands.filter(c => c.name === cmd || c.aliases.includes(cmd))[0]

      if (!currentCommand)
        return msg.say('Command not found.')

      const { aliases, name, description, examples, clientPermissions, userPermissions } = currentCommand
      const commandHelpEmbed = new MessageEmbed()
        .setTitle(name)
        .setDescription(description)
        .addFields([
          { name: '**Aliases**', value: aliases.length ? aliases.join(', ') : 'None' },
          { name: '**Usage**', value: examples.join('\n') },
          { name: '**Required permissions**', value: [
            `Bot: ${clientPermissions ? clientPermissions.join(' ') : 'None'}`,
            `User: ${userPermissions ? userPermissions.join(' ') : 'None'}`
          ].join('\n')}
        ])

      return msg.say(commandHelpEmbed)
    }

    const generalHelpEmbed = new MessageEmbed()
      .setTitle('Help')
      .setDescription([
        `Current prefix: \`${this.client.commandPrefix}\``,
        `For specific command information, type ${this.client.commandPrefix}help [commandName]`
      ].join('\n'))

    groups
      .filter(grp => !['commands', 'util'].includes(grp.id)) // removes Commando commands
      .forEach(group => {
        const groupId = capitalizeFirstLetter(group.id)
        const groupCommandsSize = group.commands.size

        const commands = group.commands.filter(cmd => !cmd.hidden).map(cmd => `\`${cmd.name}\``).join(' ')

        generalHelpEmbed.addField(`${groupId} (${groupCommandsSize})`, commands)
      })

    return msg.say(generalHelpEmbed)
  }
}