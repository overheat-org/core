import loadEnv from './env';
import DJS from 'discord.js';
import { Command } from './structures';
import Config from './config';
import Loader from './loader';
import Logger from './logger';

class Client<Ready extends boolean = boolean> extends DJS.Client<Ready> {
	config: Config;

	constructor(config: Config) {
		super(config.clientOptions);

		this.config = config;
		loadEnv();
		this.listenCommands();
	}

	private listenCommands() {
		this.on('interactionCreate', (interaction: DJS.Interaction<any>) => {
			if (interaction.isChatInputCommand()) {
				const foundCommand = Command.cache.get(interaction.commandName);

				try {
					foundCommand!.run({ interaction });
				} catch (err: any) {
					Logger.error(`Command Error: ${err.message}`, err.stack);
				}
			}
			else if (interaction.isAutocomplete()) {
				const foundCommand = Command.cache.get(interaction.commandName);

				try {
					foundCommand?.autocomplete?.(interaction);
				} catch (err: any) {
					Logger.error(`Autocomplete Error: ${err.message}`, err.stack);
				}
			}
		});
	}

	public login(): Promise<string> {
		if (process.env.TOKEN) {
			return super.login(process.env.TOKEN);
		} else {
			return super.login();
		}
	}

	public waitReady() {
		return new Promise(resolve => {
			this.once('ready', resolve);
		});
	}
}

export default Client;


if(require.main == module) {
	const config = Config.use();

	const client = new Client(config);

	client.waitReady().then(() => Logger.ready(`Logged as ${client.user?.tag}`));

	if(process.env.NODE_ENV == 'development') {
		const loader = new Loader(client);

		loader.run(config.target);
	}

	client.login();
}