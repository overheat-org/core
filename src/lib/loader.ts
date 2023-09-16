import fs from "fs";
import DJS from 'discord.js';
import ProductionClient from "./client/production";
import { join as j, basename } from "path";
import { Command, Event } from "./structures";
import { readdir } from "fs/promises";
import Logger from "./logger";

type File = { path: string, parent: string };

class Loader {
	constructor(private client: ProductionClient, cached = false) {}

	async readDir(path: string, options = { forFile: false }) {
		const joinOnDir = async (path: string, parent: string) => {
			const files = new Array<File>();
			const readDir = await readdir(path, { withFileTypes: true });
			
			for(const dirent of readDir) {
				if(dirent.isFile()) {
					files.push({
						path: j(path, dirent.name),
						parent
					})
				}
				else if(dirent.isDirectory()) {
					if(dirent.name.startsWith('#')) return;

					await joinOnDir(path, parent);
				}
			}

			return files;
		}

		const dir = await joinOnDir(path, basename(path));
		
		switch (basename(path)) {
			case 'commands':
				dir?.forEach(this.loadCommand)
				return;
				
			case 'events':
				dir?.forEach(this.loadEvent)
				return;
		}

		if(options.forFile) {
			dir?.filter(c => /\.evt\.(js|ts)$/.test(c.path)).forEach(this.loadEvent)
			dir?.filter(c => /\.cmd\.(js|ts)$/.test(c.path)).forEach(this.loadCommand)
		}
	}
	
	loadCommand(file: File) {
		try {
			import(file.path).then(async (f) => {
				if (!f.default) {
					throw new Error(`File "${file.path}" hasn't default export`);
				}
	
				const command: Command = f.default;
				Command.cache.set(command.data.name, command);
	
				let targetRegister: DJS.GuildApplicationCommandManager | DJS.ApplicationCommandManager<DJS.ApplicationCommand<{ guild: DJS.GuildResolvable; }>, { guild: DJS.GuildResolvable; }, null>;
				if (process.env.NODE_ENV == 'development') {
					const guildTestId = process.env.GUILD_TEST;
	
					if (!guildTestId) {
						throw new Error('Enviroment variable "GUILD_TEST" not specified');
					}
	
					targetRegister = (await this.client.guilds.fetch(guildTestId)).commands;
				} else {
					targetRegister = this.client.application!.commands;
				}
	
				const fetchedCommand = targetRegister.cache.find(
					(c) => c.name == command.data.name
				);
	
				if (fetchedCommand) {
					targetRegister.edit(fetchedCommand.id, command.data);
				} else {
					targetRegister.create(command.data);
				}
			});
		} catch(e: any) {
			Logger.error(e);
		}
	}

	loadEvent(file: File) {
		try {
			import(file.path).then((f) => {
				if (!f.default) {
					throw new Error(`File "${file.path}" hasn't default export`);
				}
	
				const event: Event<any> = f.default;
				this.client[event.data.once ? "once" : "on"](
					event.data.type,
					(...args: any) => event.run(...args)
				);
			});
		} catch(e: any) {
			Logger.error(e);
		}
	}
}

export default Loader;
