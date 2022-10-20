- a website repating a keyword should not rank as number one for that. we should talk about other signals might predict relevance. a reasonable research result is a page that gives the searcher the information they were seeking.

        how do you measure that?

- we could look at things like whether the user returned to the search result after viewing a page that was presented to them. that might mean that they didnot get what they were looking for the first time. if they do not click any search results at all, that might mean they were particularly unhelpful. These sorts of implicit signals can be inaccurate though. I mean someone may have just gotten distracted and left for all we know, but over enough people, it should provide some data.

# DESIGNING THE SYSTEM

- How to identify documents relative to a keyword. The basic search algorith is `TF-IDF= Term Frequency / document frequency`, where we take the frequency of a term withing a document and divide it by the frequency of the term over all the documents to get a measure of how "special" that term is to that document.

         can you think of any problem that might present in the context of searching the entire web?

- At least two come to in my mind. Just load up a page with the keyword you want and make sure it is relatively obscure keyword and you win.
  the other problem is computing the denominator. Computing the document frequency across entire internet seems like intractable problem. or at least one that would require so many resources.

- Ultimately we need some sort of `inverted index` that maps keywords to a list of relevant documents sorted by some measure of relevance. What might that measure be?
  We all heard of "Page Rank" it is how Google started. That is based in part on `backlinks`. They were using links to a page, and the anchor text of those links as measures of a site's popularity. Besides `backlinks` we need those:

  Obviously the words on the page but there might be other signals that give us hint on how much to weight those terms. Like what position within the document it's in. If it is mentioned right at the beginning, then that is probably more relevant to the page. Words that appear in bold or in a big font might also be important. The title of the page is also a big signal. words in the title should count for alot. That is something that could be gamed but if the title is that is presented to user in the search results. it is kinda has to be relevant to the page.
  The lenth of the document might also be a signal, or maybe more genearally how often the term appears in the document, which is `term frequency`.

the idea is to make sure that we dont rank pages that just have the keyword on it and nothing else. There are meta-tags but seems very prone to gaming. All those feature could be fed into a neural network that learns how to rank documents based on user interaction with search results.

- we will start with the repository of web pages that came from our crawler. Presumambly this is compressed somehow. Now we need to build up an index that maps keywords found in each page to the document it was found in, its position within the document, whether it is a header or a title and the other signals. basically this is a big key/value object store where the keys are keywords or more compactly keywordId. This db could be distributed. Like BigTable made for Google.

        Bigtable is a fully managed wide-column and key-value NoSQL database service for large analytical and operational workloads as part of the Google Cloud portfolio.

- In the end we want an inverted index that maps keywords to a ranked list of documents so if we can keep that sorted by the keyword as we go somehow that will save us some trouble but we could do it later if we had to. as for the indexer itself, I think that is why Google invented MapReduce in order to paralleze the processing of coumments in the web repository. A more modern alternative would be Apache Spark, which is faster and gives us flexibility and built-in tools

        How do we extract keywords from documents? Do we just build up a map of every word in the document and go from there?

- We need to deal with the capitalization, punctuation, spacing, synonyms, stoplists. we could also build up "N-Grams" of words that represents phrases potentially. these challenges are addressed in the process of building up a forward index that maps documents to keywords as an intermediate step.

the other thind is PageRank, we need to extract any links to other pages and store those somewhere. In a `Backlink` db. so we can later build up a mapping of pages and how many backlinks they have accross the entire web. Those links need to match up with the urls, we originally crawled, so the same logic we used to normalize URLs in the crawler would need to be applied here as backlinks are extracted.

anchor links can also matter. we could treat those as just another entry in the index, where the anchor text is keyword, and page it links to in the document. Ultimately we need databse for between two documents, so whatever computes PageRank, can add up all the links to a given document and later use a signal to our search algorithm.

so far we have 2 dbs. PageRank algorithm and Index. we need to tie those together.

disadvantage is if your data increases, you have to add a new shard to scale. Now your hashing function has to change. since hashing function changes, your data in curent shards have to move. Same problem happens if you want to decrease the data.
