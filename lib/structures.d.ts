import { ApplicationCommandOptionData, ChatInputCommandInteraction, ClientEvents, LocalizationMap, Permissions } from "discord.js";
import client from "./client";
import { ColorResolvable, CommandInteraction, EmbedBuilder, EmbedData } from "discord.js";
export declare class ResponseManager {
    interaction: CommandInteraction;
    private ephemeral;
    setEphemeral(boolean: boolean): void;
    constructor(interaction: CommandInteraction);
    success(data: string | EmbedData, linkButton?: {
        url: string;
        label: string;
    }): void;
    error(data: string | EmbedData): void;
    generateEmbed(obj: {
        data: string | EmbedData;
        color: ColorResolvable;
        defaultTitle: string;
    }): EmbedBuilder;
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
export declare class Command {
    static cache: Map<string, Command>;
    data: CommandData;
    run: (obj: {
        interaction: ChatInputCommandInteraction;
        response: ResponseManager;
    }) => Promise<any>;
    constructor(command: Command['data'] & {
        run: Command['run'];
    });
}
export declare class EventData<Type extends keyof ClientEvents> {
    type: Type;
    once?: boolean;
}
export declare class Event<Type extends keyof ClientEvents> {
    data: EventData<Type>;
    run: (options: {
        client: client;
    }, ...args: ClientEvents[Type]) => Promise<any>;
    constructor(event: Event<any>['data'] & {
        run: Event<any>['run'];
    });
}
