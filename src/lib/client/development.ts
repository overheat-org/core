import Config from '../config';
import Loader from '../loader';
import _Client from './production';
import ProductionClient from './production';

class DevelopmentClient<Ready extends boolean = boolean> extends ProductionClient<Ready> {
	private runLoaders(target: string) {
		const loader = new Loader(this);

		this.waitReady().then(() => loader.readDir(target + '/commands'))
		loader.readDir(target + '/events');
	}

	public async start() {
		const config = await Config.use();
		this.runLoaders(config.target);
		await this.login();

		return this;
	}
}

export default DevelopmentClient;