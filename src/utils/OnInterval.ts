export function OnInterval(ms?: number | undefined) {
	return (target, ctx: ClassMethodDecoratorContext) => {
		if (ctx.kind != 'method') {
			throw new Error('This decorator only can used on Components Methods')
		}

		ctx.addInitializer(function (this: any) {
			const oldMethod = this[ctx.name];

			this[ctx.name] = () => {
				setInterval(oldMethod, ms)
			};
		})
	}
}