"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const structures_1 = require("./structures");
const privateComponentRegex = /^\(.*\)\.ts$/;
class Loader {
    constructor(client) {
        this.client = client;
    }
    loadCommands(dirpath) {
        const allFileNames = (0, fs_1.readdirSync)(dirpath);
        for (let i = 0; i < allFileNames.length; i++) {
            const filePath = path_1.default.join(dirpath, allFileNames[i]);
            Promise.resolve(`${filePath}`).then(s => __importStar(require(s))).then(f => {
                if (Object.keys(f.default).length == 0) {
                    throw new Error(`File "${filePath}" hasn't default export`);
                }
                const command = f.default;
                structures_1.Command.cache.set(command.name, command);
                (this.client.guilds.fetch(process.env.guildTest)).then(g => {
                    g.commands.create(command.data);
                });
            });
        }
    }
    loadEvents(dirpath) {
        const allFileNames = (0, fs_1.readdirSync)(dirpath);
        for (let i = 0; i < allFileNames.length; i++) {
            const filePath = path_1.default.join(dirpath, allFileNames[i]);
            Promise.resolve(`${filePath}`).then(s => __importStar(require(s))).then(f => {
                if (Object.keys(f.default).length == 0) {
                    throw new Error(`File "${filePath}" hasn't default export`);
                }
                const event = f.default;
                this.client[event.once ? "once" : "on"](event.type, (...args) => event.run({ client: this.client }, ...args));
            });
        }
    }
    loadComponents(dirpath) {
        const allFileNames = (0, fs_1.readdirSync)(dirpath).filter(f => !privateComponentRegex.test(f));
        for (let i = 0; i < allFileNames.length; i++) {
            const filePath = path_1.default.join(dirpath, allFileNames[i]);
            Promise.resolve(`${filePath}`).then(s => __importStar(require(s))).then(f => {
                if (Object.keys(f.default).length == 0) {
                    throw new Error(`File "${filePath}" hasn't default export`);
                }
                const component = f.default;
                new component(this.client);
            });
        }
    }
}
exports.default = Loader;
