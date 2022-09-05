- RELIABILITY, AVAILABILITY, FAULT TOLERANCE

System is reliable even in the presence of partial failures. an airplane is reliable because if one engine fails, it can still fly. it is measured as the probability of a system working correctly in a given time interval. Availability extends the reliability. Our system goes down when we do maintenance `successful Requests / totalRequsts`, `uptime/uptime+downtime`

- 100 percent availbality is very hard. high availbality is costly. we need to upgrade our application so our app will be down.

## Create Fault tolerant design

1- we provide reduncany
2- build a system such a way that it can detect faults that are happening in automated fashion
3- then recoever from detected faults by using the reduncany that has been provided
**Reduncancy** is about keeping redundant capacity (backup) within a system. Replication of critical components or functions of a system in order to increase its reliability. A secondary capacity is kept ready as a backup, over and above the primary capacity.

1- Active Reduncany (Hot SPare)
for a given component, we have two instances that are running simultaneously and we actually need only one of them. we cannot say wehich one is primary or secondary. both are primary. the load is distrubuted. if one of them goes down, the other one will take over. extremely quick and most ideal way of providing availbality. like engines in aeroplanes.

2- Passive Reduncancy (Warm Spare):
we hve primary and standby. if primary goes down then the load is diverted to the secondary capacity. quick way of diverting the load. it wont be as quick as active reduncany. it is like substitite players in soccer game

3- Cold Reduncany Spare(Backup):

It is not high availbality option. primary capacity serves the entire load. we do not even provision the secondary capacity. Only in the primary instance or primary capacity goes down, we make arrangements to provision the secondary capacity. there is significant time delay. it is low cost option. backup tyres in cars.

## reduncany for stateless components

## Reduncany for Stateful COmponents:

dbs, message queues, cache, static content in static server are stateful components. we need to keep the data in sync.
Reduncany service is provided by the server hosts.

- FOr databases we are going to create back up replica not read replica. replication can be done sync or async. benefit of sync is both dbs will be always in same state. It is done if changed made to both dbs otherwise it is not done. transactions are `atomic`. with async replication, transactions are not atomic but they are faster.
  with sync replication we have `active-active` reduncancy.
  in async replication, in case of primary failure, secondary replica will have to do catch up with the logs of last few transactions. once it does the catch up then only secondary can be promoted as primary. So switch over wont be quick because there is a catch up that secondary needs to do with the state of primary.
  If entire machine that primary instance run goes down, in that case, for secondary database, there is no way to catch up with the primary, then we have to promote the secondary without catch up so we lose some data. in async we have `passive reduncany`
- the mechanism for the `message queues` is same.
- Content Server. since data is immutable we are not worried about write conflicts.
- Cache: cache is not the primary source of data. we might not need replication. In case cache server goes down we hit the db and that will bring down the performance. Memcache does not provide reduncany but redis provides

## Redundancy for Infrastructual Components

- Secondary Load baalancers
- if internet goes down, system goes down. Generally there are multiple internet connections in datacentres. What if entire datacentre goes down: earthquake, floads. So we have to have datacenter reduncancy. We can either provice `Zonal Redundancy` or `Regional Reduncancy`. the difference is distance between them.

If they are separated by less than 10 miles, they are in the same city, it is `zonal redundancy`. It is Fault Isolation, one fire wont affect other. they need to communicate because we may like to have db on which we are going to write through our transactions located in one datacenter. Since we dont setup master-master (because it has write conflicts), if Master of inventory SErvice goes down, this datacenter has to connect with the other datacenter for wiriting to the master db of the Inventory Service. Communication is sync because they are close. If there is an earthquake in the city this structure wont help us. Active-Active setup, High Availability

`Regional Reduncancy` in another city or country. Fault tolerance against disaster, war,earthquake. We will setup async replicaton, Active-Passive setup

## FAULT DETECTION AUTOMATICALLY

- Fault Models:
  Response Failure
  Timeout Failure
  Incorrect Response Failure= expecting 200 but got 401
  Crash Failure= server halts but is working until it halts
  Arbitrary Response Failure= server gets hacked and send you malicious response

## Health Checks

1- External Monitoring Service
it pings our server instances
In the cloud environment health-check service is available out of the box. This service sends `HTTP` or `TCP` request. Once service gets a response it either generates alerts or events. let's say health check service monitors a CPU and if it exceeds 90% load it generates event so we can add more instances. or vice versa. We have to configure health-check service with expecting "response code", "response Time" and "number of retries"
If we create our health-check service, we also have to monitor if this service is running or not. One way is we have another health-check service to check our health-check service. this is a manual process and not reliable. The solution is setting up a cluster of health-check service instances which can self monitor each other within a cluster

2- Internal Cluster Monitoring
Service nodes can form a cluster and they self monitor each other. used in dbs (Oracle uses), content servers and load balancers. Each nodes exchanges heart-beat with other nodes in the cluster. a `heartbeat` is a periodic signal generated by hardware or software to indicate normal operation or to synchronize other parts of a computer.

If we had two LB instances:Primary and Secondary. If secondary detects that primary is down, it will initiate the protocol to transfer that virtual IP address to the secondary instance.
If lb cluster had more than 2, once they detect the one of them is down, they will serve instead of that lb, too. so our lb's are high availaility service.
the only downside is it is complicated to achieve. that is why we use only for lb and paritioned dbs.

## Stateless Recovery

There is nothing to be recovered here. All we have to do is detecting the failure and restart or start a new instance.
**HOT STANDBY**
If we need 2 instances we run 3 instances, so if one goes down we will have enough instances to serve.
**WARM STANDBY**
Instance 3 will not be running. If instance2 fails, we kill that instance, this will notify the Auto Scaler and this will start the instance3

## Stateful Failover

1- Virtual IP
we have primary-secondary heartbeat setup. they both their own ip address also there is `Floating Ip` which can be assigned to any of those machines. initally it si assigned to primary
A `floating IP` is usually a public, routable IP address that is not automatically assigned to an entity. Instead, a project owner assigns them to one or more entities temporarily. The respective entity has an automatically assigned, static IP for communication between instances in a private, non-routable network area, as well as via a manually assigned floating IP. This makes the entity’s services outside a cloud or network recognizable and therefore achievable.
When client makes request to DNS, DNS will give the `floating ip address` of the primary instance. If primary goes down, secondary will notice by the heartbeat so it will initiate protocols to transfer this floating ip from primary to standby.

2- Registry/Router/Dns
Client contacts with the `Registry or DNS or Router` Service and it returns the ip of primary instacne so client calls the primary instance. primary and secondary instances constantly send heart-beat to registry server. If primary goes down, registry will direct the user to the secondary.
If DNS is used, client should not cache the DNS IP address. They should strictly rely on the Time-to-live (TTL) values provided by the dns server. Because if primary is down and changed to secodary, client would send request to the primary.

https://www.n-able.com/blog/dns-cache-overview

## DataBase REcovery

All this setups master-slave setup. master-master results in write conflict
1- Hot Standby
It is used in case of we do not want any downtime related recovery process. there will downtime but we want that downtime as low as possible. and we do not want any data loss because of recovery process. that is why we establish sync replication between primary-secondary. client communicates with the Primary and that communication is communicated to the secondary and only when it is written on secondary instances log file, and that acknowledgement is given back to the primary then only primary instance considers that transaction is done.
Primary-Secondary need to closely located. Only then we will be able to do synchronous updates without much lag.
writes are slow because we have to write on Primary and then to the secondary.
2- Warm Standby
the only difference is we setup async replication between primary and secondary. any changes that are done to the primary, they are put in a log file and these changes after small periods of time in small batches, they are communicated to the secondary instance.
there is always catch up between primary-secondary.
If primary instance is down, that means machine is not available but log file will be available. In the worst case, entire machine where instance and log are hosted can go down. so secondary would be missing those last changes in log file.

- We use this in case of disaster recovery. we need a replica at a location which is a far away. In those locations the only possible replications is async.
  this gives us high performance becase client gets updated only when primary wrote the commitment.
  3- Cold Database Recovery
  this is cost effective because we do not have active running instances. The drawback of this method is that there is a significant amount of downtime involved because recovery involves importing database from backups and then starting those databases. A cold backup, also called an offline backup, is a database backup during which the database is offline and not accessible to update. we take the older backups and build database from there.
  The most crucial structure for recovery operations is the `redo log`, which consists of two or more preallocated files that store all changes made to the database as they occur. those log files updated as change happens in our database
  in case of faulure we will get older backup maybe 2 step older and populate it into the empty instance. Once this empty instance has been populated we will take last redo log files, find the corrupted statements, remove them and apply changes in those files.
- Cold recovery is not an option. It is something that always has been done.
- It can also helps us in disaster recovery.

## High Availability in Large-Scale Systems

we have 2 datacenters in Mumbai, with sync connection and one in Singapore which is used in the case of disaster recovery. Only message queues and databases are active in Singapore
How do we maintain consistent state between all 3 datacenters?
If mumba1 is down since we have sync communication, Mumbai2 will have same data. When we set up MUMbai1 we aonly set primary replicas in this center. We set the read replicas in Mumbai2 datacenter. request comes to mumba1 center will wirte. but if mumbai2 gets write request, it will route the request to Mumbai1. There is high availability between Mumbai1 and Mumbai2

## Failover Best Paractises

1- Failover Automation
it is requried. failover may happen during night time
2- Regular Failover Testing in Production
We have to test regularly

## System Stability

What are approaches that are needed when a system is under severe load. What are the design practises that system remains stable?

- if one of the services work very slow, some of the threads from a service that making a request to slow instance, may stuck. If we get fresh requests and those also sent to slow instance, that means service that making request to slow instance will lose more threads stuck on waiting response. Eventually we will lose all the threads. To prevent this we put timeout for a service. so we prevent the service to become completely unavailable.
- Retries: this also applies to client components. If two clients want to reserve same ticket this is called race condition. One will fail and other will pass. This is a `transient` error because it was caused by a race condition. If the failed client retries, the transaction will be successful.
  Other kind of errors that we can do retries is the `system errors`. If client makes a request to instanceA which has a replica. if instanceA fails then if client makes request again, replica instance will respond. In both cases we return `HTTP 503 Service Unavailable` to the client so client to decide when to retry. Clients should retry with `exponential back-off`. Let's say we have only one database instance and it is down. we need to bring it up. if client fails after 2 seconds, do after 4 seconds, 8. so all the request will not be shifted to the other instance at the same time.
  We sometimes might be retrying even though our request was successful. Let's say client makes request to IstanceA which process the request, pass it to db and shuts down. since client does not see that it was processed and it will make the same request to other instance will make same change on db item. We should use `idempotent tokens`. When a client sends request to a service, it should have some kind of request id which can be saved in db to show that we have already executed the request. if we retry the request, it will not make change. those kind of requests are called `itempotent requests`
  Retires dont help for functional errors. maybe missing data
- Circuit Breaker: Let's say client keeps track of failure rate of its requests. If number of failures within a given period exceeds a certain threshold, then it can stop making calls to the service. This pattern maintains a state machine. When all calls are going through, the state machine is in closed state. If client detects a failure rate beyond a certain threshold, the circuit breaker goes into the open state and this is where client stops making calls to the service. It relies on some default values. Whereever it is not possible to use default values, it will try to use the cached values. If client (service INstacne) cannot make use of either, it can send error messages back to its client. In the meantime, client will switch to half open which checks if service is back

- Fail Fast & Shed Load: this is implemented on the server side.
