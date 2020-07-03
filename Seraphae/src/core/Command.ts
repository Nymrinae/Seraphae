import { Command, CommandInfo } from 'discord.js-commando'
import Seraphae from './Client'

export default abstract class SeraphaeCommand extends Command {
  strings: Object

  constructor(client: Seraphae, info: CommandInfo) {
    super(client, info)
  }
  /* create = async (): Promise<any> => {}

  update = async (): Promise<any> => {}

  delete = async (): Promise<any> => {} */
}