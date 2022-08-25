import { itemsByViewsKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';

export const incrementView = async (itemId: string, userId: string) => {
	// find views and increment views by 1
	return Promise.all([
		// increment the item hash's 'views' property by 1
		client.hIncrBy(itemsKey(itemId), 'views', 1),
		// increement the sorted set's score for this item by 1
		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	]);
};
