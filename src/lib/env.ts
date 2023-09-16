import { join as j } from 'path';
import DotEnv from "dotenv";
import { existsSync } from "fs";
import Logger from './logger';

process.env.NODE_ENV = process.argv[2] == 'dev'
	? 'development'
	: 'production'

const devPath = j(process.cwd(), '/.env.development');
const prodPath = j(process.cwd(), '/.env.production');

function loadEnv() {
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
			Logger.warn('Env file not found');

			return;
		}
	}

	DotEnv.config({ path });
}

export default loadEnv;