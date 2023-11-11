#!/usr/bin/env node

import cp from 'child_process';
import Logger from './logger';
import path from 'path';

const [nodePath, _filePath, commandName, ...args] = process.argv;
const clientPath = path.join(__dirname, 'client.js');

switch (commandName) {
	case 'dev': {
		const bot = cp.spawn(nodePath, [clientPath, 'dev', ...args], { stdio: 'inherit' });

		bot.on('exit', (code) => {
			Logger.warn(`Bot was finalized with status ${code}`);
		});

		break;
	}

	case 'build': {
		break;
	}

	case '':
		Logger.error('Type a command');
		break;

	default:
		Logger.error('Invalid command');
}