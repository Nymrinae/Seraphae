import { CommandoClient, CommandoClientOptions } from 'discord.js-commando'
import path from 'path'
import requireAll from 'require-all'
import Logger from './Logger'
import { I18nResolver } from 'i18n-ts'
import { fr, en } from '../locales'

export default class Seraphae extends CommandoClient {
  public logger: Logger
  public i18n: any

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
        ['information', 'Information related commands'],
        ['miscellaneous', 'Miscellaneous commands'],
        ['music', 'Music related commands'],
        ['moderation', 'Moderation commands']
      ])
      .registerDefaultGroups()
      .registerDefaultCommands({
        help: false,
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

      super.on(eventName, (...args: any) => event.run(...args))
    }
  }

  public setLogger = (): Logger => this.logger = new Logger(this)

  public configurei18n = (): void => {
    this.i18n = new I18nResolver({ fr, en, default: en }, 'en').translation
  }

  public login = (token: string): Promise<string> => super.login(token)
}