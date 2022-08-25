- it looks like hash, key-value pairs. we do not refer to as key-value. Instead, `members-score`. all the members are guaranteed to be unique. every single member has a score and score is always, absolutely, always going to be a number. never a strign or anytghine else. But when we score back we will get it back as string. They can be floats, negatives.. All the different members will be ordered according to their score. Score do not have to be unique.

Because there is so much stuff you can do at the sorted set, there is alot of different commands

`zAdd(score,member)`
score is inserted first.

## Use cases:

- tabulating `the most` or `the least` of a collection of hashes.

Think amazon selling shoes. Every shoe that we have, we create a separate hash. we want to apply ordering. maybe the shoes that have the most reviews, or ratings or purchases. we might want to list out to users the shoes sorted by which have the most reviews or ratings or the most purchases. For each different attribute, we would have a separate sorted set. then we just apply `zrange`.

- Creating relationship between records, sorted by some criteria.

In this case imagine you have book selling app. there might be list of authors and books. Maybe two or more different authors wrote a book. each auther and book got hashed. now we need to create a relationship. in addition to that, we might also want to order this relationship based upon a number of reviews.
