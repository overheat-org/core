import DJS from 'discord.js';
declare class Bot<Ready extends boolean = boolean> extends DJS.Client<Ready> {
    constructor(options: DJS.ClientOptions);
    private listenCommands;
    login(): Promise<string>;
    runLoader(): void;
    start(): Promise<this>;
}
export default Bot;
