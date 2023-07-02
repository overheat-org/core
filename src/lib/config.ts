import { readFileSync } from "fs";
import path from "path";

export default class Config {
	private _target = process.cwd() + '/.solidrc';
	public set target(targetPath: string) {
		this._target = path.join(process.cwd(), targetPath);
	}
	public get target() {
		return this._target;
	}

	static async use(filepath: string) {
		const fileData = readFileSync(filepath).toString();
		const fileInjsonFormat = JSON.parse(fileData);

		return new Config(fileInjsonFormat);
	}

	private constructor(config: Config) {
		Object.keys(config).forEach(k => this[k] = config[k]);
	}
}