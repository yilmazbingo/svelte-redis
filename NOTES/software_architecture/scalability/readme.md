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
