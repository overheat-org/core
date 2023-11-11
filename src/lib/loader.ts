import DJS from 'discord.js';
import Client from "./client";
import { join as j, basename } from "path";
import { Command, Event } from "./structures";
import { readdir,  } from "fs/promises";
import { existsSync } from 'fs';

type File = { path: string, parent: string };

class Loader {
	constructor(private client: Client) {}

	async run(path: string) {
		if(!existsSync(path)) return;

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
					
					if(['commands', 'events'].includes(dirent.name)) {						
						await joinOnDir(path, dirent.name);
					} else {
						await joinOnDir(path, parent);
					}
				}
			}

			return files;
		}

		const dir = await joinOnDir(path, basename(path));

		dir
			?.filter(f => f.parent == 'commands' || /\.cmd\.(js|ts)$/.test(f.path))
			.forEach(this.loadCommand);

		dir
			?.filter(f => f.parent == 'events' || /\.evt\.(js|ts)$/.test(f.path))
			.forEach(this.loadEvent);
		
	}
	
	private loadCommand = async (file: File) => {
		try {
			const f = await import(file.path);

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
		} catch(e: any) {
			throw e;
		}
	}

	private loadEvent = async (file: File) => {
		try {
			const f = await import(file.path)

			if (!f.default) {
				throw new Error(`File "${file.path}" hasn't default export`);
			}

			const event: Event<any> = f.default;

			this.client[event.data?.once ? "once" : "on"](
				event.data.type,
				(...args: any) => event.run(...args)
			);
		} catch(e: any) {
			throw e;
		}
	}
}

export default Loader;
