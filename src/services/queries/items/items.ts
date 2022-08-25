import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
// redis does not create keys for you automatically
import { genId } from '$services/utils';
import { itemsKey, itemsByViewsKey, itemdsByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));
	// if we dont find anything, by default we would get an empty object.
	if (Object.keys(item).length === 0) {
		return null;
	}
	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});
	const results = await Promise.all(commands);
	return results.map((result, index) => {
		if (Object.keys(result).length === 0) {
			return null;
		}
		return deserialize(ids[index], result);
	});
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	// date object 1994-11-05T08:15:30-05:00 or Thu, 04 Aug 2022 19:31:24 +0000
	// redis cannot by default searhc for or sort these dates. so we store in Unix time
	const id = genId();
	const serialized = serialize(attrs);
	await await Promise.all([
		client.hSet(itemsKey(id), serialized),
		// then we will add this to the sorted set to sort it by views with the initial score of 0
		client.zAdd(itemsByViewsKey(), {
			value: id,
			score: 0
		}),
		// we want to sort items by their endingAt time.
		client.zAdd(itemdsByEndingAtKey(), {
			value: id,
			score: attrs.endingAt.toMillis()
		})
	]);
	// this is specific this app because in some part of application this id needs to be used
	return id;
};
