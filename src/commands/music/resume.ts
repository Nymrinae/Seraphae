import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class ResumeCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'resume',
      aliases: ['start', 'unpause'],
      group: 'music',
      memberName: 'resume',
      description: 'Resume the current paused song'
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
    msg.guild.musicData.songDispatcher.resume()
    msg.say('Song resumed :play_pause:')
  }
}