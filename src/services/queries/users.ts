import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, userNamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	// use the username argument to look up the persons UserId with the usernamseSortedSet
	// edis ZSCORE command is used to return the score of a member in the sorted set
	const decimalId = await client.zScore(userNamesKey(), username);
	// make sure we actually got an ID from the lookup
	if (!decimalId) {
		throw new Error('used does not exist');
	}

	// take the id and convert it back to hex.  Becasue when saved the username upon signup we converted to base10
	const id = decimalId.toString(16);
	// Use the id to look up the user's hash.
	const user = await client.hGetAll(usersKey(id));
	// deserialize and return the hash
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	// redis does not generate id's for us
	const id = genId(); // a number that coded into hexadecimal
	// sIsMember returns 1=exists or 0=notexist
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	if (exists) {
		throw new Error('Username is taken');
	}
	// hset is used to create or update hash.
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	// add the new user to the users sorted set
	// Type 'string' is not assignable to type 'number'. because value in sorted set must be number. but id=genId() is string
	await client.zAdd(userNamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});
	// not required but another part of the application requirs that id
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

// we did not store the id when we saved the user
const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
