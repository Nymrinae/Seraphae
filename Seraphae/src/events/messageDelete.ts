import Seraphae from '../core/Client'
import { CommandoMessage } from 'discord.js-commando'

export default class MessageDeleteEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (msg: CommandoMessage): void => {
    this.client.logger.logDeletedMessage(msg)
  }
}