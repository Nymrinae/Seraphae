import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'

export default class SkipCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'skip',
      group: 'music',
      memberName: 'skip',
      description: 'Skip the current playing song'
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
    msg.guild.musicData.songDispatcher.emit('finish')
    // @ts-ignore
    msg.say('Song skipped :track_next:')
  }
}