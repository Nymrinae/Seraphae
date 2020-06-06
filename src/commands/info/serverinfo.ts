import { CommandoMessage } from 'discord.js-commando'
import { MessageEmbed, TextChannel } from 'discord.js'
import SeraphaeCommand from '../../core/Command'

import { addPluralForm } from '../../helpers/functions'

export default class ServerInfoCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'serverinfo',
      aliases: ['si'],
      group: 'info',
      memberName: 'serverinfo',
      description: 'Display server informations',
      examples: ['serverinfo', 'si']
    })
  }

  run = (msg: CommandoMessage) => {
    const {
      id, name, region, owner,
      members, roles, channels
    } = msg.guild

    const regions = {
      'brazil': ':flag_br: Brazil',
      'europe': ':flag_eu: Europe',
      'hongkong': ':flag_hk: Hong Kong',
      'india': 'flag_in Inde',
      'japan': ':flag_jp: Japan',
      'russia': ':flag_ru: Russia',
      'singapore': ':flag_sg: Singapore',
      'southafrica': ':flag_za:  South Africa',
      'sydney': ':flag_au: Sydney',
      'us-central': ':flag_us: U.S. Central',
      'us-east': ':flag_us: U.S. East',
      'us-south': ':flag_us: U.S. South',
      'us-west': ':flag_us: U.S. West'
    }

    const bots = members.cache.filter(m => m.user.bot).size

    const onlineEmoji = this.client.emojis.cache.get('709490984647393390')
    const idleEmoji = this.client.emojis.cache.get('709490984312111134')
    const dndEmoji = this.client.emojis.cache.get('709490983896612875')
    const offlineEmoji = this.client.emojis.cache.get('709490983892549665')
    const streamingEmoji = this.client.emojis.cache.get('709497953458585750')

    const textChannels = channels.cache.filter(c => c.type === 'text' || c.type === 'category').size
    const voiceChannels = channels.cache.filter(c => c.type === 'voice').size
    const getMembersWithStatus = (status: string): number => members.cache.filter(m => m.presence.status === status).size

    const embed = new MessageEmbed()
      .setAuthor(name, msg.guild.iconURL())
      .setThumbnail(msg.guild.iconURL())
      .addField('**General**', [
        `** × ID:** ${id}`,
        `** × Owner:** ${owner.user.username}#${owner.user.discriminator}`,
        `** × Region:** ${regions[region]}`,
        // @ts-ignore
        ` ** × Created at:** ${msg.channel.guild.createdAt.toUTCString().slice(4, 16)}`,
        // @ts-ignore
        ` ** × Joined this server at:** ${new Date(msg.channel.guild.joinedTimestamp).toUTCString().slice(4, 16)}`
      ].join('\n'))
      .addField(`**Members (${members.cache.size})**`, [
          `${onlineEmoji} ${getMembersWithStatus('online')} online`,
          `${idleEmoji} ${getMembersWithStatus('idle')} idle`,
          `${dndEmoji} ${getMembersWithStatus('dnd')} dnd`,
          `${offlineEmoji} ${getMembersWithStatus('offline')} offline`,
          `${streamingEmoji} ${getMembersWithStatus('streaming')} streaming`
       ].join(' '))
      .addField('**Server**', [
        `**Roles**: ${roles.cache.size}`, [
          `**Channels** (${channels.cache.size}): **${textChannels}** ${addPluralForm('text channel', textChannels)}`,
          `and **${voiceChannels}** ${addPluralForm('voice channel', voiceChannels)}`
        ].join(' ')
      ].join('\n'))

    return msg.embed(embed)
  }
}