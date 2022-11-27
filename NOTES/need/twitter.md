1- follow others
2- create tweets
3- view newfeed

## Read

there are about 500 millions users but 200 m are active. if they read 100 tweets in a day, it is 20billion tweets. Each tweet has 140 char which 140 bytes but incliding username and other metada might reach to 1kb. some tweets might include images and videos which increases the size. Maybe 1mb.

20billion times 1 mb=20billion mbs= 20 pera bytes data read per day. since we are reading a lot of data, we dont need strong consistency. Eventual consistency will be enough.

## Write

if 50 million users create a tweet per day. We are writing less than we are reading7.

## Design

If we are doing read heavy we should be using NOSQL. we have very relational model when it comes to following. we can go with relational db. we can implement sharding with rbdms. we could just store tweet and user information in NoSQL, and have GraphDB which would be very easy to find that follower relationship because a graphDb is essentially like adjaceny list graph where every person is like a node in a graph.

Fraud detection

Graph databases are capable of sophisticated fraud prevention. With graph databases, you can use relationships to process financial and purchase transactions in near-real time. With fast graph queries, you are able to detect that, for example, a potential purchaser is using the same email address and credit card as included in a known fraud case. Graph databases can also help you easily detect relationship patterns such as multiple people associated with a personal email address, or multiple people sharing the same IP address but residing in different physical addresses.

    Recommendation engines

Graph databases are a good choice for recommendation applications. With graph databases, you can store in a graph relationships between information categories such as customer interests, friends, and purchase history. You can use a highly available graph database to make product recommendations to a user based on which products are purchased by others who follow the same sport and have similar purchase history. Or, you can identify people who have a friend in common but don’t yet know each other, and then make a friendship recommendation.

Since we have massive amount of read, we have to have a caching layer between.
when we need to read a tweet, we hit the TWEets RMDBS. we get the metadata and reference to media.
RMDBS is not good for storing media. We use Object Storage: Google Cloud Storage or Amazon S3. Since these assets are static in nature, it is better to distribute them over a CDN network. we keep the real assets in CDN but the links in Object Storage. So when user fetch tweets, application returns tweets metadata plus the media url to the user and then user client makes a following request to `CDN`. We probably use PULL-BASED CDN. we do not need to push every media to CDN immediately. CDN's are geograpically located closed to the user. because people in India wants to view tweets related to India.

createTweet(text,media,userId) createId is created on server side. header of request includes the authentication detail of the user.
getFeed() very basic read request.
follow(uid,usernameOfPerson)

- we have `follow` property which has followee and folloer. all the followers that a client follows will be grouped together
- we need to have a db for tweets. tweetId, timestamp, userIdOfCreator, content-media
  we are not going to store the media in this table but we would have reference to the media.

based on calculation and people about 50 gb data will be written per day. we are going to have so many reads hits the db. first option is to create `read-only` replica of databses. we will have about 500 writes per-second average but peak might be higher, maybe 10 times higher. So we need to scale our writes as well. we have to use `SHARDING`. If we had multiple read-only db but only one write db, we would have async write because it is ok if the user gets 5 seconds late stale data.

## SHARDING

SHARD KEY should be based on user id. so particular users will hit the particular db. Then when user needs to read the tweets of people that s/he follow, it will just make request to related db.

If we used tweetId as shard key, we actually do not know which shard contains the tweets of the people that they follow. so they have to query all the shard, that kinda defeats the purpose

when user create a tweet we will store the tweet based on the userId key and any media will be in object storage. if user needs to read tweets, we need to query all the shards, fetch the tweets and order them and then send it back to the user. we have a caching layer where the most popular tweets will be stored or LRU algorithm to store the tweets.

different people will have different tweets. we definitely cannot guarantee that all 20 tweets that our user wants to see are already going to be cached. what if 19 of them are already cached and then last one tweet we still ahve to go and read from db. while you are scrolling maybe all tweets are loaded but one tweet in the middle is taking exta seconds. that is the `latency` issue. sharding and caching helps.

we could create the news feed of the user async and we would do that for every single user in theory

we could have a message-queue or pub-sub system which will take every new tweet that is created. new tweet will not be just saved to the db but also will be sent to the pub/sub and this queue will feed into a cluster somehting like spark cluster but the point is these cluster workers in parallel process all the messages we are getting. these cluser workers will feed into new cache and this cache will be responsible for actually storing the user feed. so now when user loads their homepage and gets their list of 20 tweets, the application server will be hitting the feed cache. `Feed cache` will be in memory but might need a lot of memory. we could even shard these. if someone has a 100 followers, these workers have to update 100 feeds. what about someone has 100 million followers. updating 100 million feeds every single time someone makes a tweet is very very expensive. but not 100 millions of followes are loading their feeds every single day so do that update work as needed.

## Second

3 big features:

- Tweet,
- Timeline: There are 3 different timelines. Home timeline, user timeline, seatch timeline
- Trends

Always check the overall picture. twitter has 300M users. it get 600 tweets/secs writes, 600000 tweets/sec reads. twitter is a read heavy based. Eventual consistency is fine unlike banking application.

Important db tables are "user","tweet","follow table". User has tweets and follower so we have one to many relationship for user-tweet and user-follower. In redis we can have to lists. <userId>:[tweetID] and <userId>:[followerID]

### Generate timeline

- user timeline

Go to users db and get tweets. we save them in redis.

Get all the followers that user is following. Those queries are expensive for each follower get the latest tweets of each followees. merge them all and sort them by time. this strategy is not good. twitter is very fast.

### Fanout for feeds

it means move to different directions from a single point.
whenever we get a tweet, do alot of preprocessing and then distrubute the data into different users' home timeline. this way we can reduce the queries we have to make when there is a request to compute the home timeleine.

Let's say a user is followed by 3 different people and user has a cache timeline entry, UserTimeline, also all the followers will also have UserTimeline and HomeTimeline. Imagine user made a tweet, add the tweet into the db and then to his UserTimeline. then fanout that particular tweet to all the followers cache list. this way we DO NOT need to make any db query. each user and followers will just visit their cache with their userId

this model does not work always. Imagine one user has 30 million of followers. If we send new tweet all the foloowees cache this will take minutes. when celebrity tweets save the tweet in tweets table. then add the tweet into the user's timeline cache. when the followers of the celebrity, reaches its timeline, its cache is still maintained but celebrities' tweets was not pushed into this cache. In the follower's we have another cache, "CELEBRITIES CACHE`. when followee refreshes his timeline, app checks its celebrities cache and then goes check each celebrity's timeline's cache and see if there is tweet that recently made by the celebrity. if there is, get the tweet and add it to the response. Since all these operations are in-memory operations, this will be faster.

we dont need to update the user's timeline if they are not logged in. we save alot of memory in redis and alot of computation.

## Trends

based on "volume of tweets" and "time taken to generate tweets", twitter decides if it is trending of not. For example

1000 tweets in 5 min vs 10.000 tweets in a month. first one is trending.

Twitter uses stream processing tool like Apache Storm or Heron. Kafka streams also could be used. this happens in real time.

    Tweet ==> Filter ==> Parse

Filter operator works to filtering of tweets based on certain criteria. There are many operators in this system based on their load they will be horizontally scaled. In Kafka stream each operator are connected by a queue. That means each operator pulls the tweets from a queue.

Filter TAG; not every hashtag is trendable. they are not specific. for example, food, travel, lvoe. It also check for any violation.

Parse : it makes sure is any given hashtags are related to the content.

    After parse opreator, one copy of the tweet is pushed to the Geolocation pipeline and one copy is passed to the hashtag and rank pipeline.

Count Hashtag operator has different time windows. 1 minute window, 5 minutes window Then tweet is forwarded to the Rank operator. rank operator gives a rank to each hashtag.

Just figuring out the hashtag does not make sense. if the elecetion happens only in country A, this hashtag might not be related to new zealand. we have to also map the hashtag with the Geolocation after it passes Count and Rank operators. Geolocation operator will figure out which countries given tweet is related to. then there is Count operator which counts how many location is given hashtag is related to.

Then all the data is fed into the redis.

## SEARCH TIMELINE

Twitter uses `early bird` which inverts full text indexing operation. Everytime a tweet is created, that tweet will be broken into different tag words and hash tags. then all those words remapped or indexed to all the different tweets. twitter has big table or any `distributed table` in which each word has a reference to all the tweets which contain that particular word. If we search for "bank", twitter will look at this table and then find the related tweets.

Twitter does `scatter and gather`. you have different nodes which is scattered across different data centers. when you get a query, you send this query to all the nodes in different data centers. each data center looks for all the tweets which it knows for that particular tag. all data centers give back all the result. search system collates all the results and returns

ZApache-ookeeper is a coordination service for distribute components. twitter runs about 1000's of nodes in any cluster just for redis. redis holds alot of data so we have to hold a big cluster of redis. if we have big clusters, we have to coordinate these nodes. zoo keeper helps you to maintain the configuration for each and every node in the cluster
