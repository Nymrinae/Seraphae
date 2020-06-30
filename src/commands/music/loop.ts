import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class LoopCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'loop',
      aliases: ['loop', 'repeat'],
      group: 'music',
      memberName: 'loop',
      description: 'Repeat the current playing song',
      args: [{
        key: 'times',
        default: 1,
        type: 'integer',
        prompt: 'How many times do you want to loop the song ?'
      }]
    })
  }

  run = (msg: CommandoMessage, { times }) => {
    const voiceChannel = msg.member.voice.channel

    if (!voiceChannel)
      return msg.say('Join a voice channel first!')
    // @ts-ignore
    if (!msg.guild.musicData.songDispatcher)
      return msg.say('There is no song playing right now')
    // @ts-ignore
    if (!msg.guild.musicData.queue)
      return msg.say('There are no songs in queue')
    if (times > 10)
      return msg.say('Calm down...')

    for (let i = 0; i < times; i++)
      // @ts-ignore
      msg.guild.musicData.queue.unshift(msg.guild.musicData.nowPlaying)

    // @ts-ignore
    msg.say(`${msg.guild.musicData.nowPlaying.title} looped ${times} times`)
  }
}