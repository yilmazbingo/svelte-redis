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
