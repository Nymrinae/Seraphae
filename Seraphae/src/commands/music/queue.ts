import { CommandoMessage } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'
import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'
export default class QueueCommand extends SeraphaeCommand {
  constructor(client: Seraphae) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'Show the current music queue.'
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
    const currentQueue = msg.guild.musicData.queue
    const queueEmbed = new MessageEmbed()
      .setTitle('Current queue')

    if (!currentQueue.length) {
      queueEmbed.addField('No song in queue', 'Add song in queue with r%queue.')
    } else {
      for (let i = 0; i < currentQueue.length; i++) {
        queueEmbed.addField(`${i + 1}:`, `${currentQueue[i].title}`)
      }
    }

    return msg.say(queueEmbed)
  }
}