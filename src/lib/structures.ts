import { ApplicationCommandOptionData, ChatInputCommandInteraction, ClientEvents, LocalizationMap, Permissions } from "discord.js";
import _client from "./client";

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, CommandInteraction, EmbedBuilder, EmbedData } from "discord.js";

export class ResponseManager {
	interaction: CommandInteraction;
	private ephemeral: boolean = false;

	setEphemeral(boolean: boolean) {
		this.ephemeral = boolean
	}

	constructor(interaction: CommandInteraction) {
		this.interaction = interaction;
	}

	success(data: string | EmbedData, linkButton?: { url: string, label: string }) {
		this.interaction.reply({
			embeds: [this.generateEmbed({
				data,
				defaultTitle: 'Sucesso',
				color: '#1cff95'
			})],
			components: linkButton ? [
				<any>new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel(linkButton.label)
						.setURL(linkButton.url)
				)
			] : undefined,
			ephemeral: this.ephemeral
		})
	}

	error(data: string | EmbedData) {
		this.interaction.reply({
			embeds: [this.generateEmbed({
				data,
				defaultTitle: 'Erro',
				color: '#ff1c37'
			})],
			ephemeral: this.ephemeral
		})
	}

	generateEmbed(obj: { data: string | EmbedData, color: ColorResolvable, defaultTitle: string }) {
		const embed = typeof obj.data == 'string'
			? obj.data.length > 20
				? new EmbedBuilder()
					.setTitle(obj.defaultTitle)
					.setDescription(obj.data)
					.setColor(obj.color)
					.setFooter({
						text: this.interaction.user.username,
						iconURL: this.interaction.user.avatarURL() ?? this.interaction.user.defaultAvatarURL
					})
				: new EmbedBuilder()
					.setAuthor({
						name: obj.data,
						iconURL: this.interaction.user.avatarURL() ?? this.interaction.user.defaultAvatarURL
					})
					.setColor(obj.color)
			: new EmbedBuilder(obj.data)
				.setColor(obj.data.color ? obj.data.color : obj.color)

		return embed;
	}
}

export declare class CommandData {
	name: string;
	name_localizations?: LocalizationMap;
	description: string;
	description_localizations?: LocalizationMap;
	options: ApplicationCommandOptionData[];
	default_permission?: boolean;
	default_member_permissions?: Permissions | null;
	dm_permission?: boolean;
}

export class Command {
	static cache = new Map<string, Command>();

	data: CommandData;
	run: (obj: {
		interaction: ChatInputCommandInteraction<'cached'>,
		response: ResponseManager
	}) => Promise<any>;

	constructor(command: Command['data'] & { run: Command['run'] }) {
		const { run, ...data } = command;
		this.run = run;
		this.data = data;
	}
}

export declare class EventData<Type extends keyof ClientEvents> {
	type: Type;
	once?: boolean;
}

export class Event<Type extends keyof ClientEvents> {
	data: EventData<Type>;
	run: (
		options: { client: _client },
		...args: ClientEvents[Type]
	) => Promise<any>;

	constructor(event: Event<Type>['data'] & { run: Event<Type>['run'] }) {
		const { run, ...data } = event;
		this.run = run;
		this.data = data;
	}
}

export abstract class Component {
	static instance: Component;

	constructor(protected client: typeof _client) {
		Component.instance = this;
	}
}