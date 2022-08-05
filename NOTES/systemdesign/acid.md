- ACID is used for transactions

`Atomicity`: Either the entire transaction succeeds or the entire thing fails.
`Consistency`: All database rules are enforced, or the entire transaction is rolled back. it is about consistenly applying rules to find within the database. so, If I have a rule that says this value can never be negative, and I try to write out a negative value somehow, that transaction will be rolled back to enforce consistency. Usually when we talk about consistency outside of ACID, we are talking about how quickly can we get our data back after we have written it. Eventually consistent database means it takes time for changes to be written throughout the system and data that you write might not be read back immeditely. In big distributed databases wheere data needs to be replicated accross many different servers, eventual consistentcy might be a trade-off that you need to make. So consistency can mean two different things.
`Isolation`: No transaction is affected by any other transaction that is still in progress. So if you have two different commands running that are fighting over for the same data, one of them is going to win. While one command is writing out some data, another command cannot modify that data while it is being written.
`Durability`: Once a transaction is committed, it stays, even if the system crashes immediately after.

## CAP Theorem

Availability, Consistency, Partition-Tolerance

- MySql is highly available and consistent. But it gives up partition tolerance: it is very difficult to partition MySql accross horizontally scaled fleets. It actully is possible in modern MySql, the truth is CAP theorem is a lot weaker than it used to be. A lot of those databases actually do a good job of giving you the best of all worlds.
- Cassandra has high availability, partition tolerance but it does not comply with consistency. Becasue that data is written that needs to be rewritten around that entire ring and that does not happen immediately. `Consistency`, if you have multiple copies of data, those two data pieces should match each other.
- Most databases give up availability. When we talk about availability in the context of the CAP theorem, it is about avoiding single points of failure that can go down. Like in mongodb. there is a primary router host. and if that goes down,there is gonna be some downtime in the time that it takes for it to elect a new replacement server to take its place. In practical, that is gonna happen very qucikly. we do have a couple of hot standbys sitting there ready to go. So as soon as the system detects that primary routing host went down, it is gonna switch over to a new one pretty much right away. Technically speaking it is still single point of failure. There is still a chance of downtime when that happens.

The thing is generally non-negotiable is the partition tolearance. we need to be able to scale these things out as we throw more and more data and traffic.

# Partition Tolerance:

One or more nodes come out of communication, out of sync, how well do they recover from that?
