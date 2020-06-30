import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class LeaveCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'leave',
      aliases: ['end', 'quit'],
      group: 'music',
      memberName: 'leave',
      description: 'Leave a voice channel'
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
    msg.guild.musicData.songDispatcher.emit('end')
  }
}