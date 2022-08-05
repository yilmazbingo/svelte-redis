- A shard is just horizontal partition of your database. Each shard might have one or more backups assoicated with it.
- sharding lets us to route given request to a given partition.
- I can horizontally partition the database to my heart's content, maybe store a little different segments of the data on different shards, through a hash function of some sort and each shard has its own backup mechanism. So that I have not only `scalability` but also `resiliency` because if any one shard host goes down, there is another one waiting to take its place.

- If I need to send request actually joins data on shard one with data from shard three. Because of that, we typically want to design things such that we minimize joins or complex SQL operation and try to think about how to structure the data in such a way that it is a simple key-value lookup as much as possible.

- we migh decide to serve customers id between 1-1000 in replica set1, 1000-3000 in replica set 2 and so on. the traffic will be partitioned based on the key that we are storing data.
  Partitioning scheme should be stored somewhere that `mongos` process on the application server has to know how to distribute that traffic amongst the different replica sets and how to contact replica sets, who is the `primary` node for each set. that is what `config server` comes in. There are 3 of them in our app. if one goes down the other two can automatically elect a new primary config server

- mongos knows how to distribute the traffic amongst these different replica sets, which corresponds to shards
- downside of mongodb design, we have alot of servers to take care of. more expensive and more maintenance

## Cassandra

- Cassandra has a ring system wheer your data split up into all these different nodes. it is still sharded. any one of those nodes can act as the primary interface point for your application. So there is no single point of failure because any of those nodes can serve as your primary API point. your primary point of contact. there is a trade-off here. Because any node can be primary, that data needs to be replicated amongst all of these nodes in order to stay up to date. So all of other nodes needs to know what is where at all times and that means that as a trade-off for this architecture, we have what is called `eventual consistency`. because it takes time for that data to propagate throughout the ring, through every node in your system.

we are having more availability in that we do not have a single primary server here for the system at any one time but we are trading off consistency which means as data is written,

## NOSQL

Sharded databases are often called nosql.
Sharding is horizontal partitioning.

- advantage is consistency. whatever data you persisted it in it is what you can read it out later on.
  Availability: means that db should not crash and stay down.
  what should you shard your data on: in applicatons like tinder which uses location you could shard on location and then if person says find the all the users in city X.

- downside is it is tough to do joins accross different shards but in most cases it is possible it is just not efficient.
- another issue is resharding. what happens when you add more shards. How I figure out what data goes to the new host that I just added in and what data gets removed from the other hosts. to overcome this problem, we take a shard which has to much data in it and then dynamically break it into the pieces. so each pizza slice will be divided into smaller sizes. so there is going to be some sort of manager for every particular shard which is going to map the requests to the correct mini slice. Using this technique which is hiearchical sharding,w e can get rid of inflexibility
- Hotspots an exampe is celebrity problem. what ever shard is handling the current more hot actor in imdb will be hit hard more than a shard that handles an actor who was hot in 1950's. So we are going to have this hotspots on the server. So sometimes the way that you parition these shards has to take that traffic into account. sometimes it is not evenly distributing the data based on some hash function, you have to distribute it on the actual traffic going to each shard and monitor that over time. more modern systems can actually monitor from that routing server, how much traffic is being sent to each shard and reshard things in response to hotspots that cropping up.

- Most nosql databases actually do use SQL as their API. it is still best performant using key-value lookup.

- dynamodb amazon's cloud database.

## Denormalization:

data is broken up into two separate tables and that is done to minimize the use of space. instead of duplicating names and phone in reservation table for ach customer, we use customerID as primary key. we are joining tables. another advantage is if you want to update customer data, you can do it one place at customer table. that means i need to do more lookups.

Normalized data uses less storage space, more lookups, updates in one place.

DeNormalizing data means to joing tables together in one. advantage is it lets you get everyting in one query.

- downside is update is hard.
- increase use of spcae
