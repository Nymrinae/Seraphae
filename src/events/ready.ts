import Seraphae from '../core/Client'

export default class ReadyEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (): void => {
    console.log('Seraphae started!')
    this.client.user.setActivity(`${this.client.commandPrefix}help`, { type: 'LISTENING' })
  }
}