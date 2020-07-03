import Seraphae from '../core/Client'
import { GuildMember } from 'discord.js'

export default class GuildMemberRemoveEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (member: GuildMember): void => {
    this.client.logger.logMemberJoinState(member, false)
  }
}