import { User, MessageEmbed } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'

export interface IGame {
  // General
  isGameRunning: boolean
  msg: CommandoMessage
  playground: CommandoMessage

  buildTutorial: (user: User) => MessageEmbed
  play: () => Promise<void>

  // Playground related
  gameState: number[]
  displayPlayground: (initialState: boolean) => Promise<void>
  generatePlayground: () => void

  // Player related
  currentTurn: number
  player1: User
  player2: User
  winner: User

  checkWinner: () => void
  getPlayerByTurn: () => User
  handlePlayerValue: () => Promise<void>
  switchPlayer: () => void
}