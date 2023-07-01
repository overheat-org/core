"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnEvent = void 0;
function OnEvent(eventType) {
    return (target, ctx) => {
        if (ctx.kind != 'method') {
            throw new Error('This decorator only can used on Common Components Methods');
        }
        ctx.addInitializer(function () {
            const oldMethod = this[ctx.name];
            this[ctx.name] = () => {
                if (!this.client) {
                    throw new Error('This decorator only can used on Common Components Methods');
                }
                this.client.on(eventType, (...args) => oldMethod.bind(this)(...args));
            };
        });
    };
}
exports.OnEvent = OnEvent;
