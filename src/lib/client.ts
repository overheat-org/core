import DJS from 'discord.js';
import DotEnv from 'dotenv';

import Loader from './loader';
import { Command, ResponseManager } from './structures';
import Config from './config';

class Bot<Ready extends boolean = boolean> extends DJS.Client<Ready> {
	constructor(options: DJS.ClientOptions) {
		super(options);

		DotEnv.config({ path: process.cwd() + '/.env' });
		this.listenCommands();
	}

	private listenCommands() {
		this.on('interactionCreate', (interaction: DJS.Interaction<any>) => {
			if (!interaction.isChatInputCommand()) return;

			const foundCommand = Command.cache.get(interaction.commandName);
			const response = new ResponseManager(interaction);

			try {
				foundCommand!.run({
					interaction,
					response
				});
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

	private runLoader(target: string) {
		const loader = new Loader(this);

		this.waitReady().then(() => loader.loadCommands(target + '/commands'))
		loader.loadEvents(target + '/events');
		loader.loadComponents(target + '/components');
	}

	public async start() {
		const config = await Config.use('./.solidrc')
		this.runLoader(config.target);
		await this.login();

		return this;
	}

	public waitReady() {
		return new Promise(resolve => {
			this.once('ready', resolve);
		})
	}
}

export default Bot;