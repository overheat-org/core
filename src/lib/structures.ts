import DJS, { Interaction } from "discord.js";
import _client from "./client";

export class ResponseManager {
	interaction: DJS.CommandInteraction;
	private ephemeral: boolean = false;

	setEphemeral(boolean: boolean) {
		this.ephemeral = boolean
	}

	constructor(interaction: DJS.CommandInteraction) {
		this.interaction = interaction;
	}

	success(data: string | DJS.EmbedData, linkButton?: { url: string, label: string }) {
		this.interaction.reply({
			embeds: [this.generateEmbed({
				data,
				defaultTitle: 'Sucesso',
				color: '#1cff95'
			})],
			components: linkButton ? [
				<any>new DJS.ActionRowBuilder().addComponents(
					new DJS.ButtonBuilder()
						.setStyle(DJS.ButtonStyle.Link)
						.setLabel(linkButton.label)
						.setURL(linkButton.url)
				)
			] : undefined,
			ephemeral: this.ephemeral
		})
	}

	error(data: string | DJS.EmbedData) {
		this.interaction.reply({
			embeds: [this.generateEmbed({
				data,
				defaultTitle: 'Erro',
				color: '#ff1c37'
			})],
			ephemeral: this.ephemeral
		})
	}

	generateEmbed(obj: { data: string | DJS.EmbedData, color: DJS.ColorResolvable, defaultTitle: string }) {
		const embed = typeof obj.data == 'string'
			? obj.data.length > 20
				? new DJS.EmbedBuilder()
					.setTitle(obj.defaultTitle)
					.setDescription(obj.data)
					.setColor(obj.color)
					.setFooter({
						text: this.interaction.user.username,
						iconURL: this.interaction.user.avatarURL() ?? this.interaction.user.defaultAvatarURL
					})
				: new DJS.EmbedBuilder()
					.setAuthor({
						name: obj.data,
						iconURL: this.interaction.user.avatarURL() ?? this.interaction.user.defaultAvatarURL
					})
					.setColor(obj.color)
			: new DJS.EmbedBuilder(obj.data)
				.setColor(obj.data.color ? obj.data.color : obj.color)

		return embed;
	}
}

export declare class CommandData {
	name: string;
	name_localizations?: DJS.LocalizationMap;
	description: string;
	description_localizations?: DJS.LocalizationMap;
	options: DJS.ApplicationCommandOptionData[];
	default_permission?: boolean;
	default_member_permissions?: Permissions | null;
	dm_permission?: boolean;
}

export class Command {
	static cache = new Map<string, Command>();

	data: CommandData;
	run: (obj: {
		interaction: DJS.ChatInputCommandInteraction<'cached'>,
		response: ResponseManager
	}) => any;
	autocomplete?: (interaction: DJS.AutocompleteInteraction<'cached'>) => any;

	constructor(command: Command['data'] & { run: Command['run'] } & { autocomplete?: Command['autocomplete'] }) {
		const { run, autocomplete, ...data } = command;
		this.run = run;
		this.data = data;
		this.autocomplete = autocomplete;
	}
}

export declare class EventData<Type extends keyof DJS.ClientEvents> {
	type: Type;
	once?: boolean;
}

export class Event<Type extends keyof DJS.ClientEvents> {
	data: EventData<Type>;
	run: (...args: DJS.ClientEvents[Type]) => any;

	constructor(event: Event<Type>['data'] & { run: Event<Type>['run'] }) {
		const { run, ...data } = event;
		this.run = run;
		this.data = data;
	}
}