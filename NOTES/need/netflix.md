Netflix operates in two clouds. AWS and Open Connect. Both clouds must work togethere seamlessly to deliver endless hours of video. Anything that does not involve video streaming is handled by AWS. Video streaming is handled by Open connect. Open connect is owned by netflix. The Open Connect network shares some characteristics with other CDNs, but also has some important differences. Netflix clients are: consoles, smart tv, almost everything

## ELB

It uses Amazon's elastic load balancer. Load is balanced across zone first and then load is balanced accross the instances: `Two Tiered Balancing Scheme`. First part consist of basic dns-based `round-robin` load balancing. round robin is the most widely deployed load balancing algorithm. Using this method, client requests are routed to available servers on a cyclical basis. Round robin server load balancing works best when servers have roughly identical computing capabilities and storage capacity. when request hits the LB, request will balance across Z1,Z2,Z3 zones using `round-robin`. Zone is kind of logical grouping of servers there could be 3 different zones in US. The second tiers is the array of load balancer instances which does round-robbin load balancing on the instances to distribute the requests on accross these instances.

## Videos

Creating video requires alot of preprocessing, finding errors, converting the video into different resolution, different format. this process is called `transacoding`. each platform needs different video resolution. original videos are very large, 50 gb

Netflix also creates file optimized for different speed of internet. `adaptive bitrate streaming`. Netflix has to create multiple copies of the same movie in different resolutions. Netflix creates multiple replicas (approx 1100-1200) for the same movie with different resolutions. These replicas require a lot of transcoding and preprocessing. Netflix breaks the original video into different smaller chunks and using parallel workers in AWS it converts these chunks into different formats (like mp4, 3gp, etc) across different resolutions (like 4k, 1080p, and more). Those chunks will be placed into a queue, and these chunks will be picked up by different workers, Amazon EC2 workers. those workers will convert those chunks into different formats with different resolutions. Now we need to push those to the each Open Connect server.

authentication and list of videos are handled by AWS. once you hit the play button, application will figure out the best open connect server and Open connect server will start streaming the video to the client. Client also smart enought to check the best available OC server around to get the best video quality. Recommendations are done by AWS machine learnign algorithm.

## ZUUL server side LB

It is a gateway service (Netflix built it) that provides dynamic routing, monitoring, resiliency and security. Request to netflix (uses proxy) go through: Inbound filter, Endpoint Filter, Outbound filter.

Netflix will proxy the request to `Inbound Filter`, can be used for authentication, routing or decorating the reques.

`Endpoint filter` can be used to return the static response or forward the request to the backend services. Once `endpoint filter` gets response from the services, it forwards the response to the outbound filter.

`Outbound filter` can be used for gzipping the response, to calculate the metrics, add or remove the headers from the response.

Advantages of `Zulu`

1- You can shard the traffic from endpoint filter to send them to the services.
2- Load testing: Let's say you have a new kind of server which is deployed in certain setup of machine. that way you can redirect the part of the traffic from `endpoint filter` to this server.
3- Test new services:
4- filter bad request: you can have custom rules set in endpoint filter. for example user-agent of a specific kind.

## Hystrix

It is latency and fault tolerant library design. It isolate the points of access to remote system services and third-party libraries. in microservice, one endpoiunt can talk to many services. Let's say our `endpoint` is on one machine and needs to talk to any service that on a different machine. If one of the services is slow, whole endpoit might face latency.
Hystrix stops cascading failures

https://riteeksrivastava.medium.com/hystrix-what-is-it-and-why-is-it-used-f84614c8df5e

1- if response time is higher than preset time, hystrix can stop the next stops. if microservice A takes more then 1 second, call to this microservice will be cancelled or default response will be given back.

2- if thread pool for a microservice is full, it will not even accept next request, it will reject the call.

3- if error rate is higher, it can also stop accepting requests.

4- it collects the metrics

## Microservices

sometimes they use http or rpc calls between services. If you have too many microservices, how do u make this system more reliable.

- `Hystrix` monitoring service helps here. Or separate the critical endpoints to reduce dependency of the srevices. critical dependency means if system has some issues, which services should be still working. at least search should work, users should navigate to their favourite videos and play those videos which are cached. user should be doing way basic things.
- Make all your endpoints stateless: If one server is down to send request to microservices, we should be able to use another server. this is possiblle if you have a stateless endpoints.
- some endpoints can be cached some cannot. Netflix has their custom caching layer, `EV Cache` based on memcache T. they have deployed alot of clusters on alot of EC2 instances in which there are so many nodes of memcache. they even have their cache client. when client gets a write request, it writes it to available nodes in that particular cluster. Read will always happend with the nearest cluster. with caching throughput will high, latency short, reduce the cost of deploying more api or endpoint servers.

SSD sits between ram and harddisk and netflix uses those instead of rams.

## DAtabase

https://www.datastax.com/blog/exploring-common-apache-cassandra-use-cases

it uses MYSQL rmdbs and Cassandra nosql. billing information, transaction info, user info are saved in mysql as it needs acid compliance.

- Netflix has master-master set up for Mysql which is deployed on amazon ec2. when data is written to a master, it replicated to another master node and then only acknowledge will be sent to query. each master node has read replicas which handles the scalability and high availability. Read replicas available locally accross data center.

- Cassandra is open source, distributes,nosql, schemaless which can handle large amount of data. user hisotires for search, favourites etc made cassandra to reach full capacity. so netflix redesgined cassandra based on two goals:

  1- smaller storage footprint

  2- consistent read and write performance: Write:Read = 9:1

- to optimize the data storage on cassandra, when too much data is accumulated, they run some scheduled job to segregate the data into two different sections: `Live Viewing History` (recent user data) and `Compressed Viewing History`(older). this scheduled job compresses the old data and put it into the separate Cassandra nodes as compressed viewing data.

## KAFKA & APACHE CHUKWA

Netflix produces 500 bilions events= 1.2 perabytes including "Video Viewing activity", "UI" activity, "Eror logs", "Performance Events", "TroubleShooting events". Apache Chukwa is open source "data collection" system for collecting logs or events from distributed system. It is built on top of HDFS and MapReduce framework. It has Hadoop's scalability and robustness.

All the logs from diferent distributed system will be sent to Chukwa. you can either do monitoring or analyszing. Chukwai forwards the events to AMZ EMR and Kafka. this main Kafka moves the data into other secondary data. those events eventually goes into ELastiksearch

## ElasticSearch

https://aws.amazon.com/what-is/elasticsearch/#:~:text=Elasticsearch%20is%20a%20distributed%20search,and%20operational%20intelligence%20use%20cases.

Netflix runs about 150 clusters and 3500 instances. it is good for customer support. If user cannot play a video, user reaches to customer support and customer supports look at the user and checks all the events for the user.

Elasticsearch is a distributed search and analytics engine built on Apache Lucene. Since its release in 2010, Elasticsearch has quickly become the most popular search engine and is commonly used for log analytics, full-text search, security intelligence, business analytics, and operational intelligence use cases.

## Apache Spark

Spark is used for content recommendation and personalization. machine learnig models run on spark clusters.

## Movie Recommendation

- Colaborative Filtering
  If two clients have similar rating history, they might behave similarly in the future.

- Content Based Filtering:
  Based on similar movies a user has liked before.

## Open Connect Appliance

Open coonnect is provided free of charge to qualified partners which are ISPS. OC is placed inside the ISP, all the video transaction or packet flows only inside the ISP to the customer. That way bandwith will never cross the ISP to the internet. That means ISP wont need to communicate with internet.
