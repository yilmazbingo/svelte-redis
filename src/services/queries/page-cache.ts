import { client } from '$services/redis';
//  this creates a key to be consistent over all the app
import { pageCacheKey } from '$services/keys';

const cachedRoutes = ['/about', '/privacy', '/auth/signin', '/auth/signup'];
export const getCachedPage = (route: string) => {
	if (cachedRoutes.includes(route)) {
		// naming key value in redis is up to you
		return client.get(pageCacheKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	if (cachedRoutes.includes(route)) {
		// set(key,value)
		// set expire time in EX:
		return client.set(pageCacheKey(route), page, { EX: 2000 });
	}
};
