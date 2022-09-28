## Performance Problems

Every performance problem is the result of some queue building somewhere. Requests gets queued up somewhere, Network socket queue, DB IO queue, OS run queue. Resons for build up

1- Inefficient slow processing

2- serial resource access: For depositing and withdrawing, only one thread can access to account. if depostiing halts, withdraw will wait

3- Limited resource capacity

## Performance Principles

1- Efficiency (In the context of serial request processing)
we have a single request in our system. speed of processing this request mostly depends on the code.

- We have efficient resource Utilization. a machine will have IO resources, memory, network, disk, and compute resources CPU.
- algorithms and db queries should be efficient. this is developer's job
- efficient data structures for storages. db schema if we search something, make sure that record is indexed. use caching
  2- Concurrency
  we have concurrent requests here. our hardware should allow us for conccurrent requests. Our code should be written for concurrent execution. So execution each request itself should be efficient as we discussess in Efficieny topic
  3- Capacity
  If we get better hardware, we get better performance

## System Performance Objectives

1- Minimize Request-response latency

Latency is measured in time units. How much time a request-response spends withing a system. Wait/idle Time + Processing time. request goes through, web applicaton =>business application=>database
There are some components which are not request/response based. If we are generating a report which reads data from a db and processed that data and makes a report. This kind of processs is doing `batch processing`. we have concept of batch processing time but not req/res. In req/res we are interested in `latency and throughput` but for batch processing we are interested in throughput only.

2- Maximize throughput

throughput is a measure of how many requests a system can process in a given time. It is a rate of request processing. Low latency and High Capacity increses the throughput.

## Performance Measurement Metrics:

4 important metrics are

- Latency
- Throughput: Higher the throughput, higher number of users can be supported.
- Errors
- Resource Saturation: If we do not measure resource saturation, we will never come to know whether our hardware is over utilized or underutilized

## Network Latency

There are two kinds of network. Between Broser and web application. Inernal Network, webApp => Services =>DB

1- Data Transfer

2- TCP Connection

UDP is faster but not reliable. Handhake connection takes time

3- SSL/TLS Connection

**TO reduce network latency we can**

- reuse the connections. we pool the connections and reuse. this is between server and database or other restful api
- browser to server communication, browser http 1.0 protocol will create persistent connections. `persistent connection` is something that is not destroyed immediately after one call. It actually keeps that connection for a while in case if it has to make another connection to the same server. In case browser has to make another connections to the same server maybe 5-6 calls, those can be done over the same connnection.

- data transfer overheads.
  - reduce the size of the data
  - avoid any transfer that we really do not need to do that means cache the data.
  - instead of using http protocol which uses ASCII characters to transfer data, we can use some rpc based protocols in intranet. `GRPC`, google. this mights data transfer overhaead minimal.
  - server should compress the data using zip format. this poses another overhead. overhead of compressing data and uncompressing data on client side. client also compress data
  - `ssl session caching` is useful when we repeatedly create ssl connections between a client and server. when ssl connections are created, there is a data that is exchanged between client and server and that data is related to what kind of encryption client or server supports. there are other parameters related to encryption data exchange between client and server. if server can cache those parameters that client transfers to server for creating ssl connection, if server can identifiy that this is the same client so it can use the cached parameters.

## Memory Access latency

- Finite Heap Memory. whether a process uses heap for allocating objects or not, any process running on a machine can utilize only a finite amount of memory. if when we are about to run out of memory garbage collectors work accessively.
- Large Heap Memory= memory is bigger than physical memory. that means OS will use harddisk to accomodate that much of extra heap memory. that will result in swapping of data between pysical memeory and harddisk. that will bring down the performance of process. When heap memory is very large, `GC` has to do more work. it has to sweep through a very large heap size to clear those objects
- each `gc` a different algorithm.
  ## solutions
  - if the number of instructions in process are lesser, the back and forth between ram and processor will be lesser. have a smaller code base. also heap mmeory should be lesser cause will create less job for garbage collection.
  - `Weak and Soft REferences` are useful where we are at allocating large objects and there is a chance of process going out of memory. A Soft reference is eligible for collection by garbage collector, but probably won't be collected until its memory is needed. i.e. garbage collects before OutOfMemoryError . A Weak reference is a reference that does not protect a referenced object from collection by GC.
  - Multiple smaller process are better than one single process. when we run some batch processes and that it makes sense to actually split that batch process work among multiple nodes. that is much more manageable way of dealing with large amount of data instead of having all the data in one process.
  - `GC`. once gc is suitable for batch processes but there are pauses in between. its goal is the efficiency. it stops when it does garbage collections and then resumes. the other kind is one that constantly runs along with the main process. there is no gc that wont have any pause at all. in this kind pauses are less. this is more viable for server process or live process
    `Finite bUffer Mmeory` there should be enough memory in db actions. `Normalization` leads to good utilization of buffer memory.

## Disk Latency

Disk IO is very slow. Logging is a special case of IO. disk access penalties that are related to logging are not high. high disk penalties are in web content files and db disk access.

**Minimizing Disc Latency**

- Logging: it is require to write on a file. if we write on a file line by line, this is a `sequential write`. Let's say we write of some data on one mmeory location, then some other memory location, this is called `random disk io`. Both can be read and write access. Sequential IO is much faster. Fetching data from db is random-io. whereever possible do Batch IO logging. This will help in reducing these context swtiching related costs.

Whereever possible to async logging. what that does is the main thread which is doing computation and it has to do logging. it basically transfers that data to be logged to another thread. main thread will not leave the cpu, it will continue to occupy a cpu for as much time as possible, that will make our process extremely efficient and we would be able to achieve that by doing async io. the only downside of async io is, if somewhere if application crashes , then there is no guarantee that the last few statements would have been logged by async logger. if there is nothing extremely critical that has to be logged, prefer async logging.

- web content files: any web app is associcated with a lot of static data which is stored as files. fetching file involves IO. one way is to avoid cost of refetching, keep file in memory. `web content caching` is important. the way of caching, we utilize `reverse proxy`. on reverse proxy we keep static data and dynamic data comes through web application. we generally have very high memory for any reverse proxy. reverse proxy is specialized dealing with files.

- Db Disk Access. cache the data from db so avoid the disk access to db. If you detected that disk IO is a problem in the system `Denormalization` will help here. instead of fetching related data from diffrent tables which requires disk rotation and they will be separete IO's, so it takes more time, we fetch data from one table. Normally Normalization is preferred because it will require less memory in the databaase and it will reduce the amount of data we have to write.

Another thing on schema optimization is `index`es. it helps us fetching data efficiently. without index we have to do full table scan to find an instance.
Optimize queries.
Where disk io is critical we can use `SSD` disk.

## CPU processing Latency

- Inefficient Algorithm
- Context Switching
  It affects the entire system. It oftens affects the environments where we are running multiple processes on a machine or multiple threads on a machine. Let's say we have a single CPU machine and on that we are running two processses.
  Process1 is running on this machine and it is occupying CPU.Consequently process2 is waiting for process1 to evict CPU so that it can start its execution. All these has to be managed by the operating system. Process1 may try to do some IO, access disk or make a network call. If that happens, then this process will be evicted from CPU by the operating system. Not process2 can start its execution. When process1 ends its execution, after some delay process2 starts its execution. The question is why there is a delay between end of process1 and beginning of proceess2. OS first has to evict process1 so it will take this process from CPU and it will save this process in main memory. Next, OS will restore the process2 by loading process control block from memory and it will put it on CPU for execution. Then process2 will start its execution. Between process1 ended and process2 start, we have lost some time. We could avoid this wastage if we could avoid this context switch. Context swtihc happended because process1 had to do IO.
  **Minimizing CPU Latency**
- Efficient algorithms and queries.
- We have to focus on minimizing the context switching
  1- wherever applicable we can use BATCH?Async IO.
  If we are making multiple calls to database to fetch some data. It is not only network overhead. we are also creating overhead for CPU becasue now our process or thread which is making those calls, will have to evict CPU multiple times and will incur `context switching` costs. if we batch those calls, it will save network latency and CPU latency. FOr Async case, whenever our business logic (services) are executing we write log statemetns so that if our process crashes or we have todo debugging, we analyze those log statements. Writing these log statements is an IO. This results in contect switching. If we want to avoid this, we should do AsyncIo in a separate thread so our main thread will keep running efficiently.
  2- Use of single threaded model:
  js, node.js, NGINX, VoltDB. Process that uses multiple processes does alot of IO.
  3- Minimize Thread Pool size
  we should not have very large thread pool. If we have too many threads, it is likely that some threads wont get time to execute on this CPU.Os will give time to each of these threads one by one and that will result in alot of context switching.
  4- Multi process in Virtual Env.
  when we run multiple processes on a single machine, we should run them in their own virtual environments because what can happen is if we have 4 processes, those can try to contend for the CPU that is available on this machine. virtual environments will allow running processes with their dedicated quota of CPU and memory so they will not interfere with each other.

## Amdhal's Law for concurrent tasks

we are assuming we alredy mnimized single request latency. No system is truly parallel. they might start paralel, then executed serially and then parallel again in each different workflow. In general, we have to take logs, coordinate threads, synchronize the code. So there will serial portions within a parallel process. Depending upon how much serial component is there, we will see performance graph increasing graph with diminishing return. Amdhal tells how much the serail portion effects the performance graph.
if it was a perfectly parallel system, the rate would have been perfectly linear. If there is a serial portion within a process, it does not matter 1 percent or 2 percent the rate of graph will be flat after a given point. Amdhal's law calculates how soon the graph is going to flatten out. If it is flatten out that means throughput has decreased.

If you want to make a system highly performing, we have to keep the serial portion as low as possible.
During this serial portion, multiple threads/processes that are executing, get `queueing`. That results into queuing.

## Gunther's Universal Scability law

Universal scalabilit law points to `coherence` which limits the concurrency of any system. Amdhal's law deals only with queueing. Universal sclability law combines both queueing and coherence effect.
**Coherence:** Let's say you have a multi-threaded application where you have multiple threads executing on multiple processors. They share same main memory but their processor registered memory which is L1,L2 memory cache, they are unique to processor, so they are not shared. If you want a particular variable to have a coherent value between all threads, then you declare that variable volatile. Volatile means, copy of that variable should remain consistent in all processors. for a normal variable, you can have separate copies of these variables in each processor and you can modify them independently, you can have different values in different threads for the same variable that possible.

In computer programming, particularly in the C, C++, C#, and Java programming languages, the volatile keyword indicates that a value may change between different accesses, even if it does not appear to be modified.

If that variable is modified in one thread, that will force a refresh of that variable in other processors, memory space as well. Their cache will be also refreshed. Because we changed a variable in one processor that will lead to change in the value of that variable and other processor cache as well. This comes at a performance cost.
If we have alotof variables that are shared and we modify them alot, this means that in such an application, the coherent cost will be high. So if increase the number of threads or number of processors, number of users in order to increase the `throughput`, then `throuhgput` does not increase but instead it starts decreasing. In Amdhal's Law, because of queuieng effect, we see that throughput graph starts decreasing. `Queueing` will never bring down your graph, it will flatten. but `coherence` can bring down the `throughput` graph.

## Shared Resource Contention

Contention and coherence are the biggest killers of concurrency. If server is very busy, we can have two keeps. LIsten/Accept. Listen queue reaches its max capacity, new requests will not be accepted. We need to avoid a queue in our system. Queueu is unwanted latency. it is the killer of concurrency. If we increase the concurrency queue disappears. First place of queue build up is Listen/Accept queue.
In order to get Cpu, request should be allocated to a thread. There are limited treads in any process. If a system is overloaded, then there will be contention for a thread from a fixed size threadpool. this is the second contention a process will face.
If the request has been allocated a thread and it is executing on a process, there can be increased contact switching due to contention. If we keep threads pool with sufficient limit, there should not be contention because of the fact that there are too many requests that are running over here. there will context swithcing only in case of any IO or logs that process is waiting for. Now request is processing but we cannot have infinite number of connections to any back end. There will be some definite number of connections available through a connection pool. Now those threads will have to content for a connection from the connection pool.
If we are doing alot of IO, disk can be a source of contention which is always true in case of db. whenever we are doing process on database and there is alot of data being fetched from disk, we see that there is contention for disk.
Thre can be contention for network. sometimes happens in microservices that internal networks get choked because there are so many call which are being done to different services. Network availability is another thing for which there can be contention
The biggest sourceo of contention in any workflow is acquiring locks. this is the serial part of the code that "locks serialize". they are the gatekeepers to the serial portions of code. If multiple threads are trying to access ame lock then that lock can become a source of contention.

## Minimize Shared Resource Contention

- Cpu/Disk/Network: As we increase the number of request. Make sure single request latency is in control. For network and memory, we have nothing that we can do apart from vertically scaling our system. `RAID` disks are redundant array of independent disk, this will allow parellel access to disk. When you have redundant array of independent disk, your data is copied on multiple disks. If there are multiple threads which are looking for the same data now data is available on multiple disk which can be accessed parallely. we can increse the performance of db by using RAID disks.
- Listens Queeue= we generally dont do anything. It becomes a problem when we go to extreme scales. When requests are rejected by large listen queue, then we can tune the operating system parameters to increase the ListenQueue size.
- TreadPool Size= it is a collection of worker threads that are dedicated for a single purpose. ThreadPool is provided by the container that our webapp is running: Jetty,If we have smaller pool size the contention will increase, listen queue will grow up which will mean alot of requests will wait for threads to be allocated. If we have a larger thread pool size, those thread will sits idle.
- ConnectionPool SIze=if you have 100 threads, you should have 100 connections. Those pools can be server=>service or service=>DB
- Locks/Semaphores
  **Minimize Lock Contention**
  - Reduce the duration for which a lock is held.
    Move out the code, out of sync block.
  - Lock Splitting: Split locks into lower granularity locks that are experiencing moderate contention. Duration for locks will be reduced
  - Lock Striping:
  - Replace exclusive locks with coordination mechanism
    **Pessimistic Locking**
    When we are dealing with shared data, we often take locks so that we do not do concurrent updates, otherwise that will result in data corruption. Let's say in an ecommerce app, users are booking orders to buy certain products as a result we have multiple threads running concurrently and are contenting for the same inventory of those products. In pessimistic locking,we fetch the shared data and we lock it so noone else can lock it. In this case our shared data is records in the db. Then we process this data and once processing is done we update the db with the latest records. Then we release the lock by commiting the transaction. Transaction duration is very long. we took lock in the beginning and we release it at the end of the transaction. In optmistic Lcoking duration is much smaller.
    Multiple threads will start to execute the code for fetching data and only one of them will be able to get the lock. In case of SQL db, `SELECT` statement will take the lock. From here onwards, there will be only one thread will be execute the code and all of other threads will blocked. Pessimistic locking is used when there is high contention.
    **Optimistic Locking**
    We are going to fetch the data without any locks. Then we will process this data, update the data if and only if data is not stale, of data is stale we back off the thread. For example if we had 100 items in inventory and we have to update it 99 but if another thread already used 1 it should be 98, but if update we would update it as 99 we will restart the thread. We had race condition here. If we had a few race conditions that is not a big deal but if the race condition is so much alotof threads have to restart which will be very expensive. we use `optimistic` only when contention is moderate to low. Otherwise will run in a loop. If the thread is successful then we will do commit. Duration of lock is from update till and committing. During the fetching and updateing the data, other threads will be able to execute the code concurrently.
    **Compare and Swap**
    It is optimistic locking mechanism. In nosql databases do not allow transactions. the only way to ensure atomicity here is through optimistic locking. let's say we are fetching data from inventory database. product has 100 avaialble items. Many threads can read that value and upadte it. compare and swap mechanism provided by the cpu.
    **DeadLock**
    It can bring down our system completely. we need to guard our system agains possible deadlocks.
  - Load Ordering Related Deadlocks
    Let's say one thread wants to transfer money from "A Account => B Account" and another thread wants to transfer money from "B Account => A Account", simultaneously. This can cause a `deadlock`.

The first thread will take a lock on "Account A" and then it has to take a lock on "Account B" but it cannot because second thread will already took lock on "Account B". Similarly second thread cannot take a lock on A Account because it is locked by the first thread. so this transaction will remain incomplete and our system will lose 2 threads. To prevent this, we can add a rule that locks the database records in sorted order. So thread should look at accounts name or IDs and decide to lock in a sorted order: A => B. There will be a race condition here and whoever wins, process its code and the second thread will take over. This is the solution for this specific case but deadlocks may occur in many reasons so each case will have a different solution.

Os has a deadlock detection mechanism with a certain interval of time, and when it detects the deadlock, it starts a recovery approach. [More on deadlock detection][1]

In the example we lost 2 threads but if we get more deadlocks, those deadlocks can bring down the system.
[1]: https://www.baeldung.com/cs/os-deadlock

## Coherence Related Delays

It is related to shared data. Queeing and coherence affects the concurrency. there is not much we can do about coherence delays.
If you have a multithread system and these multiple threads share some data, that is where coherence comes into the picture. If two threads work on a data they will load those data in their own cache. If we do not use any locking mechanism, any change made in one thread is not gonna be available in other cpu.

- **LOCKING (SYNCHRONIZED)**
  all variables accessed inside a sync block are read from the main memory at the start of the sync block.
  all variables modified in a sync block are flushed to the main memory when the associated thread exisits the sync block instead of keeping in the cache.
  This cause serious, incorrect behaviours within a concurrent system. To avoid those, we do two things: we can add read/write access to this particular object under synchronized code. there is a huge cost involved when we have to read any object from the main memory. because it will increase the latency. we can alleviate this cost by changing the variable from synchronized to `volatile`. we are not gonna pay locking related penalties. we only have to pay penalties that are related to the visibility. It means that whenever value of the variable is modified in any of the processor, the other thread will be forced to read it.
  Synchronization enures both locking and visibility, volatile ensures only visibility. Visibility still has coherence delays

https://stackoverflow.com/questions/106591/what-is-the-volatile-keyword-useful-for/73677124#73677124

## CACHING

Denormalization will make the request faster wherever we need to do joints.
In general Normalized schema works better whereever we need write performance. Amount of data we have to write is reduced by normalization. It also makes data represesntation compact so it becomes easier to cache it.
**HTTP Caching for Static Data**
all the client requests will go through Proxy Server which can cache the responses. Proxy Server Cache is considered as a public place of caching. Browser cache is private. Reverse Proxy is set near the web Instances, it is internal proxy, and it can be used for caching. Reverse proxy cache is also private cache.

"How does a public cash or private cash knows what data should be cached"
"GET" request is good for cachign because it does not modify the data. But not every "GET" request good candidate for caching. Especially when "GET" requests serves that data with changes very frequently. Whenever web application sends back a response, it can put `cache-control` header on the response. it indicates if the request should be cached if it is cached for how long it should be cached. If request can be cached - No-cache: Do not use the cached data withoud validating with the origin server. still used, cached but needs validation - Must-revalidate: like no-cache but need to validate only after its max-age - No-store: absolutely no cache - public: any shared cache can cache. it will be used by public so no need for validation - private: only a client can cache - Max age: for how long should be cached
**ETAG**
Etag is a hash for indicating that version of resource. When the server returns data, it hashes the data and set this hash value under ETAG. When you send a "PUT" request to the server to update a record, maybe simultaneously another user made the same "PUT" request and its request has been processed. Server will check your "PUT" data and will see that it is same update so it wont make another update, it will send you the updated data (by another user) and you will update your cache.
**Caching Dynamic Data**
We need dynamic data cache for services and web applications7

- Exclusive Cache
  Each instance of web application caches in its own memory. we will have duplicated cached data. With adding rouuting, we can read the cookies and route the request to the proper instance. in scalability it has drawback but for performance it works well.
- Shared Cache:
  we externalize the caching to an external component. it will add another network hop.

## Caching Challenges

Caching size and cache invalidation&Cache Inconsistency
Cache smaller size objects.
**Cache Invalidation**
we can update or delete cached data everytime we are updating the source. After we are done updating in db, we update it in cache. This works if the cache is under our control. the advantage of this cache is we can easily avoid cash inconsistency.
we specify TTL values for each data is supposed to be cached. TTL values are enforced through cache-control header `MAX-AGE`. when data is cached, this `ttl` value is also received. Disadvangtage is you have to figure out arbitrary value for each data. if we set high, TTL value, data might be inconsistent. Low ttl, will incalidate soon so we are going to hit the db very often.

https://stackoverflow.com/questions/499966/etag-vs-header-expires/73673262#73673262
https://stackoverflow.com/questions/34512/what-is-a-deadlock/73669574#73669574
https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking/73669255#73669255
https://stackoverflow.com/questions/68271429/what-does-gunthers-negative-returns-from-incoherency-mean/73652515#73652515
https://stackoverflow.com/questions/39812808/understanding-amdahls-law/73623854#73623854
