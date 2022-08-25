export const pageCacheKey = (id: string) => 'pagecache#' + id;
export const usersKey = (userId: string) => 'users#' + userId;
export const sessionsKey = (sessionId: string) => 'sessions#' + sessionId;
export const usernamesUniqueKey = () => 'usernames:unique';
export const userLikesKey = (userId: string) => 'users:Likes#' + userId;
export const userNamesKey = () => 'usernames';

// ITEMS
export const itemsKey = (itemId: string) => 'items#' + itemId;
// items are views sort set
export const itemsByViewsKey = () => 'items:views';
export const itemsViewKey = (itemId: string) => 'items:views#' + itemId;
export const itemdsByEndingAtKey = () => 'items:endingAt';
