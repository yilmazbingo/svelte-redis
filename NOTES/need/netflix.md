Netflix operates in two clouds. AWS and Open Connect. Both clouds must work togethere seamlessly to deliver endless hours of video. Anything that does not involve video streaming is handled by AWS. Video streaming is handled by Open connect. Open connect is owned by netflix. The Open Connect network shares somecharacteristics with other CDNs, but also has some important differences

- Open Connect
- backend
- clienta: consoles, smart tv, almost everything

## ELB

It uses Amazon's elastic load balancer. Load is balanced across zone first and then load is balanced accross the instances: `Two Tiered Balancing Scheme`. First part consist of basic dns-based `round-robin` load balancing. round robin is the most widely deployed load balancing algorithm. Using this method, client requests are routed to available servers on a cyclical basis. Round robin server load balancing works best when servers have roughly identical computing capabilities and storage capacity. when request hits the LB, request will balance across Z1,Z2,Z3 zones using `round-robin`. Zone is kind of logical grouping of servers there could be 3 different zones in US. The second tiers is the array of load balancer instances which does round-robbin load balancing on the instances to distribute the requests on accross these instances.

## Videos

Creasing video requires alot of preprocessing, finding errors, converting the video into different resolution, different format. this process is called `transacoding`. each platform needs different video resolution. original videos are very large, 50 gb

Netflix also creates file optimized for different speed of internet. `adaptive bitrate streaming`. Netflix has to create multiple copies of the same movie in different resolutions. Netflix creates multiple replicas (approx 1100-1200) for the same movie with different resolutions. These replicas require a lot of transcoding and preprocessing. Netflix breaks the original video into different smaller chunks and using parallel workers in AWS it converts these chunks into different formats (like mp4, 3gp, etc) across different resolutions (like 4k, 1080p, and more). Those chunks will be placed into a queue, and these chunks will be picked up by different workers, Amazon EC2 workers. those workers will convert those chunks into different formats with different resolutions. Now we need to push those to the each Open Connect server.

authentication and list of videos are handled by AWS. once you hit the play button, application will figure out the best open connect server and Open connect server will start streaming the video to the client. Client also smart enought to check the best available OC server around to get the best video quality. Recommendations are done by AWS machine learnign algorithm.

## ZULU

It is a gateway service (Netflix built it) that provides dynamic routing, monitoring, resiliency and security. Request to netflix (uses proxy) go through: Inbound filter, Endpoint Filter, Outbound
filter. Netflix will proxy the request to `Inbound Filter`, can be used for authentication, routing or decorating the reques.

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
