import Seraphae from '../core/Client'
import { Guild, User } from 'discord.js'

export default class GuildBanRemoveEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (guild: Guild, user: User): void => {
    this.client.logger.logGuildBanState(guild, user, false)
  }
}