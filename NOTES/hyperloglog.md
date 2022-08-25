- it is a data type. It has nothhing to do with the logging. it is used whenever we want to keep track of the uniquness of a collection of different elements and specifially the approximate uniquness.
- algorithm is used for approximately counting the number of unique elements
- similar to a set but does not store the elements

## there are only two commands

`PFADD` it is goign to add the string into `hyperloglog` structure. when we add the string, it does not truly get stored inside the hyperloglog. Instead this thing has very complex algorithm inside of it that looks at the string, does some parsing on it, does some very complex math and kind of remembers that string but it does not actually store it, per se. imagine it is like a set and that is going to keep track of a unique set of items but it does not actually store any true values inside of it.
Whenever we call `pfadd`, very critically, if we have not added the string before, we will get back 1 otherwise 0

`PFCOUNT` allows you to look at the hyperloglog and get approximate count of the number of unique elements that have been added.

## Use cases

inside of our app we are tracking number of views that each item has. we really want to make sure that one user can only contribute one view per item. we need to track every view per user, per item in some way. we need to make sure that every view is unique.

One way of doing is adding it into the set. one set for every item. `views:5` stores the usernames that has viewed the item. This might track all different views for item 5. There is a big downside to it. each username will cost about 40 bytes. if an item has a million differet views will cost about 38mb for one single item.

But there is one small downside that you need to be aware of. `approximately counting`. Because the hyperloglog does not actually truly store these individual items, it only stores a kind of approximation or representation of what it thinks it might have seen in the past, throught the use of hyperloglog.
