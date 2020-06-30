import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class PauseCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'pause',
      aliases: ['stop'],
      group: 'music',
      memberName: 'pause',
      description: 'Pause the current playing song.'
    })
  }

  run = (msg: CommandoMessage) => {
    const voiceChannel = msg.member.voice.channel

    if (!voiceChannel)
      return msg.say('Join a voice channel first!')
    // @ts-ignore
    if (!msg.guild.musicData.songDispatcher)
      return msg.say('There is no song playing right now')
    // @ts-ignore
    msg.guild.musicData.songDispatcher.pause()
    msg.say('Song paused :pause_button:')
  }
}