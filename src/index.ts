require('custom-env').env(true)

import Seraphae from './core/Client'
import { Structures } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { botConfig } from './config/config'

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    musicData: any

    constructor(client: CommandoClient, data) {
      super(client, data)
      // @ts-ignore
      this.musicData = {
        isPlaying: false,
        nowPlaying: undefined,
        queue: [],
        songDispatcher: undefined,
        volume: 1
      }
    }
  }

  return MusicGuild
})

const client = new Seraphae({
  commandPrefix: botConfig.prefix,
  owner: botConfig.ownerID
})

client.setLogger()
client.login(botConfig.token)