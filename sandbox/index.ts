import 'dotenv/config';
import { client } from '../src/services/redis';
console.log('client', client);

const run = async () => {
	// setting up like this does not work in 4.3.0
	await client.hSet('car', {
		color: 'red',
		year: 1950
		//@ts-nocheck
		// engine: { cylinders: 8 },
	});

	// await client.hSet('house', {
	// 	year: 1950,
	// 	owner: null
	// });
	// await client.hSet('car2', {
	// 	color: 'green',
	// 	year: 1955
	// });
	// await client.hSet('car3', {
	// 	color: 'blue',
	// 	year: 1960
	// });

	// const commands = [1, 2, 3].map((id) => {
	// 	return client.hGetAll('car' + id);
	// });

	// const results = await Promise.all(commands);
	const results = await client.hGetAll('car');

	console.log(results);
};
run();

// import 'dotenv/config';
// import { client } from '../src/services/redis';

// const run = async () => {
// 	await client.hSet('house', {
// 		year: 1950,
// 		owner: null
// 	});

// 	const results = await client.hGetAll('car');

// 	console.log(results);
// };
// run();
