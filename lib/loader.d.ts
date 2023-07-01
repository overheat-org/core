import Bot from "./client";
declare class Loader {
    private client;
    constructor(client: Bot);
    loadCommands(dirpath: string): void;
    loadEvents(dirpath: string): void;
    loadComponents(dirpath: string): void;
}
export default Loader;
