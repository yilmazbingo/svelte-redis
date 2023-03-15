## Rules

1- each user can like a specific post a single time
2- A user should be able to unlike a post.
3- Show how many people like the post
4- show maybe top 10 most popular people
5- Allow a user to dislike a post

#### Wrong approach

we should not add a column of likes to our posts table.

- no way to make sure a user likes a post only once
- no way to make sure a user can only unlike a post they have liked
- no way to figure out which users like a particular post
- no way to remove a like if a user gets deleted

## Create a like table

id user_id post_id type

- type is an additional column for reactions. like, love,care,funny,sad

combination of UNIQUE(user_id,post_id) should be unique. a user should like post_1 only once. When user unlikes a post, we find that row with (user_id,post_id) and delete it.

`SELECT COUNT(*) FROM likes WHERE post_id=3` # of likes on post with id=3
`SELECT username FROM likes JOIN users ON users.id=likes.user_id WHERE post_id=` username of people who like post with id=3
`SELECT posts.id FROM posts JOIN likes ON likes.post_id=posts.id GROUP BY posts.id ORDER BY count(*) DESC LIMIT(5)` ids of top 5 most liked posts
`SELECT url FROM posts JOIN posts.id=likes.post_id WHERE likes.user_id=4` url of posts that user with id 4 liked

## Like Post or Comment

allow a user to like a post or a comment. there are 3 possible solutions

1- Polymorphic Association

id user_id liked_id liked_type

- liked_type is post or comment. instead of post_id we have `liked_id` (integer column)

Polymorphic associations are not recommended because of `liked_id` column. To form associations between tables, we create `foreign key` which are treated differently by postgres. it first goes to the related table and check if the id exists. if not, it throws error. this check gives us data consistency inside our db. Unfortunately we cannot create `liked_id` as foreign key column. because when we create the table, we cannot tell postgres this will be the foreign key for posts or comments table. we only know later on when we actually insert a row into the table. `liked_type` column is solely for the devs not for postgres. postgres cannot use this column in any way, shape or form to automaticall resolve a foreign key or figure out where this is a reference to. we lose out on this entire idea of data consistency. we can just add `liked_id=10000` and we can validate if that comment id exists or not.

Particularly ruby on rail projects use polymorphic associations.

https://stackoverflow.com/questions/922184/why-can-you-not-have-a-foreign-key-in-a-polymorphic-association/75540705#75540705

2- Alternative to Polymorphic Association

- instead of this

        id_of_like    user_id     liked_id   liked_type
         1            12             3          post

we will have

        id_of_like    user_id     post_id   comment_id
            1            12          3          NULL
            2            1           NULL        1

`image_id` and `comment_id` will be assigned as FOREIGN KEY
we might want to add in a little bit of validation to make sure that whenever we insert a row, either the post_id or comment_id is defined. we could have a developer who writes bad code or we could have an administrator who is trying to manually inssert records using PG admin. we make sure that we never get in a scenario where we accidentally have both a post_id and commnet_id, or neither. we could use a check constraint

Add CHECK of
(
COALESCE((post_id)::BOOLEAN::INTEGER,0) +
COALESCE((comment_id)::BOOLEAN::INTEGER,0)
)=1

The downside is that to write out a validation rule around this, we end up writing a complicated SQL.

- `COALESCE` looks at different arguments it is provided and it is going to return the first value that is not `NULL`
  SELECT COALESCE(NULL,5); //5
  SELECT COALESCE(10,5); 10

- we are going to use this approach because we dont have different kind of likes, "love,applause,etc" to store.

3- we create post_likes and comment_likes tables. if we liked a post, we add row to post_likes
if we allow user to have liking many things, we end up having to create many different kinds of tables
