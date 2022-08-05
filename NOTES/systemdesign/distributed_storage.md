- services for scalable, available,secure, fast object storage
- Use cases, data leaks, websites, backups, big data
- high durable. amazon s3 offer 99.9999999 durability

## HDFS architecture

Hadoop distributed file system

- files are broken into "blocks" replicated accross your cluster. so we have copy of each block

- replication is rack-aware which means we are not storing the backups of your blocks in the same rack.

- how do we know where to get the data? it has a `master` node knows where the blocks of that file are stored and where to get them from. `Name Node` or `Master Node` coordinates all those operations. Client will hit the name node and say I want to get this data. Name node will give the nearest replica to your client server.
