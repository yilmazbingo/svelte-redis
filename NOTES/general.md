## why do we have expire option in `set`

- `EX` allows you to designate how long to wait in miliseconds
- `EXAT` and `PXAT` allow you to specify a date time, like an actual particular time
- `KEEPTTL` means keep any expiration that has already been applied to this key

Redis was originally designed as a caching server. after some time it will get rid of the cached data.

- our API server is going to be receiving requests for some headlines of news. to make sure our api is very fast, we might have two different databases for servicing our application. One might be like a traditional database like Postgresql and also we might have a redis database running as well. to make our api quick we can use our redis as a caching server.

we want to response requests as fast as possible. our api might decide to first see if the latest headlines are stored inside of redis. as soon as the API sees that no data is available inside of redis, it might fallback as a second choice to trying to get some data out of our traditional database, which in general is probably going to be much slower than using redis. inside of our traditional database we might have latest headlines stored. the API will get the copy of the latest headlines and send them back in response to whoever made that original request. Simultaneously, it might also store a copy of the latest headlines inside of Redis.

Now let's think about if another request comes in shortly after. this time, api will be served from the redis. the downside is we might not have anything available for any part of our application to automatically update the headlinse inside of redis. there is a very simple reason for this. REdis all of its data has to be stored in the memory. So we cannot always put all of our headlines in Redis because we might eventually run out of memory. to get around of that problem, we might to automatically delete this particular headline after it has not been access in any way in some number of seconds to save some space.

## Set multiple keys

- `SETEX` is same as `set` with `EX` option.
- `SET` with `NX` option is going to update or set a key value pair if it does not already exist. `setnx` is same
- `MSET` is for multiple key value pairs.
