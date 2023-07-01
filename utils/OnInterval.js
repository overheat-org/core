"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnInterval = void 0;
function OnInterval(ms) {
    return (target, ctx) => {
        if (ctx.kind != 'method') {
            throw new Error('This decorator only can used on Components Methods');
        }
        ctx.addInitializer(function () {
            const oldMethod = this[ctx.name];
            this[ctx.name] = () => {
                setInterval(oldMethod, ms);
            };
        });
    };
}
exports.OnInterval = OnInterval;
