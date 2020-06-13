import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import { MessageEmbed } from 'discord.js'
import moment from 'moment'

export default class UserInfoCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'userinfo',
      aliases: ['ui'],
      group: 'information',
      memberName: 'userinfo',
      description: 'Display user informations',
      examples: ['userinfo', 'ui'],
      args: [{
        default: (msg: CommandoMessage) => msg.author,
        key: 'user',
        prompt: 'None',
        type: 'user'
      }]
    })
  }

  run = (msg: CommandoMessage, { user }) => {
    // console.log(msg.member)
    const { createdAt, discriminator, id, presence, tag } = user
    const { joinedTimestamp, nickname, roles } = msg.member // need to fix

    const statuses = [
      { name: 'online', fullname: 'Online', id: '709490984647393390'},
      { name: 'idle', fullname: 'Idle', id: '709490984312111134'},
      { name: 'dnd', fullname: 'Do Not Disturb', id: '709490983896612875'},
      { name: 'offline', fullname: 'Offline', id: '709490983892549665'},
      { name: 'streaming', fullname: 'Streaming', id: '709497953458585750'},
    ]
    const getEmojiOfStatus = () => this.client.emojis.cache.get(statuses.find(e => e.name == presence.status).id)

    const embed = new MessageEmbed()
      .setAuthor(tag, user.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .addField('**User Information**', [
        `** × ID**: ${id}`,
        `** × Discriminator:** ${discriminator}`,
        `** × Status:** ${getEmojiOfStatus()} ${statuses.find(e => e.name === presence.status).fullname} `,
        `** × Created At:** ${moment(createdAt).format('LL')}`
      ].join('\n'))
      .addField('**Member Information**', [
        `**× Nickname:** ${nickname || 'None'}`,
        `**× Joined at:** ${moment(joinedTimestamp).format('LL')}`,
      ].join('\n'))
      .addField('**Roles**', roles.cache.filter(r => r.id !== msg.guild.id).map(x => x).join(' ') || 'No roles')

    return msg.embed(embed)
  }
}