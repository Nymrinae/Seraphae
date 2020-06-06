import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'

export default class ClearCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'clear',
      aliases: ['clear', 'skipall'],
      group: 'music',
      memberName: 'clear',
      description: 'Clear queue'
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
    if (!msg.guild.musicData.queue)
      return msg.say('There are no songs in queue')

    // @ts-ignore
    msg.guild.musicData.songDispatcher.end()
    // @ts-ignore
    msg.guild.musicData.queue.length = 0
    msg.say('Queue cleared!')
  }
}