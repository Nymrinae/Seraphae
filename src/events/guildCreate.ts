import Seraphae from '../core/Client'
import { Guild, MessageEmbed, TextChannel } from 'discord.js'

export default class GuildCreateEvent {
  private client: Seraphae

  constructor(client: Seraphae) {
    this.client = client
  }

  public run = (guild: Guild): Promise<any> => {
    let guildJoinEmbed = new MessageEmbed()
      .setTitle("Joined Guild!")
      .addField("Guild Name:", `\`${guild[0].name}\``)
      .addField("Guild ID:", `\`${guild[0].id}\``)
      .addField("Guild OwnerID:", `\`${guild[0].ownerID}\``)
      .addField("Member Count:", `\`${guild[0].memberCount}\``)
      .setColor("#ffe66b")

    const channel = this.client.channels.cache.get('678285549362217003')
  
    return (channel as TextChannel).send(guildJoinEmbed)
  }
}