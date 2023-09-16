import { readFileSync } from "fs";
import { join as j } from "path";

export default class Config {
	private _target = process.cwd() + "/src";
	public set target(targetPath: string) {
		this._target = j(process.cwd(), targetPath);
	}
	public get target() {
		return this._target;
	}

	static async use(dirpath = process.cwd()) {
		const fileData = readFileSync(j(dirpath, '.overheatrc')).toString();
		const fileInJsonFormat = JSON.parse(fileData);

		return new Config(fileInJsonFormat);
	}

	private constructor(config: Config) {
		Object.keys(config).forEach((k) => (this[k] = config[k]));
	}
}
