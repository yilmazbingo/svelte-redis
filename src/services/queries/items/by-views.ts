import { itemsByViewsKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const results = await client.sort(itemsByViewsKey(), {
		GET: ['#', `${itemsKey('*')}->name`, `${itemsKey('*')}->views`],
		BY: 'score'
	});
	// i get results in order "ID,TITLE,VIEWS"
	console.log('results in itemsByViews', results);
};
