- ACID is used for transactions

`Atomicity`: Either the entire transaction succeeds or the entire thing fails.
`Consistency`: All database rules are enforced, or the entire transaction is rolled back. it is about consistenly applying rules to find within the database. so, If I have a rule that says this value can never be negative, maybe account balance, and I try to make a transaction that ends up a negative balance, that transaction will be rolled back to enforce consistency. Usually when we talk about consistency outside of ACID, we are talking about how quickly can we get our data back after we have written it. Eventually consistent database means it takes time for changes to be written throughout the system and data that you write might not be read back immeditely. In big distributed databases wheere data needs to be replicated accross many different servers, eventual consistentcy might be a trade-off that you need to make. So consistency can mean two different things.
`Isolation`: No transaction is affected by any other transaction that is still in progress. So if you have two different commands running that are fighting over for the same data, one of them is going to win. While one command is writing out some data, another command cannot modify that data while it is being written.
`Durability`: Once a transaction is committed, it stays, even if the system crashes immediately after.

## CAP Theorem

A distributed system is a network that stores data on more than one node (physical or virtual machines) at the same time. Because all cloud applications are distributed systems, it’s essential to understand the CAP theorem when designing a cloud app so that you can choose a data management system that delivers the characteristics your application needs most.

the theorem talks about the trade-offs between consistency and availability that you have to make if your system ever suffers partitions.

you have a bank and have only 2 atms. you keep balance in each atm whenever they deposit or withdraw, you send update request to other and have consistent data. Your customer can also check the balance. you also have an invariant, you never want the balance to get below zero. you store the account balances in atms and each atm has a copy of the acccount balance. in 3 ways you might have issus:

1- your atm is not working but other is working. you just put a sign that out of order
2- yours is working but other is not working
3- they both are working but there is a network problem and they cannot talk to each other.

Distributed system has suffered a `partition` in this case. what doeS ATM do next when this partition happens. this is the design decision that the `CAP` theorem talks about. the system has to make a choice. it can either be `consistent` or `available` but cannot do both. If you haVE consistent design, atm would not process your request becuase it cannot update the balance in the other ATM. On the other hand, it gave up availability. Customer is happy because bank secures the accounts but on the other hand you might be annoyed because you cannot use anything in there. If you choose the availability, your atm would process the request, keep track of what happened and later when the partition heals, it just tells other atm what has happened but balance is inconsistent.

In the real world we can talk about degree of consistency and degrees of availability and make trade-off between. for example in partially available design

    - we can deposits
    - withdrawals no or maybe small amounts. rate limit. balance wont go negative too quickly.
    - balance info no or mark it tentative means we ara not sure
    this would stop bank balance going negative but it would still have our balances inconsistent. you have to make those decisions depends on how much complexity you want to get more high availability

sacrificing consistency is not only way we could increase availability in our system. you could add battery backups. we could have better network connection. we could buy redundant connections so that when one network conncetion fails we can just use another.

Availability, Consistency, Partition-Tolerance

- MySql is highly available and consistent. But it gives up partition tolerance: it is very difficult to partition MySql accross horizontally scaled fleets. It actully is possible in modern MySql, the truth is CAP theorem is a lot weaker than it used to be. A lot of those databases actually do a good job of giving you the best of all worlds.
- Cassandra has high availability, partition tolerance but it does not comply with consistency. Becasue that data is written that needs to be rewritten around that entire ring and that does not happen immediately. `Consistency`, if you have multiple copies of data, those two data pieces should match each other.
- Most databases give up availability. When we talk about availability in the context of the CAP theorem, it is about avoiding single points of failure that can go down. Like in mongodb. there is a primary router host. and if that goes down,there is gonna be some downtime in the time that it takes for it to elect a new replacement server to take its place. In practical, that is gonna happen very qucikly. we do have a couple of hot standbys sitting there ready to go. So as soon as the system detects that primary routing host went down, it is gonna switch over to a new one pretty much right away. Technically speaking it is still single point of failure. There is still a chance of downtime when that happens.

The thing is generally non-negotiable is the partition tolearance. we need to be able to scale these things out as we throw more and more data and traffic.

# Partition Tolerance: bolunme ayrisma

A partition is a communications break within a distributed system—a lost or temporarily delayed connection between two nodes. Partition tolerance means that the cluster must continue to work despite any number of communication breakdowns between nodes in the system.
