## Apache Web Server

- Store static content on apache
  It is stored on apache server's harddisk. this is a disk IO and slow. when first apache gets requests for a JPEG file, it will store it on RAM. It is important to have a very large RAM.
- Generate dynamic content on apache
  It does this pretty well. for generating dynamic HTML pages, apache uses RAM and CPU. Apache has no JSP/Servlets containers.
  JSP- Java Server Pages. It is a serverside technology. It is used for creating dynamic web content. It is an advanced version of Servlet Technology
- act as a reverse proxy. but apache is not good for it. a `reverse proxy` is used to protect servers. A reverse proxy is a server that accepts a request from a client, forwards the request to another one of many other servers, and returns the results from the server that actually processed the request to the client as if the proxy server had processed the request itself. The client only communicates directly with the reverse proxy server and it does not know that some other server actually processed its request.

  **Apache Webserver Architecture** is based on request/response model.
  apache server can be used as load Balancer too.

## NGINX

Reverse Proxy is better than apache

## NODE.JS

Request should be IO bound not CPU bound. It means that each request should not force node.js to do alot of computations. If there are alotof computations involved in solving a request then node.js is not a good choice. IO bound has little computation required. most of time request are spent in either making a call to a db or a service. In this case node.js is an excellent choice because it gives us an opportunity to handle a very large number of connections.

- SIngle thread avoids contect switching and it saves memory
- node.js similar to nginx event driven model.
- native data structure format on server is json.
  https://stackoverflow.com/questions/868568/what-do-the-terms-cpu-bound-and-i-o-bound-mean#:~:text=CPU%20bound%20means%20the%20program,the%20bottleneck%20and%20eliminate%20it.

Event loop is a single threaded. it never gives up CPU on its own. if OS for some reason move event-loop thread out of CPU, it can do that but that thread on its own will never recover vacate the cpu. OS responsibilites are: Incoming network calls-client requests, os io queue which are disk access and outgoing network calls.

Incoming reqeusts are first handled by the OS same with pretty much with every server. All other servers based on request response model, they will spawn a thread for each client request but not in node.js. In node.js we have only one event loop is running which constantly polls OS IO queue that is how it gets to know about the incoming client request. If there is any incoming requests, it will take that request it will execute that synchronously. while executing if there is any async call (i.e setTimeout), it will be put into the callback queue. After event loop finsihes executing sync calls, it can poll the callbacks, if it finds a callback that needs to be executed, it will execute that callback. then it will poll for any incoming request.

ANy io should be ascyn otherwise it will block the event loop. If we need to make an external call, that responsibility is given to the OS. OS will take care of making external calls. Event loop will peridiocally will poll for the Operating System IO queue to see if we get any response for our outgoing network call.

Polling is the process where the computer or controlling device waits for an external device to check for its readiness or state, often with low-level hardware. For example, when a printer is connected via a parallel port, the computer waits until the printer has received the next character. These processes can be as minute as only reading one bit. This is sometimes used synonymously with 'busy-wait' polling. In this situation, when an I/O operation is required, the computer does nothing other than check the status of the I/O device until it is ready, at which point the device is accessed. In other words, the computer waits until the device is ready. Polling also refers to the situation where a device is repeatedly checked for readiness, and if it is not, the computer returns to a different task. Although not as wasteful of CPU cycles as busy waiting, this is generally not as efficient as the alternative to polling, interrupt-driven I/O.

https://stackoverflow.com/questions/34855352/how-in-general-does-node-js-handle-10-000-concurrent-requests/73861318#73861318

## Cloud Solutions

- Automated deployment
- all cloud solutiions are built in scale.
- global deployment solutions. you can deploy any continent

**Cloud Storage**

- space is unlimited
- there is version control. if we upload a product image, if we discover that we have uploaded it by mistake, then we can easily go back to prev version.
- accessc control. which users have write access, read access
- low latency: files that are stored on cloud storage, they are not stored on a directory structure, they are in a key-value pair. there is no overhead of directory structure.
- High Thorughput is achieved because files are replicated over multiple servers. file1 might be replicated on 3 thre servers. if there are more readers for a particular file, it will be replicated even more. Also large files can be broken into chunks. Read become faster because we can parelly read multiple chunks and then combine those files and then give it to a user.
- high availability. files are replicated on more servers
  **Cloud CDN**
  Static data size is larger that dynamic in any ecommerce app. CDN has alot of servers present in each continent and different countries. the job of those servers is to cache the data that is coming out of origin server if cacheable.

## Memcached

Memcache is a centralized cache. every service node will be connected to the memcached. values are stored as `blob`. it is better not cache large objects beacuse it will take too much space and you will store less cache obj.

- we can set TTl for each cache data.
- when memory is full, memcache will evict expired data first and then LRU data.
- we can have a cluster of nodes for memcache.
- Memcache follows cache-aside pattern. Using the Cache-Aside Pattern dictates that when you want to retrieve an item from the Data Store, first you check in your cache. If the item exists in the cache, you can use that. If the item does not exist in the cache, you have to query the data store, however on the way back you drop the item in the cache.

How does client know which cluster node it should visit for a particular key? cline t will compute the consistent hashing. client is managing the state of the nodes.

- retrieveing data latency is sub-miliseconds latency
- If a Memcached server instance crashes, any object data stored within the session is gone

## REDIS

It came after memcached. so it filled all the gaps of memcached.

- it is not just key-value cache, it is key-dataStructure cache.
- redis is not only cache, but also a data store. whatever is written to the cache is also written to the disk. that allows us to take backups. this allows us to restart our cache nodes. If we restart them, our cache nodes will be prepopulated with the backup. we can restart the entire cluster.
- redis also can be used as a messaging queue.

## RABBITMQ

Either a service `push` messages to other services or other services `pull` from the message queue.

- FIFO
- If we deliver message from service1 to service2 with without message queue, both services might be restful. But in the case of message queue, service1 and 2 cna be any service types. this is `interface decoupling`.
- message queue can act as a message buffer. If service1 pushes messages in high rate and service cannot process it at the same rate, in between messge queue act as a message buffer. later on when service1 message sending rate decreases, service2 can consume those messages. If not we can add more consumers. this is a typical use case in streaming kind of work flow.
- RabbitMQ can be used for "push' or "pull" but Kafka can be used only for `pull` based messaging.
