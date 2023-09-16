import DJS from 'discord.js';
import { Command, ResponseManager } from '../structures';
import loadEnv from '../env';

class ProductionClient<Ready extends boolean = boolean> extends DJS.Client<Ready> {
	constructor(options: DJS.ClientOptions) {
		super(options);

		loadEnv();
		this.listenCommands();
	}

	private listenCommands() {
		this.on('interactionCreate', (interaction: DJS.Interaction<any>) => {
			if (interaction.isChatInputCommand()) {
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

	public async start() {
		await this.login();

		return this;
	}

	public waitReady() {
		return new Promise(resolve => {
			this.once('ready', resolve);
		})
	}
}

export default ProductionClient;