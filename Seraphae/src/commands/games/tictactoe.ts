import { CommandoMessage } from 'discord.js-commando'
import { MessageEmbed, User } from 'discord.js'

import Game from '../../core/Game'
import { TicTacToeSigns } from '../../models/types/GameTypes'
import { GameState } from '../../models/types/GameTypes'

export default class TicTacToeCommand extends Game {
  public msg: CommandoMessage
  public playground: CommandoMessage
  public isGameRunning: boolean
  public gameState: number[]

  public currentTurn: number
  public player1: User
  public player2: User
  public winner: User

  constructor(client: any) {
    super(client, {
      name: 'tictactoe',
      aliases: ['ttt'],
      group: 'games',
      memberName: 'tictactoe',
      description: 'Play tictactoe with a friend!',
      examples: ['tictactoe'],
      args: [{
        key: 'user',
        prompt: 'Notify an user to play with!',
        type: 'user'
      }]
    })

    this.winner = undefined
    this.isGameRunning = false
  }

  buildTutorial = (user: User): MessageEmbed => {
    const embed = new MessageEmbed()
      .setThumbnail('https://bit.ly/3dMMZ7e')
      .setTitle('Welcome to Tic Tac Toe')
      .setDescription([
        'Tic-Tac-Toe is a paper-and-pencil game for two players, X and O.',
        'In a 3x3 grid, the player who succeeds to align 3 marks, either in a vertical, horizontal or diagonal row wins.'
      ].join(' '))
      .addField('**How the game proceeds**', [
        'A 3x3 map is going to be created (check thumbnail)',
        'When it\'s your turn, simply type the number of the slot you want to play on. You have 20 seconds to play.',
      ])
      .addField('**Examples**', [
        'If you want to play on the top-left corner, write 1.',
        'If you want to play in the middle, write 5.',
        'If you want to play in the right-bottom corner, write 9.'
      ].join('\n'))
      .addField('**Let\'s play!**', `(:o:) ${this.msg.author} :crossed_swords: ${user} (:x:)`)
      .addField('\u200b', `Do you want to take up the challenge ${user} ? React with :crossed_swords:`)

    return embed
  }

  displayPlayground = async (initialState: boolean = false): Promise<void> => {
    const playground = new MessageEmbed()
      .setTitle(`${this.getPlayerByTurn().username}'s turn`)
      .setDescription(this.displayGameState())

    if (initialState) {
      // @ts-ignore
      this.playground = await this.msg.say(playground)
    } else {
      this.playground.edit(playground)
    }
  }

  generatePlayground = (): void => {
    this.gameState = Array(9).fill(GameState.EMPTY)
  }

  displayGameState = (): string => {
    const getStringValue = (e: number): TicTacToeSigns => {
      switch (e) {
        case GameState.EMPTY:
          return TicTacToeSigns.EMPTY
        case GameState.P1:
          return TicTacToeSigns.O
        case GameState.P2:
          return TicTacToeSigns.X
      }
    }

    return this.gameState.map((e, i) => `${getStringValue(e)}${ i % 3 == 2 ? '\n' : ''}`).join('')
  }

  checkWinner = (): void => {
    const winningConditions: number[][] = [
      // rows
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      // diagonals
      [0, 4, 8], [2, 4, 6],
      // columns
      [0, 3, 6], [1, 4, 7], [2, 5, 8]
    ]
    const indexPlayed: number[] = this.gameState
                                    .map((e, i) => e == this.currentTurn ? i : - 1)
                                    .filter(e => e != -1)

    if (indexPlayed.length > 2) {
      winningConditions.forEach(e => {
        const gameResult = e.every(val => indexPlayed.includes(val))

        if (gameResult) {
          this.winner = this.getPlayerByTurn()
          this.isGameRunning = false
        }
      })
    }

    // check draw
    if (!this.gameState.includes(GameState.EMPTY)) {
      this.isGameRunning = false
    }
  }

  handlePlayerValue = async (): Promise<void> => {
    let turnFinished: boolean = false
    const messageFilter = (m: CommandoMessage) => m.author.id == this.getPlayerByTurn().id

    while (!turnFinished) {
      const collected = await this.msg.channel.awaitMessages(messageFilter, { max: 1 })
      const incomingPlay = collected.first()

      if (incomingPlay) {
        const onlyOneDigit = /^\d{1}$/gm
        const incomingPlayValue = parseInt(incomingPlay.content) - 1
        const isSlotAvailable = (): boolean => this.gameState[incomingPlayValue] == GameState.EMPTY

        if (incomingPlay.content.match(onlyOneDigit) && isSlotAvailable()) {
          this.gameState[incomingPlayValue] = this.currentTurn
          incomingPlay.delete()
          turnFinished = true
        }
      } else {
        continue
      }
    }
  }
}