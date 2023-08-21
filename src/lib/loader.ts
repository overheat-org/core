import { readdirSync } from "fs";
import Bot from "./client";
import path from "path";
import { Command, Event } from "./structures";

class Loader {
	constructor(
		private client: Bot
	) { }

	loadCommands(dirpath: string) {
		const allFileNames = readdirSync(dirpath)

		for (let i = 0; i < allFileNames.length; i++) {
			const filePath = path.join(dirpath, allFileNames[i]);

			const guildTestId = process.env.GUILD_TEST;
			if (!guildTestId) {
				console.log('warn: enviroment variable "GUILD_TEST" not specified')
			}

			import(filePath).then(f => {
				if (!f.default) {
					throw new Error(`File "${filePath}" hasn't default export`);
				}

				const command: Command = f.default;
				Command.cache.set(command.data.name, command);

				if (!guildTestId) return;

				(this.client.guilds.fetch(process.env.GUILD_TEST as string)).then(g => {
					const fetchedCommand = g.commands.cache.find(c => c.name == g.name);


					if (fetchedCommand) {
						g.commands.edit(fetchedCommand.id, command.data)
					} else {
						g.commands.create(command.data);
					}
				})
			})
		}
	}

	loadEvents(dirpath: string) {
		const allFileNames = readdirSync(dirpath)

		for (let i = 0; i < allFileNames.length; i++) {
			const filePath = path.join(dirpath, allFileNames[i]);

			import(filePath).then(f => {
				if (!f.default) {
					throw new Error(`File "${filePath}" hasn't default export`);
				}

				const event: Event<any> = f.default;
				this.client[event.data.once ? "once" : "on"](event.data.type, (...args: any) => event.run(...args));
			})
		}
	}
}

export default Loader;