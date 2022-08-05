instead of using a formal database, just throw all of your raw data into some big data repository somewhere, some big distributed file storage system. `aws s3` service.
Something however has to impart structure upon that structureless data. So in the case of AWS, they have `amazon glue` whose job is to crawl that unstructred data in your data lake
`Amazon Athena` lets you query the data with sql commands.

- you dont need to make any design. Amazon worries about the details
- you still need to think about partitioning. you dont really want to throw everything into one big bucket. if you can organize a little, it helps you alot. for example, if I am storing bunch of log data, it would make sense, if i know that I am querying that data by date, maybe looking for the performance in past day. SO i might want to partiion this data by `date`.
