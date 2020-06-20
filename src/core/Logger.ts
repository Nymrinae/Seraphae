import Seraphae from "./Client";
import { memberUpdateType, LoggerOptions } from '../models/types/LoggerTypes'
import { CommandoMessage } from "discord.js-commando"
import { MessageEmbed, TextChannel, GuildMember, Message, Role, User } from "discord.js"

export default class Logger {
  private client: Seraphae
  private options: LoggerOptions

  constructor(client: Seraphae) {
    this.client = client
    this.options = {
        userLog: 'mudae-crf',
        msgLog: 'mudae-crf',
        modLog: 'mudae-crf'
    }

    /*
      user-log: guildMemberAdd | guildMemberUpdate
      msg-log: messageDelete
      mod-log: guildBanAdd | guildMemberRemove
    */
  }

  private getChannel = (logType: string, msg?: CommandoMessage): TextChannel => {
    const simpleChannel = this.client.channels.cache.find((channel: TextChannel) => channel.name === logType)

    if (msg) {
      const messageChannel = this.client.channels.cache.find((channel: TextChannel) => {
        return channel.name === logType
            && channel.type == 'text'
            && channel.guild.id === msg.guild.id
      })

      return (messageChannel as TextChannel)
    }

    return (simpleChannel as TextChannel)
  }

  public logGuildBanState = (_: void, user: User, banned: boolean): void => {
    const channel: TextChannel = this.getChannel(this.options.modLog)
    const logGuildBanStateEmbed = new MessageEmbed()
      .setTitle(`${banned ? 'Banned' : 'Unbanned'} from guild`)
      .setColor(`${banned ? '#FF0000' : '#00FF00'}`)
      .setAuthor(`${user.tag}`, user.avatarURL())
      .setDescription([`**Discord ID**: ${user.id}`, `**Username**: ${user.tag}`].join('\n'))
      .setTimestamp()

    channel.send(logGuildBanStateEmbed)
  }

  public logMemberJoinState = (member: GuildMember, joined: boolean): void => {
    const channel: TextChannel = this.getChannel(this.options.userLog)
    const guildMemberAddEmbed = new MessageEmbed()
      .setTitle(`${joined ? 'New Member' : 'Member left'}`)
      .setColor(`${joined ? '#00FF00' : '#FF0000'}`)
      .setThumbnail(member.user.avatarURL())
      .setDescription([
        `**Discord ID**: ${member.user.id}`,
        `**Username**: ${member.user.tag}`
      ].join('\n'))
      .setTimestamp()

    channel.send(guildMemberAddEmbed)
  }

  public guildMemberUpdate = (oldMember: GuildMember, newMember: GuildMember): any => {
    const channel: TextChannel = this.getChannel(this.options.userLog)

    if (!channel) return

    let updateType: memberUpdateType
    // roles changes
    let addedRole: Role = undefined
    let removedRole: Role = undefined

    oldMember.roles.cache.every((role: Role) => {
      if (!newMember.roles.cache.get(role.id)) {
        updateType = memberUpdateType.REMOVEDROLE
        removedRole = role

        return false
      }
      return true
    })

    newMember.roles.cache.every((role: Role) => {
      if (!oldMember.roles.cache.get(role.id)) {
        updateType = memberUpdateType.ADDEDROLE
        addedRole = role

        return false
      }
      return true
    })

    // name changes
    if (oldMember.user.username != newMember.user.username)
      updateType = memberUpdateType.USERNAME
    if (oldMember.nickname != newMember.nickname)
      updateType = memberUpdateType.NICKNAME

    let description = undefined
    let fields = []

    switch (updateType) {
      case memberUpdateType.ADDEDROLE:
        description = `The role \`${addedRole.name}\` has been added!`
        break
      case memberUpdateType.REMOVEDROLE:
        description = `The role \`${removedRole.name}\` has been removed!`
        break
      case memberUpdateType.USERNAME:
        fields = [
          { name: '**Old username**', value: oldMember.user.username },
          { name: '**New username**', value: newMember.user.username }
        ]
        break
      case memberUpdateType.NICKNAME:
        fields = [
          { name: '**Old nickname**', value: oldMember.nickname },
          { name: '**New nickname**', value: newMember.nickname }
        ]
        break
      default:
        updateType = memberUpdateType.NONE
    }

    const guildMemberUpdateEmbed = new MessageEmbed()
      .setColor(updateType === memberUpdateType.REMOVEDROLE ? '#FF0000' : '#00FF00')
      .setAuthor(`User updated: ${oldMember.user.tag}`, oldMember.user.avatarURL())
      .setTimestamp()
    
    if (description)
      guildMemberUpdateEmbed.setDescription(description)
    
    if (fields.length) {
      fields.splice(0, 0, { name: '**Discord ID:**', value: oldMember.user.id })
      guildMemberUpdateEmbed.addFields(fields)
    }

    if (updateType != memberUpdateType.NONE)
      return channel.send(guildMemberUpdateEmbed)
  }

  public messageDeleted = (msg: CommandoMessage): Promise<Message> => {
    const channel = this.getChannel(this.options.msgLog, msg)

    if (!channel)
      return

    const { author, attachments, content, createdTimestamp } = msg
    const messageDeletedEmbed = new MessageEmbed()
        .setTitle(`Message deleted by ${author.username}`)
        .setColor('#FF0000')
        .setDescription(content)
        .setTimestamp(createdTimestamp)
    const messageHadAttachment = attachments.first()

    if (messageHadAttachment) // if there is an attachement
        messageDeletedEmbed.setImage(messageHadAttachment.proxyURL)

    return channel.send(messageDeletedEmbed)
  }
}