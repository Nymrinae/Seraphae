import { CommandoMessage } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'
import SeraphaeCommand from '../../core/Command'

export default class CurrentCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'current',
      aliases: ['currentsong'],
      group: 'music',
      memberName: 'current',
      description: 'Show the current song',
      examples: ['current']
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
    const { duration, thumbnail, title } = msg.guild.musicData.nowPlaying
    const currentSongEmbed = new MessageEmbed()
      .setThumbnail(thumbnail)
      .addField('Now playing:', title)
      .addField('Duration:', duration)

    return msg.say(currentSongEmbed)
  }
}