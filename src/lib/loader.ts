import { readdirSync } from "fs";
import Bot from "./client";
import path from "path";
import { Command } from "./structures";

const privateComponentRegex = /^\(.*\)\.ts$/;

class Loader {
	constructor(
		private client: Bot
	) { }

	loadCommands(dirpath: string) {
		const allFileNames = readdirSync(dirpath)

		for (let i = 0; i < allFileNames.length; i++) {
			const filePath = path.join(dirpath, allFileNames[i]);

			import(filePath).then(f => {
				if (Object.keys(f.default).length == 0) {
					throw new Error(`File "${filePath}" hasn't default export`);
				}

				const command = f.default;
				Command.cache.set(command.name, command);
				(this.client.guilds.fetch(process.env.guildTest as string)).then(g => {
					g.commands.create(command.data);
				})
			})
		}
	}

	loadEvents(dirpath: string) {
		const allFileNames = readdirSync(dirpath)

		for (let i = 0; i < allFileNames.length; i++) {
			const filePath = path.join(dirpath, allFileNames[i]);

			import(filePath).then(f => {
				if (Object.keys(f.default).length == 0) {
					throw new Error(`File "${filePath}" hasn't default export`);
				}

				const event = f.default;
				this.client[event.once ? "once" : "on"](event.type, (...args: any) =>
					event.run({ client: this.client }, ...args)
				);
			})
		}
	}

	loadComponents(dirpath: string) {
		const allFileNames = readdirSync(dirpath).filter(f => !privateComponentRegex.test(f));

		for (let i = 0; i < allFileNames.length; i++) {
			const filePath = path.join(dirpath, allFileNames[i]);

			import(filePath).then(f => {
				if (Object.keys(f.default).length == 0) {
					throw new Error(`File "${filePath}" hasn't default export`);
				}

				const component = f.default;
				new component(this.client);
			})
		}
	}
}

export default Loader;