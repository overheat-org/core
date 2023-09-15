import DotEnv from "dotenv";
import { existsSync } from "fs";

function loadEnv() {
	const devPath = process.cwd() + '/.env.development';
	const prodPath = process.cwd() + '/.env.production';
	let path: string;

	if (process.env.NODE_ENV == 'development' && existsSync(devPath)) {
		path = devPath;
	} 
	else if (process.env.NODE_ENV == 'production' && existsSync(prodPath)) {
		path = prodPath;
	}
	else {
		const commonPath = process.cwd() + '/.env';
		
		if(existsSync(commonPath)) {
			path = commonPath;
		} else {
			console.warn('Env file not found')

			return;
		}
	}

	DotEnv.config({ path });
}

export default loadEnv;