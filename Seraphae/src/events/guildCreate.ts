import Seraphae from '../core/Client'
import { Guild, MessageEmbed, TextChannel, Channel } from 'discord.js'

export default class GuildCreateEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (guild: Guild): void => {
    this.client.logger.logNewGuildState(guild, true)
  }
}