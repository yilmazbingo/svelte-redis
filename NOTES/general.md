- redis is single threaded
- if you want to pass todays world use strings

`SET news 'Today\'s Headlines' EX 3 `
`SET news "Today's Headlines" PX 2000 ` PX takes miliseconds value

`SET color green GET` Set and then Get the previous color value.
`SET asdf 'hi there' XX` set asdf only if it already exists
`SET asdf 'hi there' NX` set asdf only if it does not exist. NX= Not exist

## why do we have expire option in `set`

- `EX` allows you to designate how long to wait in miliseconds. when will this value expire. good for caching
- `EXAT` and `PXAT` allow you to specify a date time, like an actual particular time
- `KEEPTTL` means keep any expiration that has already been applied to this key

Redis was originally designed as a caching server. after some time it will get rid of the cached data.

- our API server is going to be receiving requests for some headlines of news. to make sure our api is very fast, we might have two different databases for servicing our application. One might be like a traditional database like Postgresql and also we might have a redis database running as well. to make our api quick we can use our redis as a caching server.

we want to response requests as fast as possible. our api might decide to first see if the latest headlines are stored inside of redis. as soon as the API sees that no data is available inside of redis, it might fallback as a second choice to trying to get some data out of our traditional database, which in general is probably going to be much slower than using redis. inside of our traditional database we might have latest headlines stored. the API will get the copy of the latest headlines and send them back in response to whoever made that original request. Simultaneously, it might also store a copy of the latest headlines inside of Redis.

Now let's think about if another request comes in shortly after. this time, api will be served from the redis. the downside is we might not have anything available for any part of our application to automatically update the headlinse inside of redis. there is a very simple reason for this. REdis all of its data has to be stored in the memory. So we cannot always put all of our headlines in Redis because we might eventually run out of memory. to get around of that problem, we might to automatically delete this particular headline after it has not been access in any way in some number of seconds to save some space.

## Set multiple keys

- `SETEX` is same as `set` with `EX` option. `SET color red EX 2=SETEX color 2 red`. expire after 2 seconds.
- `SET` with `NX` option is going to update or set a key value pair if it does not already exist. `setnx` is same
- `MSET` is for multiple key value pairs. `MSET color red car Toyota`
- `DEL color`
- `GETRANGE color 0 3` index 0-3 including 3rd
- `SETRANGE color 2 blue` update the portion of string. FOr this you already should have `color`. so run `SET color red` THIS WILL RETURN THE LENGTH. `GET color` should return `reblue`

## Why would we ever want to replace part of string

if we are using colors, instead we could encode those values `red -> a green->b`. we can do this for type of our products or material of our products. In redis we might store them like this

```js
   // type-color-material
item:1     aqg
item:2     gbo
```

`GETRANGE item:1 0 1` maybe i care about only type and color
`SETRANGE item:1 0 bcd`

## Dealing with Numbers

`INCR age` redis parses

- let's say we have posts website and users upvote posts. popular posts might get upvotes all the time. Imagine that we have received two requests at exactly the same time to our API server asking to upvote a particular post. if we had 20 upvotes we expect to have 22. IN the system design we we might have two API Server connects to the same Redis db. If we are doing update in two round up fashion. `GET` AND `SET`.

we are receiving the upvote request at exaxt same time. Redis will send back to both Api servers 20. at exact same time time, both of api servers will parse that number and add 1 to 21. and simultaneoulsy they both will tell redis let's update the value to 21.

there are 3 possible solutions:
1- Use a Redis transaction with "WATCH"
2- Use a lock
3- Use Incr

Redis is synchronous and single threated in nature. that means that even if a tremendous number of commands are coming in at exactly the same time, like the smae microseconds, it does not make a difference to Redis. Redis only processes one command at a time.
