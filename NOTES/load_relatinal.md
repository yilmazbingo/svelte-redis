1- First way is taking an array of ID's and somehow loading up other data from redis using those ID's.Create a simple pipeline that does a bunch of `HGETALL`. This has a downside. it works but takes two separete requests. one request to fetch all the relevant keys out of our sorted set and then we had to make a request to fetch all the releavant keys out of our sortet set and then we had to make a second request to do our each `hgetall` calls.

2- take array of ID's and somehow get the related hashes out of redis is by using another command `SORT`. This is a clever solution. we are going to apply it to the other little kind of piece of data, `most views`

`SORT` command, beyond just sorting data it also allows us to join together data from different sources into one single structure.

## SORT COMMAND

- It is used in three data types: sets, sortet sets and lists.
- calling `sort` is misleading. we do not always use `sort` command for sorting data.
- In the world of "sort" command, a score has a slightly different meaning, it refers to something different.

an example lets say we have table of books

**ID** **TITLE** **YEAR**
1244 GOOD BOOK 1950
1245 BAD BOOK 1982

The question is "list the id of each book and sort it by year published".

- the only thing will be included in this results set would be the list of id's for each book.

when added above table into this: https://rbook.cloud/sheets/7a93d4e6e789cd2a

```js
HSET books:good title 'good book' year 1950
HSET books:bad title 'Bad book' year 1930
HSET books:ok title 'OK book' year 1940

ZADD books:likes 999 good
ZADD books:likes 0 bad
ZADD books:likes 40 ok
```

then i run this command `SORT books:likes`, I get this error

        `Error: ERR One or more scores can't be converted into double`

- Whenever we use the sort commands on a sorted set, `sort` is going to operate on the members of the sorted set not the "scores". The reason we are seeing that error message is that all these members are listed out as strings and `sort` by default expects to be working with numbers. One solution is using sort command with `ALPHA`

            SORT books:likes ALPHA

Sort all the members alphabetically.

- Limit how many items you want back

        SORT books:likes LIMIT 1 2 ALPHA

skip over the first element and get me the next 2 elements.

## BY argument

`SORT books:likes BY books:*->year`

we are extracting all the members from `books:likes` sorted set. we are just gettng by hash names. then we would be inserting in this template `books:*`. for example

                books:bad->year
                books:ok ->year
                books:good -> year

it is creating a new template. then it will sort it `by` year.

## join data with sort

`SORT books:likes BY boooks:*->year GET books:*->title`

we can aapply `GET` multiple times in a single sort command.

`SORT books:likes BY boooks:*->year GET books:*->title GET books:*->year`

       "bad book"
       "1930"
       "ok book"
       "1940"

if you want id

```js
// we have to press TAB to make it one commnand
SORT books:likes BY boooks:*->year
        // # means insert whatever original member was
        GET #
        GET books:*->title
        GET books:*->year`
```
