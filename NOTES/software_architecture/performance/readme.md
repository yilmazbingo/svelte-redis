## Memory latency

- Finite Heap Memory. whether a process uses heap for allocating objects or not, any process running on a machine can utilize only a finite amount of memory. if when we are about to run out of memory or we run, garbage collectors work accessively.
- Large Heap Memory= memory is bigger than physical memory. that means os will use harddisk to accomodate that much of extra heap memory. that will result in swapping of data within pysical memory. and between pysical memeory and harddisk. that will bring down the performance of process. When heap memory is very large, `GC` has to do more work. it has to sweep through a very large heap size to clear those objects
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
