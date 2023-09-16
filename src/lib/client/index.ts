import DevelopmentClient from "./development";
import ProductionClient from "./production";

const Client = process.env.NODE_ENV == 'development'
	? DevelopmentClient
	: ProductionClient;

export default Client;