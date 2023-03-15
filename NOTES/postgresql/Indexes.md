postgres stores records inside of individual blocks, inside of a heap file. Maybe in Block-0 5 people, in Block-1 5 people

`SELECT * FROM users WHERE username-"Yilmaz"`

the importants is when data is inside of a file on your hard drive, postgres cannot just examine that file in place. In order to take a look at the different users, we have to first load these users up into memory. any time we are loading up information from our hard drive over to memory, that has a relatively large performance cost. whereever possible, as db engineers, we try to minimize the amount of data that is being moved between our hard dirve and memory. then we scan it. this `full table scan`. in some sceneraios full table scan is a good choice. if we could avoid we should.

## What is an index

we need to query user without having to load up all those records.

`Index` is a data structure that efficiently tells us what block/index a record is stored at.

Steps to create index

1- decide which column we want a fast look up. in our case is "username". you could have multiplel
2- we take a look at user table, in other words heap file, for every single row, we extract the "username" and record block and index of that user.
3- Sort names in index
4- turn index data structure into a tree data structure
5- add helpers to the root node. add a condition to query left or right. "Alf"<=usrename<"Nancy go to left

## Create Index SQL

    CREATE INDEX ON users (username); // we did not provide a name. users_username_idx will be assigned
    CREATE INDEX put_name_here ON users (username)

    DROP INDEX users_username_idx

go to schemas, users table and find the index

## Bencharming query result

EXPLAIN ANALYZE SELECET \* FROM users WHERE username="yilmaz"
