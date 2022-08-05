- Vertical Scaling= bigger server. there is not alotof of things to maintain. Only a bigger server and bigger database. the fewer machines that i have, fewer machines that likely break but when it does break I am in trouble.

- Horizontal Scaling= you have multiple servers and some sort of load balancer between the internet and those servers that are distributing that load in some fair. if a host is down, load balancer will realize that a host is down and reroute the traffic around it automatically. So you have no downtime. you can pretty much scale infitely with this idea. this works well if your web servers are stateless. That means, subsequent requests should not depend on somehthing being stored on that server from a previous request. Because, I do not know where the previous request got routed to. I cannot assume on any given server that I have any information about the previous hits

  Stateless web server means that any web server can handle any request at any time

Horizontal Scaling is also referred to as “scale-out”, usually requires a load-balancer program which is a middle-ware component in the standard 3 tier client-server architectural model. The Load-Balancer is responsible to distribute user requests (load) among the various back-end systems/machines/nodes in the cluster. Each of these back-end machines run a copy of your software and hence capable of servicing requests. It may also run a “health-check” where the load balancer uses the “ping-echo” protocol or exchanges heartbeat messages with all the servers to ensure they are up and running fine.

## Disadvantages of horizontal scaling:

    - Architectural design is highly complicated
    - It’s important for the administrator to know whether the licensing costs for those additional servers
    - High utility costs such (cooling and electricity)
    - Bigger footprint and impact on the data center
    - Extra networking equipment such as routers and switches are required

## Database Failures

- this is called `cold standby`. One method is to have a periodic backup that runs off that database host. If my database goes down, another one is standby but it is not quite ready. baically I have to make sure that I have the ability to get my hands on a replacement database host really quiickly. but i need to restore that back up first. I am gonna restore that backup file to my standby database. if i have too much data, restoring data might take alot of time. it might take days on some oracle hosts. Furthermore, any data that happened after that last backup will be lost.

- warm standby= we have another database sitting there but always ready to go. this called `replication`. that is constantly copying the data from the primary database to a backup database host. Instead of having periodic backup that I need to manually restore, i am making sure that this second database host is always warm. it always have the copy of the data there. there are many ways of handling replication. one way is simultaneously write the data to each server but most databases have their own replication mechanism built in where you have more than one database host, you can just turn on the replication and the database will manage that for you automatically. So as things are written , they will be copied off to the other backup hosts automatically.

- hot standby: instead of relying on replication, we are actually gonna be writing that data simultaneously from our server to every database instance. we donot have replication mechanism that is handling all this on the backend. Instead, our front end web hosts are actually writing simultaneoulsy to all of those different backup hosts at the smae time.
