import type { Client, CommandInteraction } from "discord.js"

type Command = {
  name: string
  description: string
  run: (interaction: CommandInteraction) => unknown
}

export function createCommandHandler(client: Client, commands: Command[]) {
  client.on("ready", async () => {
    for (const guild of client.guilds.cache.values()) {
      client.application!.commands.set(
        commands.map(({ name, description }) => ({
          name,
          description,
        })),
        guild.id,
      )
    }
  })

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    const command = commands.find(
      (command) => command.name === interaction.commandName,
    )
    if (command) {
      try {
        await command.run(interaction)
      } catch (error) {
        console.error(error)
      }
    }
  })
}
