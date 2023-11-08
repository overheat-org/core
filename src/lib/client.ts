import DJS from 'discord.js';
import { Command } from './structures';
import loadEnv from './env';
import Config from './config';

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
				} catch (err) {
					console.error(`Comando deu errado: ${err}`);
				}
			}
			else if (interaction.isAutocomplete()) {
				const foundCommand = Command.cache.get(interaction.commandName);

				try {
					foundCommand?.autocomplete?.(interaction);
				} catch (err) {
					console.error(`autocomplete erro: ${err}`)
				}
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

	public waitReady() {
		return new Promise(resolve => {
			this.once('ready', resolve);
		});
	}
}

export default Client;


if(require.main == module) {
	const config = Config.use();

	new Client(config).login();
}