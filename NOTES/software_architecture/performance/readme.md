## Performance Problems

Every performance problem is the result of some queue building somewhere. Requests gets queued up somewhere, Network socket queue, DB IO queue, OS run queue. Resons for build up
1- Inefficient slow processing
2- serial resource access: For depositing and withdrawing, only one thread can access to account. if depostiing halts, withdraw will wait
3- Limited resource capacity

## Performance Principles

1- Efficiency (In the context of serial request processing)
we have a single request in our system. speed of processing this request mostly depends on the code.

- We have have efficient resource Utilization. a machine will have IO resources, memory, network, disk, and compute resources CPU.
- algorithms and db queries should be efficient. this is developer's job
- efficient data structures for storages. db schema if we search something, make sure that record is indexed. use caching
  2- Concurrency
  we have concurrent requests here. our hardware should allows us for conccurrent requests. Our code should be written for concurrent execution. In concurrency multiple requests are executed concurrently. So execution each request itself should be efficient as we discussess in Efficieny topic
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

- reuse the connections. we pool the connections and reuse. this is between server and database or other restful apu
- browser to server communication, browser http 1.0 protocol will create persistent connections. `persistent connection` is something that is not destroyed immediately after one call. It actually keeps that connection for a while in case if it has to make another connection to the same server. In case browser has to make another connections to the same server maybe 5-6 calls, those can be done over the same connnection.

- data transfer overheads.
  - reduce the size of the data
  - avoid any transfer that we really do not need to do that means cache the data.
  - instead of using http protocol which uses ASCII characters to transfer data, we can use some rpc based protocols in intranet. `GRPC`, google. this mights data transfer overhaead minimal.
  - server should compress the data using zip format. this poses another overhead. overhead of compressing data and uncompressing data on client side. client also compress data
  - `ssl session caching` is useful when we repeatedly create ssl connections between a client and server. when ssl connections are created, there is a data that is exchanged between client and server and that data is related to what kind of encryption client or server supports. there are other parameters related to encryption data exchange between client and server. if server can cache those parameters that client transfers to server for creating ssl connection, if server can identifiy that this is the same client so it can use the cached parameters.

## Memory Access latency

- Finite Heap Memory. whether a process uses heap for allocating objects or not, any process running on a machine can utilize only a finite amount of memory. if when we are about to run out of memory or we run, garbage collectors work accessively.
- Large Heap Memory= memory is bigger than physical memory. that means os will use harddisk to accomodate that much of extra heap memory. that will result in swapping of data between pysical memeory and harddisk. that will bring down the performance of process. When heap memory is very large, `GC` has to do more work. it has to sweep through a very large heap size to clear those objects
- each `gc` a different algorithm.
  ## solutions
  if the number of instructions in process are lesser, the back and forth between ram and processor will be lesser. have a smaller code base. also heap mmeory should be lesser cause will create less job for garbage collection.
  `Weak and Soft REferences` are useful where we are at allocating large objects and there is a chance of process going out of memory.
  Multiple smaller process are better than one single process. when we run some batch processes and that it makes sense to actually split that batch process work among multiple nodes. that is much more manageable way of dealing with large amount of data instead of having all the data in one process.
  `GC`. once gs is suitable for batch processes but there are pauses in between. its goal is the efficiency. it stops when it does garbage collections and then resumes. the other kind is one that constantly runs along with the main process. there is no gc that wont have any pause at all. in this kind pauses are less. this is more viable for server process or live process
  `Finite bUffer Mmeory` there should be enough memory in db actions. `Normalization` leads to good utilization of buffer memory.

## Disk Latency

Disk IO is very slow. Loggind is a special case of IO. disk access penalties that are related to logging are not high. high disk penalties are in web content files and db disk access.

**Minimizing Disc Latency**
1- Logging: it is require to write on a file. if we write on a file line by line, this is a `sequential write`. Let's say we write of some data on one mmeory location, then some other memory location, this is called `random disk io`. Both can be read and write. Sequential io much faster. whereever possible do asynchronous logging. what that does is the main thread which is doing computation and it has to do logging. it basically transfers that data to be logged to another thread. main thread will not leave the cpu, it will continue to occupy a cpu for as much time as possible, that will make our process extremely efficient and we would be able to achieve that by doing async io. the only downside of async io is, if somewhere if application crashes , then there is no guarantee that the last few statements would have been logged by async logger. if there is nothing extremely critical that has to be logged, prefer async logging.

2- web content files: any web app is associcated with a lot of static data which is stored as files. fetching file involves IO. one way is to avoid cost of refetching, keep file in memory. `web content caching` is important. the way of caching, we utilize `reverse proxy`. on reverse proxy we keep static data and dynamic data comes through web application. we generally have very high memory for any reverse proxy. reverse proxy is specialized dealing with files.

3- Db Disk Access. cache the data from db so avoid the disk access to db. If you detected that disk IO is a problem in the system `Denormalization` will help here. instead of fetching related data from diffrent tables which requires disk rotation and they will be separete IO's, so it takes more time, we fetch data from one table. Normally Normalization is preferred because it will require less memory in the databaase and it will reduce the amount of data we have to write.

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
