import { CommandoMessage } from 'discord.js-commando'
import axios from 'axios'
import cheerio from 'cheerio'
import { MessageEmbed } from 'discord.js'

import SeraphaeCommand from '../../core/Command'


export default class LyricsCommand extends SeraphaeCommand {
  constructor(client: any) {
    super(client, {
      name: 'lyrics',
      group: 'music',
      memberName: 'lyrics',
      description: 'Display song\'s lyrics',
      args: [{
        key: 'song',
        prompt: 'Please enter a song!',
        type: 'string',
        default: ''
      }]
    })
  }

  getLyrics = async (songURL: string) => {
    const { data } = await axios.get(songURL)
    const $ = cheerio.load(data)

    return $('.lyrics').text().trim()
  }

  run = async (msg: CommandoMessage, { song }) => {
    // @ts-ignore
    const songName = song == '' && msg.guild.musicData.isPlaying
    // @ts-ignore
      ? msg.guild.musicData.nowPlaying.title
      : song
    const songSearch = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(songName)}`, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_CLIENT_ACCESS_TOKEN}`
      }
    })
    let songFound = songSearch.data.response.hits[0]
    if (songFound) {
      songFound = songSearch.data.response.hits[0].result
    } else {
      return msg.say('Please be more specific')
    }
    const lyrics = await this.getLyrics(songFound.url)

    if (lyrics.length) {
      const lyricsArray = lyrics.split('\n\n')
      const lyricsEmbed = new MessageEmbed()
        .setAuthor(songFound.full_title, songFound.song_art_image_thumbnail_url, songFound.url)
        .setThumbnail(songFound.song_art_image_thumbnail_url)

      for (let i = 0; i < lyricsArray.length; i++) {
        const title = lyricsArray[i].split('\n')[0]
        const content = lyricsArray[i].split('\n').slice(1)
        let contentLength = 0

        if (content) {
          console.log(content)
          /* content.forEach((e, i) => {
            contentLength += e.length
            if (contentLength > 1048)
              console.log(i)
          }) */
          lyricsEmbed.addField(title, content.join('\n'))
        }
      }

      return msg.say(lyricsEmbed)
    }

    return msg.say('An error occured.')
  }
}