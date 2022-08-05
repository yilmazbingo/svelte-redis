- is this the top sellers accross the entire side or broken down by category?

        it should be broken down by category and even sub category

- How up to date those results need to be?

        As a customer how up to date would u expect to be?

- Probably just once per day but more frequent would be better if ther is some huge trend or a major release that might drive some more sales,if customers can see that more quickly. i think we should shoot for a at least a few times per day but I would not necessarily expect real time results. that seems like it is introducing too much complexity.

        we do not need up-to-the-second results here. How does that influence your design?

- we can have some offline batch process that runs periodically and updates a database of top-sellers, broken down by category and just vend that data to our web servers

        that should do for this problem. what does it even mean to be a top seller exactly?

- over what period of time are we computing top-sellers? If we are looking at the top selling books over all time, we will probably just end up showing the Bible and Harry potter forever. customers want to see what is trending and popular?

        yes. how do you define trending and popular?

- we could limit the results to the top-selling items in the past two weeks or something.

        does that really generalize though? What if we are computing top sellers for some really obscure category and there are not enough sales in the past two weeks to give a meaningful result?

- You can imagine a system that enforces some minimum threshold on the number of items to consider and goes back further in time, if necessary, to hit that threshold.

        ok. that is why way of doing it. Let's say you have to go back five years to hit that threshold. Should a purchase 5 years ago carry the same weight?

- maybe we look at all sales but just give them less weight over time. so older purchases count less than new one.
- what kind of scale are we looking at here?

        we want to feature it on every category page and even on the home page, potentially. we are talking about thousands of transactions per second

## DESIGNING THE SYSTEM

- we want to surface new trends quikly, I think we need to weight recent purchases much more heavily. some sort of exponential decay where

      e ^ (– k t)

decay is opposite of growth. (k) is the decay rate which is a hyperparameter for the system

- You might some sort of repository of purchase history information and we just need to tap into whatever that is.

        how would you store and query massive amount of transactions?

- even if you have some massive RDMMS. we are asking it to retrieve every purchase ever broken down by category. If that is the case, we might have our own replica of that data warehouse just to isolate the impact that our system has. if I were starting from scratch, I might go with data lake approach where the data is stored in AMAZON S3 or someting partitioned by category in our case. and then we could throw somehting like Athena at it run SQL queries on it at massive scale.

- I need a big offline job that recomputes the top sellers a few times a day. Analyzing that much data over so many different categories is a pretty tall order. so we need a system that scales well, Like Apache Spark which lets us distribute the processing across a whole cluster and with reduncancy built in. it also gives us off the shelf monitoring and scheduling

        ## APACHE SPARK
         Apache Spark is the leading platform for large-scale SQL, batch processing, stream processing, and machine learning. Apache Spark is a data processing framework that can quickly perform processing tasks on very large data sets, and can also distribute data processing tasks across multiple computers, either on its own or in tandem with other distributed computing tools. These two qualities are key to the worlds of big data and machine learning, which require the marshalling of massive computing power to crunch through large data stores. Spark also takes some of the programming burdens of these tasks off the shoulders of developers with an easy-to-use API that abstracts away much of the grunt work of distributed computing and big data processing.

         Jobs that can run without end user interaction, or can be scheduled to run as resources permit, are called batch jobs. Batch processing is for those frequently used programs that can be executed with minimal human interaction. A program that reads a large file and generates a report, for example, is considered to be a batch job.

        Is there anythign simpler??

- this exponential decay thing, is that we cannot just do things with straight up SQL queries. at least not easily. I think the flexibility spark gives you is worth hassle of maintaing a cluster for it. You could also run it on Elastic MapReduce to lower the maintenance.

        tell me more about what this spark job does it exactly.

- It will need to extract every purcahse going back to some upper limit, whatever length of time we need for adequate coverage in each categories. all we need are itemID, the category of the item and when it was purchased. that is nice because we do not need any sensitive personal information. we dont care who bought the stuff just when it was bought. so the Spark job we will group it all by category and for each category go through each purchase, adding up some score for each item after applying exponential time decay to each purchas. when we are done, we just sort each category by the total score of each item and write out to results to some top-sellers data store.

        tell me more about that data store

- we are not talking about massive amount of data here. we probbaly only care about the top 100 items or so per category. So all we need to store is 100 item identifiers for every product category. while you have alot of product categories it is certainly not a number in millions or anything like that. we could probably fit all that into a single server with a standby ready to go if it fails. the problem is how many reads that database will have to take from the website, you said it could be thousands of requests per second. so one database host can handle that. so we would have to have some sort of a caching service

        that works if cache is warm

- top sellers database will get hammered when that cache first starts up. so something more scalable for the top sellers database might be desirable. it jsut key-value data really, the list of top item ID's for a given category ID, SO any nosql sort of data store would do there. something serverless like dynamo db so the maintenance of ti isnot really your problem.
