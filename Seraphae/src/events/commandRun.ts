import Seraphae from '../core/Client'

export default class CommandRunEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (args): void => {
    // console.log(args)
  }
}