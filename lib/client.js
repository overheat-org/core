"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const loader_1 = __importDefault(require("./loader"));
const structures_1 = require("./structures");
class Bot extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        dotenv_1.default.config({ path: process.cwd() + '/.env' });
        this.listenCommands();
    }
    listenCommands() {
        this.on('interactionCreate', interaction => {
            if (!interaction.isChatInputCommand())
                return;
            const foundCommand = structures_1.Command.cache.get(interaction.commandName);
            const response = new structures_1.ResponseManager(interaction);
            try {
                foundCommand.run({ interaction, response });
            }
            catch (err) {
                console.error(`Comando deu errado: ${err}`);
            }
        });
    }
    login() {
        if (process.env.TOKEN) {
            return super.login(process.env.TOKEN);
        }
        else {
            return super.login();
        }
    }
    runLoader() {
        const loader = new loader_1.default(this);
        loader.loadCommands(process.cwd() + '/src/commands');
        loader.loadEvents(process.cwd() + '/src/events');
        loader.loadComponents(process.cwd() + '/src/components');
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.runLoader();
            yield this.login();
            return this;
        });
    }
}
exports.default = Bot;
