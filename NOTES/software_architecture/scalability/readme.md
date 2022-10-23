- if there are multiple instances of a server, client can reach any of those instances. this is posible if clients can remember the IP addresses of all these machines. if we have multiple IP addresses where client can reach, it is not practical client remmeber all those IP addresses because we mgiht add more and more instances.

Reverse proxy is like a proxy but while proxy sets near the client side `reverse proxy` is set near the server-side. So any request goes to the server actually goes to throgh reverse proxy. it can also act as a load balancer. now client only has to remember the IP of reverse proxy. if we have an internal client it can remember the ip address, but if we have excternal client like a browser, it can remmeber the `dns`.

As its name implies, a reverse proxy does the exact opposite of what a forward proxy does. While a forward proxy proxies on behalf of clients (or requesting hosts), a reverse proxy proxies on behalf of servers.

## scalability principle

there are two principles
1- Decentralization
One componennt is not responsible for all the different kind of work. this is true in monolith applications. monolith is independece of scalability except vertical scalibility.
for scalability we want more workers more specialize workers-services

2- Independence
decentralization gives us alot of workers but the benefit of lots of workers if these workers can work independently. if those workers require a coordinator for coordinating some work. that coordination may be required because we might have some shared data that all these workers are modiyfing. now that coordinator becomes bottleneck. so if we increase the load on the workers, the load on the coordinator also increases and at some point the coordinator will not be able to take up the load. so the system will fail because we are not able to scale up the coordinator. If somehow we can make our workers work independently or if we can minimize the requirement for coordination, then we can increase the amount of independence between workers.

- Scalability architecture starts with modularity

**REPLICATION** When the load on our system increases, one machine is no longer is able to handle the load. we horizontally scale and create more instances.

there are two kinds of replication: `stateless` and `statefull`. in stateless only code is replicated. in statefull data and code replicated. in database case, any write happens in one instance happens in other instance.

## Stateful Replication

when first user sends a request, there wont be anything in the memory of our web application instance. we get the user profile from db. before sending the response we save the data in the memory of let's say Instance3. But next request can go to any instance. so this is achieved through `sticky` session. when the request first comes to Instance3, that time it will create a session which will have id. when the response sent to the client, client is supplied by a cookie. so next time this client makes a request this cookie will be attached to the request, and load balancer will look at the cookie and will know that that request has to be forwarded to Instance3. there are some limitations.

https://stackoverflow.com/questions/10494431/sticky-and-non-sticky-sessions/73515749#73515749

1- Scalablity
each session occupies memory. so if more users connect and we create session for each, we might consume all the memoery in the instance. maybe cpu capacity can handle 2000 connections, if each session takes up 1mb and we have 500mb space we can serve only 500 connections. now we need 4 extra machines to do the same thing. so this approach will require us to deploy many more machines.
2- Reliability
what is Instance3 goes down. load balancer will route the request to other instances but they do not have cache. All the uses stored in Instance3 will have high latency. another thing if the user makes some updates but updates are not written into the db and then server is lost.

One solution is each session gets clustered means they are stored in all other instances. But prefer method is the stateless replication.

## Stateless Replication:

we do not cache anything on application. we wont get memory issue, we will have higher scalability but high latency for getting data from db. we can overcome this by using server-side caching (memcached/redis) instead of caching data on application instance memory (i think server memory).

- we could also store the session on user-side instead of in shared cache, this will reduce the latency. cookies cannot get alot of data. cookie is good for small amount of data.
- we can also replicate services stateless. whewn we replicate any component we are adding extra complexity, in terms of shared resources.

## Database Replication:

Replication reduces latency. for example for each continient we can serve from a replica that is hosted on that continent.

we can create `Read Replica` for higher read scalability. we can also create `backup` which is used for high availbality
There are two replcations:

1- Master-Slave (Primary-Secondary)

Client can send "read and write" to Primary but can send only "read" to secondary. The sync between Primary and seondary is done by `Uni-directional replication` meaning that any changes has done to master db, they are propageted to seocndary in due course of time (After an appropriate interval, in a reasonable length of time). it can be done async or sync. In sync, transaction is sent to secondary and if secondary confirms then transaction is committed. The benefit of this config is `high-read scalability` and `high-read availability`.

we could have many more replicas. if our read load is high, client can go to any read replica, that way they can reduce the load from the master and master be used for writes. this is high scalalable. if one of read replicas goes down others can serve so this is high availability. even if master goes down, read requests can still be served.

**Async Replication**
When a client does a transaction, that transaction first completed on master database and the acknowledgement is sent back to the client. Once the transction is done, then the changes are propagated to the secondary database. Because transactions only involve in master database, they are faster compared to the transcations in case of sync replication because in sync, for a transaction to be successful, it has to be done on both database.first master then seocndary then only acknowledgement will be returned to the client. in async writes have lower latency

In case of async replication there is a lag between these two databases. the data is on secondary may not be the most recent data. so data is not consistent. it is `eventual consistent`. in case of sync replication, data is always consistent. we declare the transaciton is done only when the transaction is completed on both sides.

In case async transaction, if mmaster db dies and changes are not propagated to the read dbs, secondary database will be promoted as the primary but those recent changes might have lost forever. if we use this configuration for backup, in case a master goes down, it may result in data loss.

In case of sync replication there wont be data loss but there will be low availability. if read db goes down in sync replication, we are not going to complete our write transaction on master database because we declare our transactions to be completed in sync replication only when they are completed on secondary db.

- In sync replication it does not matter which database goes down, our write will become unavailable, while in case of async replication, write will become unavailable only if master goes down.

We can use async replication in the cases where we need high read performance, low latency reads and we also need low latency writes
in sync replication we would use to create a backup. we will still have multiple read replicas but one replica in case if our master goes down. this will bring down latency but it will increase the availabilit of our writes.

2- Master-Master (No-Master/Peer-to_peer)

it is not popular. there is no master. client can both read and write on any of instances. the sync between is `bi-directional replication`. any change is done one db is propagated to other one. it is usually async replication. we avoid this beacuse there is a possibility of `write conflict`. if you make a change on one db1 and db2 about same time and if we are modifying the same record, when we reconcile the data between two dbs, that will result in a write conflict.

Another isssue is `split brain` problem. If network connection fails, they both think they are master. In the case if X user has 120 balance and sends 100 deduct to db1 and then db2 he will get the withdraws.
In master-slave config, there is only one source of truth because we write ONLY ON MASTER. there will no write conflic in master-slave. but it provide high availability.

It has use case wheere we want to independently write on two databases the reason can be that they are sitting in two different regions. Let's say you want to have a gloabl db where users are allowed to write on any continent

## Services

we have replicated service layer whichs has multiple modules: User, Catalog, Order,Inventory,Notification. BUt what if inventory module gets extra load. we have to scale up our application only for inventory. if we add multiple service instances, we would scaling all services which will be inefficient. But now our system is more complex because web server was talking to 1 business service now there are multiple independent services. for this we can another service called `Restful Aggregaor/Gateway` service. Restful and Soap are interoperable protocols.the term `interoperability` is used to describe the capability of different programs to exchange data via a common set of exchange formats, to read and write the same file formats, and to use the same protocols.

Gateway service is interoperable but we do not need interoperability for internal services. so we use a faster communication protocol like (binary protocol) `grpc or thrift` for internal services.

When you are writing a service like a Gateway service that can be exposed to external clients, then we have to take care of supporting a wide variety of clients. We may have to support web-clients, mobile apps and other external services as clients. We do not know what technology they are based on. Here interoperability with different kinds of clients is paramount.

For services that have internal clients only, we have some degree of control over the clients. Here the service interface needs to be interoperable only with the clients that we are writing ourselves and we have a choice. Here you may give more importance to the performance of communication rather than how many different kinds of clients it can support.

We often use message queues to integrate client and server when the interfaces are different. we also use message queue to reliably deliver messages from a client to server. So reliable delivery and integration of different interfaces. one more use case is related to scalability. we can use `message queue` to offload some of the `write load` on databases. In our system `message queue` will act like a buffer. Before, when we got a requet to Order service, we were validating, processing and then persisting into the database. while we were processing, we would have to communicate with inventory service to see if we have enough items. But with message queues, after we validate the order, we put it into the message queue which is very fast operation because message queues are extremely fast at accepting messages. that is what they designed for. they are not complex like dbs. once the request is in order queue, we send our response back to the user that we are processing. order in message queue is processed by the OrderProcessing server which will pull the order request from messaging queue (we could also push from order queue to order processing server). We can use async processing whenever write operation is the main operation and we do not have to show any information to our user. How message queue helps scalability?

Let's say we get 50000 requests to order service that means same load to db so we have to scale the db at the same time. Currently we have not scaled db yet and we dont have message queue. So other services might hit the db as well. we have to change the same amount of load hits the db from order service. the way we change is the `async processing` which takes advantage of the fact that the load on our system does not remain constant throughout the day or week. If we can find a way to defer processing of these requests, which are coming during the peak, we can store those requests and later on when the load on our system is lesser, if we can at that time process theses requests, we would save those requests to be rejected. Because if we get requests above the capacity we would reject them. so we would store requests in message queue and then process them in order processing server. messaging queues can scale much higher than dbs

https://softwareengineering.stackexchange.com/questions/425190/how-can-message-queues-improve-scalability/440762#440762

## VErtical Partitioning

in order to scale our database, we will have to look into what data our db is storing. in our app, storing for inventory, order,catalog and user service. if we can separate this data in our db, we can have a clear cut separation between them and then we can host this data on different database. Baiscally we will have a separate db for each service. Before order service if needed data from catalog Db, it could just ask the same db but since we separated now it has to ask to Catalog service. there is separation of responsibilities in terms of data. our dbs are independent now.

we have sacrified `acid transaction`. Let's say our Order service was doing transactions over multiple tables and now those tables belongs to different dbs. thus we no longer be able to do those acid transactions. we have to deal with eventual consistency.

So far we have created microservices architecuture with vertical scaling. INventory Service->Inverntory db

## Database Partitioning

It is used for extreme scalability. Let say we have order database. we split data based on ids. 1-1000,1000-1000000,etc. this is called `Range Partitioning`. this depends on how many entries we have. It becomes complex when particular node goes down or we decide to decrease or increase the number of nodes. the issue we can no longer do acid transactions. if we want to modify 10 other entries, each lives in different nodes, we cannot do `acid transactions`. we will be able to acid transactions only if we are working on the records which reside in NOde1 and there has to be guarantee that they all reside in node1. Generally this partitioning is not popular in RDMBS because they are known for acid transactions. this partitioning is used in NOSQL dbs.

Second method is `Hash Partioning`. we will compute the `hashOfId % NumberOfNodes`. practically we do not apply modulo operator. we use `consistent hashing`. `Consistent` Hashing is a distributed hashing scheme that operates independently of the number of servers or objects in a distributed hash table. It powers many high-traffic dynamic websites and web applications but here we will lose acid transaction as well. Performance of query based id in hash paritioning is much much faster than id based querying in range partioning. Because once we hash the id we know which node we will go. we dont need to do any look up for deciding which range is our id.

            SELECT * FROM Order WHERE id=150

If we had this

            SELECT * FROM Order WHERE id>150 AND id<250
    In this case we would use range partitoning but this would have performance penalty because we might have to visit multiple nodes.

- there are 3 ways for "ROUTING"
  1- provide a client library for dbs. those libraries are cluster aware. they know how many nodes are there in the cluster and when we do the query they apply the hashing algorithm on which node our data resides.
  2- like mongodb, it will provide clients with a router component, so it will be one component hosted as a siftware application itself. any client can send requst to the router and it will determine which node to visit.
  3- Client can contact with any node, this is implemented in DynamoDB or CassandraDB where a client can contact any node and that node will take the responsibility of forwarding the request to the node where the data is actually located.

## Load Balancer

It is difficult to maintain the list of ip addresses. client is not best place because it is so frequently changing. Load balancer is set let's say in front of Catalog Service and it takes the responsibility of routing the requests to the right catalog Node and standards based on load or whatever strategy it can be. Now Gateway service does not need to know the all the ip's of catalog services.

We should be putting the load balancer of services inside the Gateway service instead of creating a load balancer for each service. Whenever Gateway service wants to make a call to any of the backend service, it will make use of embedded load balancer which is a code library. When there are lots of services running in lots of instances for each service, then it really becomes hard to track what services are available for. The `Discovery Service` is a very convenient way of knowing all the services instances. When Order1 and Order2 comes up, they will regiester into Discovery Service. this way Discovery Service will know what all instances are in the system. also, those services frequently update discovery service with their heartbeat. this way Discovery Service will know which are the healthy instances. Aggregor service then communicates with the Discovery Service to get the IP addresses of the microservices. Load balancer will call the available service instance based on the load balancing strategy.

- In Kubernetes you do NOT need `Discovery Service`
- External LB is wher client calls. Client needs dns for external LB ip address. Internal LB is between webservers and services. INternal LB might have config.

## HLB and SLB

Hardware Based Load Balancer can take immense amount of load. They can do load balancing both for L4=Transport Layer(UDP,TCP,SCTP) and L7
Software Load Balancer (nginx,apache,haproxy) do only for L7=Application Layer (HTTP,HTTPS,SMTP,IMAP,FTP,DNS,NNTP)

The reasons to use SLB is, HLB are extremely costly.

- L7 act as reverse Proxy. Content based Routing means it can look at urls, cookies etc.

## DNS as Load Balancer

Configure DNS records with multiple `A records`. An `A record` maps a domain name to the IP address (Version 4) of the computer hosting the domain. Pay attention! there can be multiple A records mean there could multiple ip addresses for the same domain name. This gives us an opportunity to do some kind of load balancing.

Let's say we have 3 different servers. If we call DNS and DNS gives us randomly or in some `round-robin fashion` one IP address. this is load balancing.
DNS can be also configured for health check. it can send signal and if it does not get a response means server is dead. We still do not use it as a LB cause LB is very active software or hardware. If LB detects that one instance is down it wont send traffic to that one. we cannot expect this from DNS.

## Global Server Load Balancing

we use dns only in this case. When we need to route to different regions, Asia-Pacific or North-America, since we have less regions it is ok to use dns as lb for those regions. this dns will route to LB of the regions. In this case possibility of one region goes down is very low because we created many instances for each region. And also data of region LB ara very static. Dns will look at the geographic location of the user and then return an IP address accordingly.
The question is how we will keep the data in sync with different regions:

## Global Data Replication:

Both regions must be active all the time. this setup is `Active-Active Setup`.
In each regions we designated one database as Master and replicas(read or write). We have done Master-Master replication. There could be write conflicts in two regions. We have to desgin our system in such a way that there should not be any write conflicts. If there is a write conflict, we have to use some functionality of our database to resolve those conflicts. That resolution can be automatic throgh business rules or it can be manual.

If one region goes down, we should not switch to other region in hurry tht is why DNS load balancing works perfectly fine. We should absolutely make sure that one service is down.

When we have async replication set up between two master servers, there is possibility of data loss. We cannot set up sync replication betweeen these two masters is the distance between two regions. It will take a really long time to sync up these two database for each transaction. Moreover, if the concnetivity between these two data centers gets broken and we wont be able to complete our transaction because we will need the presence of both masters to complete our transaction in case of sync replication. During the async data transfer, if one region goes down we will lose that data

## Auto Scaling

it is a framework which can automatically scale your application when it senses that your application is under load. In cloud you can use auto scaling frameworks.
It has `Monitoring Service` that checks the current load and health. If the sustem is under load, this will inform the `AutoScaler` which will launch new instances. This new instance will be registered with the load balancer. ALso, if the load goes down, it will bring down some of the instances.
Admmin will add configuration to AutoSCaler for example saying once the load hits 80 percent start a new instance.

## Microservices

Before mmicroservices we had service Oriented Architecture.
If we want any architecture scalable it should be decentralized and its components should be able to work independently. this not like Angular. each service may use different language. SYtems is connected with a Common interface schema and COmmon database schema. this makes those services tightly coupled. system has single database

Microservices have shared nothing architecture. services need data from different service has to communicate with the service and it will pull the data and send. Rest interface help in loose coupling because it does not mandate a common schema. it helps becuase it helps in sharing the data and it does not mandate a common schema. Incase of SOAP, XML/WSDL schemas are used

We start creating a microservice with vertical partioning. we decide which domain we need and then we create servers for those and after that we scale each of those horizontall.

- In microservices we do not use shared libraries this will create dependency. we can use utilities as common because they do not change. they are just simple functions.
- Microservices are not suitable for small applications.

- Issues: we have duplicate code.

## Transactions in Microservices:

doing transactions in distributed systems is the hardest part.
When our order comes to order service it first checks the inventory and then checks the Shipment service if the order can be delivered to the given address. Once order service gets confirmations from Inventory Service and Shipment Service and then the order service will confirm the order in order database.

One transaciton of booking is actually composed of three `local` different transactions. local means service does transaction with its own db.

There are 2 types of transactions:
1- Distributed ACID Transactions. Because `ACID` transactions do not ensure availability and scalability we use the second method
2- Compensating Transactions:

Distributed Acid Transactions are achieved by Two-Phase Commit protocol. in 2PC any transaction happens in two phases. let's say you have an ecommerce app and your order requested got an order request. Order service will act as the coordinator of this transaction. In the first phase it will ask the inventory service and shipment service if they are ready to do this transaction. these 2 services will take logs on their database and once those logs are taken, they are sure those tranasctions can be done, they will promise transaction to the order service. once order service receive the confirmations then it will ask database if transaction can be done and then it will commit the transaction. commiting is the second phase of the transaction. then it will issue request to all the participiant services to let them. then those services will do commit. and then response will be returned to the customer. the problme is taking logs take longer. since more services are involved and taking logs take time, meanwhile other request are blocked if they need to modify or access to data for which we have taken the logs. those transactions do not scale very well. those are useful in the cases where the scalabilit requiremnets are not very high. in micro services we have high scalability requirements.

https://stackoverflow.com/questions/4639740/how-acid-is-the-two-phase-commit-protocol/73549995#73549995

2- Compensating Transactions:
we use `SAGA` pattern. We have to write some special code to do compensating transactions.

When our order comes to order service it first checks the inventory and then checks the Shipment service if the order can be delivered to the given address. Once order service gets confirmations from Inventory Service and Shipment Service and then the order service will confirm the order in order database. One transaciton of booking is actually composed of three `local` different transactions. local means service does transaction with its own db. those local transactions are atomic.

Let say inventory service commited a change, responded to Order service and but shipment service failed so we cannot move forward with the transaction. Becase we made commitments in the inventory db, our system is in dirty state right now.
we start reversing the effects of the previous local transactions. for each create transactions we will have undo transaction.
Compensating transaction is basically a logical undo of commited transactions.

the extra challenge here is while we are undoing the effects of origianl transaction, the undo process may fail at any point. let say while we are undoing the inventory service and it is down. this inventory service when it recovers, it should know that it was somewhere midway or it was about to undo inventory changes that it has done.

TRansaction is not atomic because in our example, transaction of shipment failed so we are left with an inconsistent state of partially committed transactions. undoing is called compensated. in the end, all order is eventual consistent. these transactions are not completely isolated. the reason is when they were happening they were not atomic.

## Microservice Communication model

- Sync processing: if we need immediate response for better user experience. usually when we need to read small amount of data. sync communication is not very reliable. if request fails somewhere between during sync communication, usually will retry the request. but when there is high load on the system and requests are failing because of that high load, they might be timing out because of that high load then retrying request is not a good strategy. better strategy is async processing
- Async processing: write loads take time, if it does not involve providin immediate output to a user, inorder to make our system scalable, we should process the request async.

## Event Driven Transactions

we have a message queue. Order request comes to Order Orchestrator which routes the requwst to the "Create Order Event" in message queue. subscribers to this event will be notified in this case it is Order Service. it will do whatever has to be done and send acknowledgement to "Create Order Event". Now it needs to create an event in "Order Created EVent" but if instance goes down before sending this notification, it wont know which orders has been processed. SO we should have a `polling` system that pulls data from db and see which orders have been procesed but event has not been created. This way we can have a reliable system. Now Order Orchestor has to notify inventory first and then shipment services. so it will create "Reserver Inventory Event" and "Create Shipment Event". Once shipment published "Create Shipment Event", Order Orchestrator will know that order has been processed and will send the response back to its client asynchronously. this was the happy part so far

If transaction goes down, services will create "Failure Events" and it will be seen by the Order Orchestrator and it will start the compensation process for this transaction. So it will call "Undo Order Event" once order service makes changes then it will publish "Order Undone Event"

## NOSQL and Kafka

they offer extreme scability.
so far we have achieved eventual consistency. local transactions are acid.

- NOSQL: we can do only eventual consistent transactions. that is the limitation with NOSQL. it is not problem because we have a system that can hadnle eventual consistent transactions. BUt we have to achieve `acid` transaction for the local transactions. we can do that restructuring the schema.
  RDBMS can hanle multiple tables with a single transaction. wwe can combine two tables into one in the NOSQL schema. now we can do ACID on NOSQL by having an aggregate schema.

It extreme scalability becase now our db is horizontally distributed. the only thing we have not horizontally scaled so far is the message queue. Kafka provides horizonatl partitionin message queues.
