import { itemdsByEndingAtKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from '.';

// we are loading relational data
export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	// find all the items from now till the inf
	const ids = await client.zRange(itemdsByEndingAtKey(), Date.now(), '+inf', {
		// THIS WILL RETURN the values instead of index
		BY: 'SCORE',
		LIMIT: {
			// we don t want to get millions of features
			offset,
			count
		}
	});
	const results = await Promise.all(ids.map((id) => client.hGetAll(itemsKey(id))));
	// we need to pass the id to deserialize. I use index to look up the item from the ids array.
	return results.map((item, index) => deserialize(ids[index], item));
};
