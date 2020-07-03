import Seraphae from '../core/Client'
import { Guild  } from 'discord.js'

export default class GuildDeleteEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (guild: Guild): void => {
    this.client.logger.logNewGuildState(guild, false)
  }
}