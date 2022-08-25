- performance of a system is measure of its `LATENCY` and its `THROUGHPUT`. we say that performance is good if it exhibits "low latency" and "high throughput". "high throughput" is the rate at which the system is processing requests. The rate of water flow is the `Throughput`

https://stackoverflow.com/questions/36949735/what-is-the-difference-between-latency-bandwidth-and-throughput

In order to improve throughput, we have to improve concurrency and we have to augment capacity.

    SCALABILITY IS SUBSET OF PERFORMANCE. we do not discuss latency. we assume latency is alredy taken care of. we discuss what are the ways to increase throguhput of a system under variable loads.

- banks use ssl connection which is on top of tcp. it has more overhead. because it has keys exchanges after tcp handshake

## MINIMIZE LATENCY

- to reduce network latency we can

  - reuse the connections. we pool the connections and reuse. this is between server and database or other restful apu
  - browser to server communication, browser http 1.0 protocol will create persistent connections. `persistent connection` is something that is not destroyed immediately after one call. It actually keeps that connection for a while in case if it has to make another connection to the same server. In case browser has to make another connections to the same server maybe 5-6 calls, those can be done over the same connnection.

- data transfer overheads.

  - reduce the size of the data
  - avoid any transfer that we really do not need to do that means cache the data.
  - instead of using http protocol which uses ASCII characters to transfer data, we can use some rpc based protocols. `GRPC`, google. this mights data transfer overhaead minimal.
  - server should compress the data using zip format. this poses another overhead. overhead of compressing data and uncompressing data on client side. client also compress data
  - `ssl session caching` is useful when we repeatedly create ssl connections between a client and server. when ssl connections are created, there is a data that is exchanged between client and server and that data is related to what kind of encryption client or server supports. there are other parameters related to encryption data exchange between client and server. if server can cache those parameters that client transfers to server for creating ssl connection, if server can identifiy that this is the same client so it can use the cached parameters.
