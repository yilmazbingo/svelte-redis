- Every single user is going to have their own separate sets. we might have many many sets for everys single user. that is fine with redis..

# Incresing Liked number next to items

It is challenging. every separate user will ahve theri own set of like items. If we have a million of users, that means, we have a million different sets for likes. In redis,we dont have a very good built in way to take a look at all different sets and run a query together. For that we are gonna do a clever system:

Rather than trying to figure out how many people like an item, we are going to figure out how many people like an item ahead of time. Whenever someone likes an item, we add this item in that user's likeItemsSet. In addition to that we are going to store `likes` property in that item structure and increase the number. Updating this will be extra work but reading the data will be significantly faster.

When user sends a request, we have to be aware that user might click the like button twice in very,very quick succession. So we might accidentally get two requests in a row where the same user is trying to like the same item. In this scenario, we do not want to increment likes by two. We are going to handle that by a little bit behaviour around the `sAdd` function. When we call `sAdd`, we are going to get a number, either 0 or 1.

```js
const inserted = await client.sAdd(userLikesKey(userId), itemId);
// this will take care of accidental duplicate request
if (inserted) {
	// find the id, then the field and increase by 1
	return client.hIncrBy(itemsKey(itemId), 'likes', 1);
}
```
