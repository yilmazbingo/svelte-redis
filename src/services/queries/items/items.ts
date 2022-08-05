import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
// redis does not create keys for you automatically
import { genId } from '$services/utils';
import { itemsKey } from '$services/keys';

export const getItem = async (id: string) => {};

export const getItems = async (ids: string[]) => {};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	// date object 1994-11-05T08:15:30-05:00 or Thu, 04 Aug 2022 19:31:24 +0000
	// redis cannot by default searhc for or sort these dates. so we store in Unix time
	const id = genId();
	const serialized = serialize(attrs);
	await client.hSet(itemsKey(id), serialized);
	// this is specific this app because in some part of application this id needs to be used
	return id;
};
