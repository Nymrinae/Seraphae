import { CommandoClient, CommandoClientOptions } from 'discord.js-commando'
import path from 'path'
import requireAll from 'require-all'
import { I18nResolver } from 'i18n-ts'
import { fr, en } from '../locales'

export default class Seraphae extends CommandoClient {
  constructor(options: CommandoClientOptions) {
    super(options)

    this.init()
    this.loadEvents()
  }

  private init = (): void => {
    this.registry
      .registerDefaultTypes()
      .registerGroups([
        ['bot', 'Bot information'],
        ['games', 'Games related commands'],
        ['info', 'Information related commands'],
        ['misc', 'Miscellaneous commands'],
        ['music', 'Music related commands'],
        ['moderation', 'Moderation commands']
      ])
      .registerDefaultGroups()
      .registerDefaultCommands({
        ping: false,
        prefix: false,
        unknownCommand: false
      })
      .registerCommandsIn(path.join(__dirname, '..', 'commands'))
  }

  private loadEvents = (): void => {
    const events = requireAll({
      dirname: path.join(__dirname, '..', 'events'),
      resolve: (event: any) => new event.default(this)
    })

    for (const eventName in events) {
      const event = events[eventName]

      super.on(eventName, () => event.run())
    }
  }

  /* public configureI18n = (): void => {
    const i18n = {
      fr,
      en,
      default: 'en'
    }

    this.client.i18n = new I18nResolver(i18n, i18n.default).translation
  } */
  public test = () => `test`

  public login = (token: string): Promise<string> => {
    return super.login(token)
  }
}