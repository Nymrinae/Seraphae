import Seraphae from '../core/Client'
import { CommandoMessage } from 'discord.js-commando'

export default class MessageDeleteEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = async (msg: CommandoMessage): Promise<any> => {
    this.client.logger.messageDeleted(msg[0])
  }
}