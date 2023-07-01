import { ClientEvents } from "discord.js";

export function OnEvent(eventType: keyof ClientEvents): (target: any, ctx: ClassMethodDecoratorContext) => void
export function OnEvent(eventType: string): (target: any, ctx: ClassMethodDecoratorContext) => void
export function OnEvent(eventType: unknown) {
	return (target, ctx: ClassMethodDecoratorContext) => {
		if (ctx.kind != 'method') {
			throw new Error('This decorator only can used on Common Components Methods')
		}

		ctx.addInitializer(function (this: any) {
			const oldMethod: Function = this[ctx.name];

			this[ctx.name] = () => {
				if (!this.client) {
					throw new Error('This decorator only can used on Common Components Methods')
				}

				this.client.on(eventType, (...args) => oldMethod.bind(this)(...args))
			};
		})
	}
}
