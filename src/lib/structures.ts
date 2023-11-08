import DJS from "discord.js";
import _client from "./client";

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