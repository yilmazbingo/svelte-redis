we create a transaction with just

`BEGIN;`

As soon as we open a trasnaction, our database is creating a separate workspace of data just for connection1(our connection). we are making a copy of db over the isolated workspace. Behind the scene we are not copying any data whatsoever. Now connection1 is the only connection that can access any data inside the workspace. we can make changes in this isolated workspace and no other connections can see this change, whatsoever. If I run this at connection1 tab

    UPDATE accounts
    SET balance=balance-50
    WHERE name="Alyson"

if in this current tab, I run

    SELECET * FROM accounts

i can see the updated data. if i run the same query from different window, I will not see the updated data.

similarly in connection1

    UPDATE accounts
    SET balance=balance+50
    WHERE name="Gia"

Then we have to merge this changes to the main database.

1- we can run `COMMIT`
2- if you do not want to save the changes, you run `ROLLBACK`. This will delete the separate workspace

during the any trsanction in connection1, if you get an error, that workspace enters in an aborted state. you must `ROLLBACK` to exit the aborted state
If we lose the connection, postgres will automatically delete everything

https://stackoverflow.com/questions/974596/what-is-a-database-transaction/75574245#75574245
