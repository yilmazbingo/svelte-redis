- cardinatility is the number of elemenets present in the set.
  `SMEMBERS` gives us all the members stored inside a set
  someitmes we might have 1000's of elements inside a set. `SMEMBERS` will gives us all the strings in one single command.
  `SSCAN` allows us to walk through all the elements isnide of sets in piece by piece we can pass `count 10` to get only 10 of them. `sscan` also have `cursorId` option. when we scan for 2 items, we get cursorId for the next page. if fetch data again with the cursorId, we would get items after those 2 that were returned previously.
