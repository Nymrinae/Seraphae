import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import Youtube from 'simple-youtube-api'
import ytdl from 'ytdl-core'
import { MessageEmbed, Message, MessageReaction, User } from 'discord.js'
import { decodeHTMLEntities } from '../../helpers/functions'

import SeraphaeCommand from '../../core/Command'
import Seraphae from '../../core/Client'

export default class PlayCommand extends SeraphaeCommand {
  private youtube: Youtube
  private query: any
  private msg: CommandoMessage

  constructor(client: Seraphae) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Play any song from youtube!',
      clientPermissions: ['SPEAK', 'CONNECT'],
      args: [{
        key: 'query',
        prompt: 'What song would you like to listen to?',
        type: 'string',
        validate: (query: string) => query.length > 0 && query.length < 200
      }]
    })

    this.youtube = new Youtube(process.env.YOUTUBE_API_KEY)
  }

  private playSong = async (queue, msg): Promise<any> => {
    const connection = await queue[0].voiceChannel.join()
    const voiceChannel = queue[0].voiceChannel
    const dispatcher = connection
      .play(ytdl(queue[0].url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1024 * 1024 * 10
      }))
      .on('start', () => {
        msg.guild.musicData.songDispatcher = dispatcher
        dispatcher.setVolume(msg.guild.musicData.volume)

        const videoEmbed = new MessageEmbed()
          .setThumbnail(queue[0].thumbnail)
          .addField('Now playing:', queue[0].title)
          .addField('Duration:', queue[0].duration)

        if (queue[1])
          videoEmbed.addField('Next song:', queue[1].title)
        msg.say(videoEmbed)
        msg.guild.musicData.nowPlaying = queue[0]

        return queue.shift()
      })
      .on('finish', () => {
        if (queue.length >= 1) {
          return this.playSong(queue, msg)
        } else {
          msg.guild.musicData.isPlaying = false

          return voiceChannel.leave()
        }
      })
      .on('end', () => {
        msg.guild.musicData.queue.length = 0

        return voiceChannel.leave()
      })
      .on('error', (e: Error) => {
        msg.say('Cannot play song')
        msg.guild.musicData.queue.length = 0
        msg.guild.musicData.isPlaying = false
        msg.guild.musicData.nowPlaying = undefined

        return voiceChannel.leave()
      })
  }

  private isYoutubeLink = (): any => {
    return /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm.test(this.query)
  }

  private isYoutubePlaylist = (): any => {
    return /^.*(youtu.be\/|list=)([^#\&\?]*).*/gm.test(this.query)
  }

  handleSong = () => {
    if (this.isYoutubePlaylist())
      return this.handleYoutubePlaylist()

    if (this.isYoutubeLink())
      return this.handleYoutubeLink()

    return this.handleSongName()
  }

  handleYoutubeLink = async () => {
    const videoId = this.query.split('=')[1]
    const video = await this.youtube.getVideoByID(videoId)

    return video
  }

  handleYoutubePlaylist = async () => {
    try {
      const playlist = await this.youtube.getPlaylist(this.query)

      if (!playlist)
        this.msg.say('Playlist is either private or doesn\'t exist')

      const videos = await playlist.getVideos()

      if (videos) {
        for (let i = 0; i < videos.length; i++) {
          if (videos[i].raw.status.privacyStatus == 'private')
            continue
          // @ts-ignore
          this.msg.guild.musicData.queue.push(videos[i])
        }
      }
    } catch(e) {
      return false
    }
  }

  handleSongName = async () => {
    try {
      const videos = []
      const fetchedVideos = await this.youtube.searchVideos(this.query, 5)
      const reactions = '1⃣ 2⃣ 3⃣ 4⃣ 5⃣'.split(' ')

      fetchedVideos.forEach(v => videos.push(v.title))
      const videosEmbed = new MessageEmbed()
        .setTitle('Choose a song by reacting with a number!')

      for (let i = 0; i < 5; i++)
        videosEmbed.addField(`Song ${i + 1}`, decodeHTMLEntities(videos[i]))

      const songsEmbed = await this.msg.say(videosEmbed)

      reactions.forEach(e => (songsEmbed as Message).react(e));

      (songsEmbed as Message).react('🚪')

      const filter = (reaction: MessageReaction, userReacted: User): boolean => userReacted.id == this.msg.author.id
      const collected = await (songsEmbed as Message).awaitReactions(filter, { max: 1, time: 20000 })

      if (collected) {
        const reaction = collected.first()
        const pos = reactions.indexOf(reaction.emoji.name)

        if (pos != -1) {
          const video = await this.youtube.getVideoByID(fetchedVideos[pos].id)

          return video
        } else {
          await (songsEmbed as Message).delete()
          return false
        }
      }
    } catch (e) {
      return false
    }
  }

  run = async (msg: CommandoMessage, { query }) => {
    const voiceChannel = msg.member.voice.channel

    this.msg = msg
    this.query = query

    if (!voiceChannel)
      return msg.say('Join a voice channel first!')

    const video = await this.handleSong()

    if (video) {
      const videoInfos = {
        duration: `${video.duration.minutes.toString().padStart(2, '0')}:${video.duration.seconds}`,
        title: video.title,
        thumbnail: video.thumbnails.medium.url,
        url: video.url,
        voiceChannel
      }
      // @ts-ignore
      msg.guild.musicData.queue.push(videoInfos)
      // @ts-ignore
      if (!msg.guild.musicData.isPlaying) {
        // @ts-ignore
        msg.guild.musicData.isPlaying = true
        // @ts-ignore
        return this.playSong(msg.guild.musicData.queue, msg)
      } else {
        msg.say(`${videoInfos.title} added to queue!`)
      }
    }
  }
}