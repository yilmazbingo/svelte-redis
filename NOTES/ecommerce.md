- ONLY AUTHENTICATED USERS VIEW WILL BE COUNTED
- In SQL database design methodology, we first put everyting into the database and then figure out how we will query about that
- Redis Design Methodology , we first figure out what queries we need to answer, and then we are going to structure our data
- we need to store, users, sessions, items, bids, views, likes inside redis
  which of these should be stored as hashes?

  - the record has many attributes. an item has imageUrl, title,desc
  - a collection of these records have to be sorted many different ways.

  When it is not good to use Hash?

  - the records is only for counting or enforcing uniqueness
