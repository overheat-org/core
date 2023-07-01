import { ClientEvents } from "discord.js";
export declare function OnEvent(eventType: keyof ClientEvents): (target: any, ctx: ClassMethodDecoratorContext) => void;
export declare function OnEvent(eventType: string): (target: any, ctx: ClassMethodDecoratorContext) => void;
