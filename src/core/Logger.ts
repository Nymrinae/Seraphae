import Seraphae from "./Client";
import { memberUpdateType, LoggerOptions } from '../models/types/LoggerTypes'
import { CommandoMessage } from "discord.js-commando"
import { MessageEmbed, TextChannel, GuildMember, Message, Role } from "discord.js"

export default class Logger {
  private client: Seraphae
  private options: LoggerOptions

  constructor(client: Seraphae) {
    this.client = client
    this.options = {
        userLog: 'user-log',
        msgLog: 'msg-log',
        modLog: ''
    }

    // user-log: guildMemberAdd | guildMemberUpdate | userUpdate
    // msg-log: messageDelete
    // mod-log: guildBanAdd | guildMemberRemove
  }

  private getChannel = (logType: string): TextChannel => {
    return (this.client.channels.cache.find(c => (c as TextChannel).name === logType) as TextChannel)
  }

  private getMessageChannel = (msg: CommandoMessage, logType: string): TextChannel => {
    const channel = this.client.channels.cache.find(c => {
        return (c as TextChannel).name === logType
            && (c as TextChannel).guild.id === msg.guild.id
    })

    return (channel as TextChannel)
  }

  public guildMemberUpdate = (updatedMember: GuildMember): any => {
    const channel: TextChannel = this.getChannel(this.options.userLog)

    if (!channel) return

    const oldMember = updatedMember[0]
    const newMember = updatedMember[1]

    let updateType: memberUpdateType
    // roles changes
    let addedRole: Role = undefined
    let removedRole: Role = undefined

    oldMember.roles.cache.every((role: Role) => {
      if (!newMember.roles.cache.get(role.id)) {
          updateType = memberUpdateType.REMOVEDROLE
          removedRole = role
      }
    })

    newMember.roles.cache.every((role: Role) => {
      if (!oldMember.roles.cache.get(role.id)) {
          updateType = memberUpdateType.ADDEDROLE
          addedRole = role
      }
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
          { name: 'Old username', value: oldMember.user.username },
          { name: 'New username', value: newMember.user.username }
        ]
        break
      case memberUpdateType.NICKNAME:
        fields = [
          { name: 'Old nickname', value: oldMember.nickname },
          { name: 'New nickname', value: newMember.nickname }
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
      fields.splice(0, 0, { name: 'Discord ID:', value: oldMember.user.id })
      guildMemberUpdateEmbed.addFields(fields)
    }

    if (updateType != memberUpdateType.NONE)
      return (channel as TextChannel).send(guildMemberUpdateEmbed)
  }

  public messageDeleted = (msg: CommandoMessage): Promise<Message> => {
      const channel = this.getMessageChannel(msg, this.options.msgLog)

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

      return (channel as TextChannel).send(messageDeletedEmbed)
  }
}