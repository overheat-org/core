"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.Command = exports.ResponseManager = void 0;
const discord_js_1 = require("discord.js");
class ResponseManager {
    setEphemeral(boolean) {
        this.ephemeral = boolean;
    }
    constructor(interaction) {
        this.ephemeral = false;
        this.interaction = interaction;
    }
    success(data, linkButton) {
        this.interaction.reply({
            embeds: [this.generateEmbed({
                    data,
                    defaultTitle: 'Sucesso',
                    color: '#1cff95'
                })],
            components: linkButton ? [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setLabel(linkButton.label)
                    .setURL(linkButton.url))
            ] : undefined,
            ephemeral: this.ephemeral
        });
    }
    error(data) {
        this.interaction.reply({
            embeds: [this.generateEmbed({
                    data,
                    defaultTitle: 'Erro',
                    color: '#ff1c37'
                })],
            ephemeral: this.ephemeral
        });
    }
    generateEmbed(obj) {
        var _a, _b;
        const embed = typeof obj.data == 'string'
            ? obj.data.length > 20
                ? new discord_js_1.EmbedBuilder()
                    .setTitle(obj.defaultTitle)
                    .setDescription(obj.data)
                    .setColor(obj.color)
                    .setFooter({
                    text: this.interaction.user.username,
                    iconURL: (_a = this.interaction.user.avatarURL()) !== null && _a !== void 0 ? _a : this.interaction.user.defaultAvatarURL
                })
                : new discord_js_1.EmbedBuilder()
                    .setAuthor({
                    name: obj.data,
                    iconURL: (_b = this.interaction.user.avatarURL()) !== null && _b !== void 0 ? _b : this.interaction.user.defaultAvatarURL
                })
                    .setColor(obj.color)
            : new discord_js_1.EmbedBuilder(obj.data)
                .setColor(obj.data.color ? obj.data.color : obj.color);
        return embed;
    }
}
exports.ResponseManager = ResponseManager;
class Command {
    constructor(command) {
        const { run } = command, data = __rest(command, ["run"]);
        this.run = run;
        this.data = data;
    }
}
exports.Command = Command;
Command.cache = new Map();
class Event {
    constructor(event) {
        const { run } = event, data = __rest(event, ["run"]);
        this.run = run;
        this.data = data;
    }
}
exports.Event = Event;
