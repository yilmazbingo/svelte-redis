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

- Sharding can be in two ways. `vertical sharding` which menas store each column in different partition. `horizontal sharding` which means partition the db by the rows. Horizontal partitionig is actually is `SHARDING`. queriying will be faster.

Sharding involves breaking up one’s data into two or more smaller chunks, called logical shards. The logical shards are then distributed across separate database nodes, referred to as physical shards, which can hold multiple logical shards. Despite this, the data held within all the shards collectively represent an entire logical dataset.

Tinder can partition db based on cities so that they could deploy the dbs on different geogroaphical locations.

- there is algorithmic sharding and dynamic sharding.

## Drawbacks of Sharding

The first difficulty that people encounter with sharding is the sheer complexity of properly implementing a sharded database architecture. If done incorrectly, there’s a significant risk that the sharding process can lead to lost data or corrupted tables. Even when done correctly, though, sharding is likely to have a major impact on your team’s workflows. Rather than accessing and managing one’s data from a single entry point, users must manage data across multiple shard locations, which could potentially be disruptive to some teams.

One problem that users sometimes encounter after having sharded a database is that the shards eventually become unbalanced. By way of example, let’s say you have a database with two separate shards, one for customers whose last names begin with letters A through M and another for those whose names begin with the letters N through Z. However, your application serves an inordinate amount of people whose last names start with the letter G. Accordingly, the A-M shard gradually accrues more data than the N-Z one, causing the application to slow down and stall out for a significant portion of your users. The A-M shard has become what is known as a database hotspot. In this case, any benefits of sharding the database are canceled out by the slowdowns and crashes. The database would likely need to be repaired and resharded to allow for a more even data distribution.

Another major drawback is that once a database has been sharded, it can be very difficult to return it to its unsharded architecture. Any backups of the database made before it was sharded won’t include data written since the partitioning. Consequently, rebuilding the original unsharded architecture would require merging the new partitioned data with the old backups or, alternatively, transforming the partitioned DB back into a single DB, both of which would be costly and time consuming endeavors.

A final disadvantage to consider is that sharding isn’t natively supported by every database engine. For instance, PostgreSQL does not include automatic sharding as a feature, although it is possible to manually shard a PostgreSQL database. There are a number of Postgres forks that do include automatic sharding, but these often trail behind the latest PostgreSQL release and lack certain other features. Some specialized database technologies — like MySQL Cluster or certain database-as-a-service products like MongoDB Atlas — do include auto-sharding as a feature, but vanilla versions of these database management systems do not. Because of this, sharding often requires a “roll your own” approach. This means that documentation for sharding or tips for troubleshooting problems are often difficult to find.

## Key Based sharding (Algorithmic Sharding)

Shard key is not primary key. Primary key can be a shard key but shard key cannot be a primary key.

Key based sharding also known as hash-based sharding, involves a value taken from newly written data — such as customer ID number, a client application IP address, Zip Code etc — and plugging it into hash function to determine which shards data should go to. Hash value is the shard ID used to determine which shard the incoming data will be stored on. To ensure that entries are placed in the correct shards and in a consistent manner, the values entered into the hash function should all come from the same column. This column is known as a shard key. A shard key should be static, meaning it shouldn’t contain values that might change over time.

you can choose combinations of columns as sharding key.

solution is consistent hashing???

the most important advantage is your data is evenly distributed.

## Range Based Sharding

You might need to partition the data rows based on months or years. If you query "Give me all the login details for January" then shard for january month will be requested.

Or in an ecommerce website, you can shard data based on price range.

The main benefit of range based sharding is that it’s relatively simple to implement. Every shard holds a different set of data but they all have an identical schema as one another, as well as the original database. The application code reads which range the data falls into and writes it to the corresponding shard.

Range sharding works best if there are a large number of possible values that are fairly evenly distributed across the entire range. This design works poorly if most of the key values map to the same shard. Unfortunately, this architecture is prone to poor distribution of rows among the shards. A good design can still lead to an unbalanced distribution. For example, older accounts are more likely to have been deleted over the years, leaving the corresponding shard relatively empty. This leads to inefficiencies in the database. Choosing fairly large ranges can reduce, but not eliminate, this possibility.

**Advantages**

- You can have database schema for all your logical and phsical shard.
- Since there is no hashing function you can add more machine. you wont need to move around the data.

diasadvantage is inbaalanced shards. maybe price range more often in 20-40 dollars range. this range is called `hotspot`

range based sharding is useful if your queriying alot with range based.

## Directory Based Sharding

this is a type of dynamic sharding. we might have a config which maps which country goes to which shard. `countryA -> Shard1`. You can add more countries-shard in the future without touching the previous shards. Also you can easily remove the previous shards. That is why this is dynamic, we can dynamically remove or add shards.

Like key based sharding, it can lead to hotspot.

disadvantage is reading config for lookup increases the latency. also if the server where lookup table is stored is crashed entire application crashes. Single point of failure.
