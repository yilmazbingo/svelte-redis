- plugins is for rabbitmq ui

- http://localhost:15672/

user= guest , password- guest

## Queue

Located on a single node where it ws declared and referenced by unique name. Both producer and consumer can creaet a queue.

- 1 queue= 1 erlang process
  when node starts up to 16384 messages are loaded into RAM from the queue.

- queue is ordered collection of messages (FIFO by producer perspective). messages are always held in the queue in publication order but it does not guarantee same consuming order.

- rabbitmq can support many protocols and AMQP is only one of them.

- consumer can reject the message

##### Queue properties

- name
- Not durable queues wont survive broker restart
- Auto delete feature: queue deletes itself when all consumers disconnect
- Classic and Quorum: Increase availability.
- Exlusive queue used only by one connection and the queue will be deleted when that connection closes.
- Priority: default is FIFO by you could change the sorting by priority.
- Expiration time (TTL). both messages and queues can have TTL.

## Exchange

https://www.cloudamqp.com/blog/part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html

Exhanges and bindings exist on all nodes.

Messages are not published directly to a queue. Instead, the producer sends messages to an exchange. Exchanges are message routing agents, defined by the virtual host within RabbitMQ. An exchange is responsible for routing the messages to different queues with the help of header attributes, bindings, and routing keys. Routing key is just a random string.

A binding is a "link" that you set up to bind a queue to an exchange.

The routing key is a message attribute the exchange looks at when deciding how to route the message to queues (depending on exchange type).

Exchanges, connections, and queues can be configured with parameters such as durable, temporary, and auto delete upon creation. Durable exchanges survive server restarts and last until they are explicitly deleted. Temporary exchanges exist until RabbitMQ is shut down. Auto-deleted exchanges are removed once the last bound object is unbound from the exchange.

In RabbitMQ, there are four different types of exchanges that route the message differently using different parameters and bindings setups. Clients can create their own exchanges or use the predefined default exchanges which are created when the server starts for the first time.

1- The producer publishes a message to the exchange.

2- The exchange receives the message and is now responsible for the routing of the message.

3- Binding must be set up between the queue and the exchange. In this case, we have bindings to two different queues from the exchange. The exchange routes the message into the queues.

4- The messages stay in the queue until they are handled by a consumer.

5- The consumer handles the message.

### Exchange types

###### Direct Exchange

A direct exchange delivers messages to queues based on a message routing key. The routing key is a message attribute added to the message header by the producer. Think of the routing key as an "address" that the exchange is using to decide how to route the message. A message goes to the queue(s) with the binding key that exactly matches the routing key of the message.

###### Default exchange (Nameless exchange)

The default exchange is a pre-declared direct exchange with no name, usually referred by an empty string. When you use default exchange, your message is delivered to the queue with a name equal to the routing key of the message. Every queue is automatically bound to the default exchange with a routing key which is the same as the queue name.

##### Fanout Exchange

It ignores the routing key. A fanout exchange copies and routes a received message to all queues that are bound to it regardless of routing keys or pattern matching as with direct and topic exchanges. The keys provided will simply be ignored.

##### Direct Exchange

We will use a direct exchange instead. The routing algorithm behind a direct exchange is simple - a message goes to the queues whose binding key exactly matches the routing key of the message.

##### Topic Exchange

Topic exchanges route messages to queues based on wildcard matches between the routing key and the routing pattern, which is specified by the queue binding. Messages are routed to one or many queues based on a matching between a message routing key and this pattern.

##### Headers Exchange

A headers exchange routes messages based on arguments containing headers and optional values. Headers exchanges are very similar to topic exchanges, but route messages based on header values instead of routing keys. A message matches if the value of the header equals the value specified upon binding.

A special argument named "x-match", added in the binding between exchange and queue, specifies if all headers must match or just one. Either any common header between the message and the binding count as a match, or all the headers referenced in the binding need to be present in the message for it to match. The "x-match" property can have two different values: "any" or "all", where "all" is the default value. A value of "all" means all header pairs (key, value) must match, while value of "any" means at least one of the header pairs must match. Headers can be constructed using a wider range of data types, integer or hash for example, instead of a string. The headers exchange type (used with the binding argument "any") is useful for directing messages which contain a subset of known (unordered) criteria.
