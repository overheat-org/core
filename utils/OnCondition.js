"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCondition = void 0;
function OnCondition(condition) {
    return (target, ctx) => {
        if (ctx.kind != 'method') {
            throw new Error('This decorator only can used on Components Methods');
        }
        ctx.addInitializer(function () {
            const oldMethod = this[ctx.name];
            this[ctx.name] = () => {
                if (condition)
                    oldMethod();
            };
        });
    };
}
exports.OnCondition = OnCondition;
