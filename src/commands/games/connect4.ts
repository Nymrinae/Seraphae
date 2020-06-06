import { CommandoMessage } from 'discord.js-commando'
import { MessageReaction, MessageEmbed, User, Emoji } from 'discord.js'
import SeraphaeCommand from '../../core/Command'

import { Connect4Signs } from '../../models/types/GameTypes'

type Player = {
  player: User,
  sign: any
}

export default class Connect4Command extends SeraphaeCommand {
  private msg: CommandoMessage
  private playground: CommandoMessage
  private isGameRunning: boolean
  private gameState: Array<Array<string | Emoji>>
  private emptySign: string

  private currentPlayer: Player
  private player1: Player
  private player2: Player
  private winner: User

  constructor(client: any) {
    super(client, {
      name: 'connect4',
      aliases: ['c4'],
      group: 'games',
      memberName: 'connect4',
      description: 'Play Connect 4 with a friend!',
      examples: ['c4'],
      args: [{
        key: 'user',
        prompt: 'Notify an user to play with!',
        type: 'user',
        default: () => undefined
      }]
    })

    this.winner = undefined
    this.isGameRunning = false
    this.emptySign = ':white_medium_small_square:'
  }

  loadGame = async (user: User): Promise<boolean> => {
    const embed = new MessageEmbed()
      .setTitle('Welcome to Connect4')
      .setDescription([
        'Connect4 is a game for two players, Yellow and Red.',
        'In a 7x6 grid, the player who succeeds to align 4 pieces, either in a vertical, horizontal or diagonal row wins.'
      ].join(' '))
      .addField('**How the game proceeds**', [
        'A 7x6 grid is going to be created (check thumbnail)',
        'When it\'s your turn, simply type the number (from 1 to 7) of the row you want to play on. You have 20 seconds to play.',
      ])
      .addField('**Examples**', [
        'If you want to play on the first row, write 1.',
        'If you want to play in the fourth row, write 4.',
        'If you want to play in the last row, write 7.'
      ].join('\n'))
      .addField('**Let\'s play!**', `(:x:) ${this.msg.author} :crossed_swords: ${user} (:o:)`)
      .addField('\u200b', `Do you want to take up the challenge ${user} ? React with :crossed_swords:`)

    const tutorial = await this.msg.embed(embed)
    // @ts-ignore
    tutorial.react('⚔️')
    const filter = (reaction: MessageReaction, userReacted: User): boolean => reaction.emoji.name == '⚔️' && userReacted.id == user.id
    // @ts-ignore
    const collected = await tutorial.awaitReactions(filter, { max: 1, time: 20000 })
    const reacted = collected.first()

    if (reacted) {
      // @ts-ignore
      tutorial.delete()
      const firstPlayer: User = Math.random() > 0.5 ? this.msg.author : user

      this.player1 = {
        player: firstPlayer,
        sign: Connect4Signs.YELLOW
      }

      this.player2 = {
        player: firstPlayer == this.msg.author ? user : this.msg.author,
        sign: Connect4Signs.RED
      }

      this.currentPlayer = this.player1.sign == Connect4Signs.YELLOW ? this.player1 : this.player2

      return this.isGameRunning = reacted.emoji.name == '⚔️'
    } else
      return false
  }

  displayPlayground = async (initialState: boolean = false): Promise<void> => {
    const playground = new MessageEmbed()
      .setTitle(`${this.currentPlayer.player.username} turn (${this.client.emojis.cache.get(this.currentPlayer.sign)})`)
      .setDescription(this.displayGameState())

    if (initialState) {
      // @ts-ignore
      this.playground = await this.msg.say(playground)
    }
    else {
      this.playground.edit(playground)
    }
  }

  generatePlayground = (): void => {
    this.gameState = Array.from(Array(6), () => Array(7).fill(this.emptySign))
  }

  displayGameState = (): string => {
    return this.gameState.map((col: string[]) => {
      return col.map((row: string, i: number) => (i != 0 && i % row.length % 6 == 0) ? row + '\n' : row).join(' ')
    }).join(' ')
  }

  handlePlayerValue = async (): Promise<void> => {
    let turnFinished: boolean = false
    const messageFilter = (m: CommandoMessage) => m.author.id == this.currentPlayer.player.id

    while (!turnFinished) {
      const collected = await this.msg.channel.awaitMessages(messageFilter, { max: 1 })
      const incomingPlay = collected.first()

      if (incomingPlay) {
        const onlyOneDigit = /^\d{1}$/gm
        const incomingPlayValue = parseInt(incomingPlay.content) - 1

        if (incomingPlay.content.match(onlyOneDigit)) {
          const lastIndex = this.gameState.map((row: string[]) => row[incomingPlayValue])
                                          .lastIndexOf(this.emptySign)

          if (lastIndex >= 0) {
            this.gameState[lastIndex][incomingPlayValue] = this.client.emojis.cache.get(this.currentPlayer.sign)
            incomingPlay.delete()
            turnFinished = true
          } else {
            incomingPlay.delete()
            continue
          }
        }
      } else {
        continue
      }
    }
  }

  checkWinner = (): void => {
    console.log('first row:', this.gameState[0])

    // checkColumns
    console.log('first column:', this.gameState.map(x => x[0]))

    /* const array = [0, 1, 1, 1, 1, 0]
    let nbOcc = 0

    for (const elem of array) {
      if (nbOcc == 4) break;
      elem == 1 ? nbOcc++ : nbOcc = 0
    }

    console.log(nbOcc) */
  }

  switchPlayer = (): void => {
    this.currentPlayer = this.currentPlayer.sign == Connect4Signs.YELLOW ? this.player2 : this.player1
  }

  play = async (): Promise<void> => {
    await this.handlePlayerValue()
    this.checkWinner()
    this.switchPlayer()
    this.displayPlayground()
    // this.isGameRunning = false
  }

  run = async (msg: CommandoMessage, { user }) => {
    this.msg = msg

    const loadGame: boolean = await this.loadGame(user)

    if (!loadGame)
      return msg.say(`${user.username} didn't answer to your challenge!`)

    this.generatePlayground()
    this.displayPlayground(true)

    while (this.isGameRunning) {
      await this.play()
    }

    const drawMessage: string = `Game ended in a draw between ${this.player1.player.username} and ${this.player2.player.username}`
    const winnerMessage: string = `${this.winner} has won!`

    return msg.say(this.winner ? winnerMessage : drawMessage)
  }
}