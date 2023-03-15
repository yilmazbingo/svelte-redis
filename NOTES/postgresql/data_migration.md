imagine we have `posts` table with "id,url,lat,lng". years after we have been populating this table, we decide to change the "lat,lng" into "loc:Point" field.

- we coult create an empty field as `loc`. then copy all the "lat,lng"

- Schema migration is about adding columns, removing columns, adding tables, removing tables and so on. Adding column "loc" and dropping columns "lat/lng" are part of schema migration. Copying lat/lng to loc is not about changing the structure of our database in any way. Instead we are talking about moving data around between very different columns. this is a `data migraion`

## Dangers around Data Migrations

It is not a good idea to do schema migration or data migration at the same time.
1- we should not execute all steps in one file:

    Migration #4

    - Add column "loc"
    - Copy lat/lng to "loc"
    - Drop columns lat/lng

break about migration file into 3 different separate files.

- whenever we run a migration, it is very common that to place the migration or execute it inside of a transaction. However once we start running migration inside the transaction and simultaneously stary copying data around inside that transaction or that migration stuff starts to get really interesting. while we are copying data which might take hours, we might still have our api server which accepts posts with "lat/lng" and those additional posts will be show up inside the transaction. when we merge the transaction onto the table, we will lose those addional posts with "lat,lng" and in "loc" I will have `null`

That is why we need to separate the migraion files.

1- Add column "loc". initially allow `null` values

then deploy a new application server that will write values to both "lat/lng" and loc

2- go through all fields and copy the "lat/lng" onto the "loc". this does not have to be in the form of migration. you could write a script file.
3- update aplicaton server code to only write to loc column
4- drop columsn lat/lng
