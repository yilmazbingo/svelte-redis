import { createClient } from 'redis';

console.log('process.env.REDIS_HOST', process.env.REDIS_HOST);
// this does not work at 4.3.0
const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW
});

client.on('error', (err) => console.error('error in redis connection', err));
client.connect();

export { client };
