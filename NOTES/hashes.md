- Hashes means objects in js
- in hash tables, we are not allowed to have Deeply nested data structures, neither obj nor arrays. allows just plain object
- some client libraries return array of valuew and you have to assemble them into an object

`HSET firstObj name "companyName" age 1945` instead of "OK", inidcation that we have updated 2 key value pairs. IF we run it again we will get 0 because no update
`HGET firstObj name ` similar to graphl. we need to mention the fields
`HGETALL firstObj ` will return entire hash. actually it returns array of value in our client. it depends on redis client. Rbook jsonize it
`HEXISTS firstObj name` it it exists it will return 1 otherwise 0. redis does not check for truthness. if `name=false` it will count it as value. because it only checks for the existence of the key
`DEL firstObj` clears the object
`HDEL firstObj name` returns 1

Cannot read properties of null (reading 'toString')

`owner: null`

because null canot be called toString
`null.toString` gives that error. soludtion is

`owner: null || ""`

- If you look up the key that does not exist, redis does not return null.
  `const results = await client.hGetAll('car')`

  if key does not exist, it returns {}. so this check will not work

  ```js
  // this check will not work because it will be {}. Boolean({}) will return true
  if (!car) {
  	return;
  }
  ```

  Solution is

  ```js
  if (Object.keys(car).length === 0) {
  	return;
  }
  ```
