import Seraphae from '../core/Client'
import { GuildMember } from 'discord.js'

export default class GuildMemberUpdateEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (oldMember: GuildMember, newMember: GuildMember): any => {
    this.client.logger.logGuildMemberUpdate(oldMember, newMember)
  }
}