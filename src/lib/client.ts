import DJS from 'discord.js';
import DotEnv from 'dotenv';

import Loader from './loader';
import { Command, ResponseManager } from './structures';

class Bot<Ready extends boolean = boolean> extends DJS.Client<Ready> {
	constructor(options: DJS.ClientOptions) {
		super(options);

		DotEnv.config({ path: process.cwd() + '/.env' });
		this.listenCommands();
	}

	private listenCommands() {
		this.on('interactionCreate', interaction => {
			if (!interaction.isChatInputCommand()) return;

			const foundCommand = Command.cache.get(interaction.commandName);
			const response = new ResponseManager(interaction);

			try {
				foundCommand!.run({ interaction, response });
			} catch (err) {
				console.error(`Comando deu errado: ${err}`);
			}
		})
	}

	public login(): Promise<string> {
		if (process.env.TOKEN) {
			return super.login(process.env.TOKEN);
		} else {
			return super.login();
		}
	}

	private runLoader() {
		const loader = new Loader(this);

		loader.loadCommands(process.cwd() + '/src/commands');
		loader.loadEvents(process.cwd() + '/src/events');
		loader.loadComponents(process.cwd() + '/src/components');
	}

	public async start() {
		this.runLoader();
		await this.login();

		return this;
	}
}

export default Bot;