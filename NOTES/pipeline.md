let's say you have a reqest of giving me Id's 553,601,789,419,950,15. `hgetAll`, `hSet` work on one single hash in other words with one single key. One way is

           Loop over the ID's and do a separate, `hgetAll` one by one inside a for loop. that for loop will take some amount time if we try to fetch 100 different records.

- Pipeline means take a bunch of different commands and dump them all into one single command and throw that one single,big giant command off to redis. Redis understands the idea of batchig commands together. It is going to take the big pile of commands, break them all out into separate individual ones, and execute each of them one by one.

  We might still loop over all of different id's but different is do not send the commnad just yet, set them all up but do not actually issue them. Once we finish the for loop and creates or intialize these different commands, then say "take a look at all those commands that we had queued up and now in one big batch
