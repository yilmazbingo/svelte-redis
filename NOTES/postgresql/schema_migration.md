they are all about making very careful and well planned changes to the structure of your db. add table, change column, remove table
Lets say you are an engineer at insta and your only job is comments table. we need to rename `contents` to `body`

`ALTER TABLE comments RENAME COLUMN contents TO body`

While you make this change in production a user might post a comment for `contents` column but since you renamed it, it does not have that column name

Lesson 1- Any time that we make a change to our database, we have to synchronize that and deploy it at the same time at the same time we change our client as well. client is our api server here and we need to tell that it needs to run this new code. doing those two things at the same time hard. api update might take longer than column rename operation. sometimes when stackoverflow announce planned downtime. this is what they are doing. but amazon cannot afford to take the application down. Or you might be working with a compnay that some kind of service level agreement SLA, you might be required to keep your applicaton online for a vast majoruty of time.

since engineer caused trouble while updating the database column, now he is responsible for both api server changes and commnets table. you make changes on local machine and then make a code review request on github. this request will have only code for api server change because changes that we made on db is not saved anywhere. ebcause we we are opening the pG admin and run queries. since the db change is not pushed to the code review, who ever reviews the code will run the api without renaming `contents` column but api server is runs the query for `body` and code reviewer will get error.

after code reviewer reviewed, everything looks good. then he might want to revert api changes but he might have revert the database changes.

LESSON-2- Whenever you work with other engineers, it is extremely important that you have a very easy way to tie the structure of your database or changes to the structure of your database to your code as well.

## Schema Migration Files

it contains some amount of code that describe a very precise and very detailed change that we want to make to our database.

Migration file can be written in any language. In general it has two sections `Up` and `Down`. upgrade and downgrade

solve the issue in Lesson-1, this migration file will include code for deploy the api server change and as soon as it is done it will run all database migrations. then we will start to receive the traffic. this will reduce the downtime

there are many libraries for creating schema migration files. typeorm, sequelize, node-pg-migrate

https://stackoverflow.com/questions/974596/what-is-a-database-transaction/75574245#75574245
