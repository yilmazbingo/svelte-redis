- if there are multiple instances of a server, client can reach any of those instances. this is posible if clients can remember the IP addresses of all these machines. if we have multiple IP addresses where client can reach, it is not practical client remmeber all those IP addresses because we mgiht add more and more instances.

Reverse proxy is like a proxy but while proxy sets near the client side `reverse proxy` is set near the server-side. So any request goes to the server actually goes to throgh reverse proxy. it can also act as a load balancer. now client only has to remember the IP of reverse proxy. if we have an internal client it can remember the ip address, but if we have excternal client like a browser, it can remmeber the `dns`.

## scalability principle

there are two principles
1- Decentralization
One componennt is not responsible for all the different kind of work. this is true in monolith applications. monolith is independece of scalability except vertical scalibility.
for scalability we want more workers
more specialize workers-services

2- Independence
decentralization gives us alot of workers but the benefit of lots of workers if these workers can work independently. if those workers require a coordinator for coordinating some work. that coordination may be required because we might have some shared data that all these workers are modiyfing. now that coordinator becomes bottleneck. so if we increase the load on the workers, the load on the coordinator also increases and at some point the coordinator will not be able to take up the load. so the system will fail because we are not able to scale up the coordinator. If somehow we can make our workers work independently or if we can minimize the requirement for coordination, then we can increase the amount of independence between workers.

- Scalability architecture starts with modularity

**REPLICATION** When the load on our system increases, one machine is no longer is able to handle the load. we horizontally scale and create more instances.

there are two kinds of replication: `stateless` and `statefull`. in stateless only code is replicated. in statefull data and code replicated. in database case, any write happens in one instance happens in other instance.

## Stateful Replication

when first user sends a request, there wont be anything in the memory of our web application which is an instance. we get the user profile from db. before sending the response we save the data in the memory of let's say Instance3. But next request can go to any instance. so this is achieved through `sticky` session. when the request first comes to Instance3, that time it will create a session which will have id. when the response sent to the client, client is supplied by a cookie. so next time this client makes a request this cookie will be attached to the request, and load balancer will look at the cookie and load balancer will know that that request has to be forwarded to Instance3. there are some limitations.

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

we can create `Read Replica` for higher read scalability. we can also create `backup` which is used for high availbality
There are two replcations:
1- Master-Slave (Primary-Secondary)
Client can send "read and write" to Primary but can send only "read" to secondary. The sync between Primary and seondary is done by `Uni-directional replication` meaning that any changes has done to master db, they are propageted to seocndary in due course of time. it can be done async or sync. In sync transaction sent to seoncdary and if secondary confirms then transaction is committed.

- the benefit of this config is high-read scalability and high-read availability. we could have many more replicas. if our read load is high, client can go to any read replica, that way they can reduce the load from the master and master be used for writes. this is high scalalable. if one of read replicas goes down others can serve so this is high availability. even if master goes down, read requests can still be served.

**async Replication**
When a client does a transaction, that transaction first completed on master database and the acknowledgement is sent back to the client. Once the transction is done, then the changes are propagated to the secondary database. Because transactions only involve in master database, they are faster compared to the transcations in case of sync replication because in sync, for a transaction to be successful, it has to be done on both database.first master then seocndary then only acknowledgement will be returned to the client. in async writes have lower latency

In case of async replication there is a lag between these two databases. the data is on secondary may not be the most recent data. so data is not consistent. it is `eventual consistent`. in case of sync replication, data is always consistent. we declare the transaciton is done only when the transaction is completed on both sides.

if mmaster db dies and changes are not propagated to the read dbs, secondary database will be promoted as the primary but those recent changes might have lost forever. if we use this configuration for backup, in case a master goes down, it may result in data loss.

In case of sync replication there wont be data loss but there will be low availability. if read db goes down in sync replication, we are not going to complete our write transaction on master database because we declare our transactions to be completed in sync replication only when they are completed on secondary db.

- In sync replication it does not matter which database goes down, our write will become unavailable, while in case of async replication, write will become unavailable only if master goes down.

We can use async replication in the cases where we need high read performance, low latency reads and we also need low latency writes
in sync replication we would use to create a backup. we will still have multiple read replicas but one replica in case if our master goes down. this will bring down latency but it will increase the availabilit of our writes.

2- Master-Master (No-Master/Peer-to_peer)

it is not popular. there is no master. client can both read and write on any of instances. the sync between is `bi-directional replication`. any change is done one db is propagated to other one. it is usually async replication. we avoid this beacuse there is a possibility of write conflict. if you make a change on one db1 and db2 about same time and if we are modifying the same record, when we reconcile the data between two dbs, that will result in a write conflict.

In master-slave config, there is only one source of truth because we write ONLY ON MASTER. there will no write conflic in master-slave. but it provide high availability.

It has use case wheere we want to independently write on two databases the reason can be that they are sitting in two different regions. Let's say you want to have a gloabl db where users are allowed to write on any continent
