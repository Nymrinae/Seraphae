import Seraphae from '../core/Client'
import { User, Guild } from 'discord.js'

export default class GuildBanAddEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (guild: Guild, user: User): void => {
    this.client.logger.logGuildBanState(guild, user, true)
  }
}