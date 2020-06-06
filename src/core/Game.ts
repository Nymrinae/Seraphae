import { User, MessageEmbed, MessageReaction, Message } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import SeraphaeCommand from './Command'

import { IGame } from '../models/interfaces/IGame'

export default abstract class Game extends SeraphaeCommand implements IGame {
  abstract msg: CommandoMessage
  abstract isGameRunning: boolean

  abstract playground: CommandoMessage
  abstract gameState: number[]

  abstract currentTurn: number
  abstract player1: User
  abstract player2: User
  abstract winner: User

  abstract buildTutorial: (user: User) => MessageEmbed

  abstract displayPlayground: (initialState: boolean) => Promise<void>
  abstract generatePlayground: () => void

  abstract checkWinner: () => void
  abstract handlePlayerValue: () => Promise<void>

  displayTutorial = async (user: User): Promise<boolean> => {
    const embed = this.buildTutorial(user)
    const tutorial = await this.msg.embed(embed)

    await (tutorial as Message).react('⚔️')

    const filter = (reaction: MessageReaction, userReacted: User): boolean => reaction.emoji.name == '⚔️' && userReacted.id == user.id
    const collected = await (tutorial as Message).awaitReactions(filter, { max: 1, time: 20000 })
    const reacted = collected.first()

    if (reacted) {
      (tutorial as Message).delete()
      this.player1 = this.msg.author
      this.player2 = user
      this.currentTurn = 2

      return this.isGameRunning = reacted.emoji.name == '⚔️'
    }

    return false
  }

  getPlayerByTurn = (): User => this.currentTurn == 1 ? this.player1 : this.player2

  switchPlayer = (): void => {
    this.currentTurn == 2 ? this.currentTurn = 1 : this.currentTurn = 2
  }

  play = async (): Promise<void> => {
    await this.handlePlayerValue()

    this.checkWinner()
    this.switchPlayer()
    this.displayPlayground(false)
  }

  displayWinner = (): MessageEmbed => {
    const gameResultMessage = this.winner
      ? `${this.winner} has won!`
      : `Game ended in a draw between ${this.player1.username} and ${this.player2.username}`
    const embed = new MessageEmbed()
      .setDescription(gameResultMessage)
      .setColor(this.winner ? '#00FF000' : '#D3D3D3')

    return embed
  }

  run = async (msg: CommandoMessage, { user }) => {
    this.msg = msg

    const loadGame: boolean = await this.displayTutorial(user)

    if (!loadGame)
      return msg.say(`${user.username} didn't answer to your challenge!`)

    this.generatePlayground()
    this.displayPlayground(true)

    while (this.isGameRunning) {
      await this.play()
    }

    return msg.say(this.displayWinner())
  }
}