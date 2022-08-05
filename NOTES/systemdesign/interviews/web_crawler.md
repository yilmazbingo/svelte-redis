- are we designing entire app or just a few websites

         entire web. bilions of pages

- crawl how often

            whole thing should be updated every week

- we need to check pages we have crawled before to see if they have been updated, right?

            yes

- Do we need to store a copy of every page as we go? Like does it include images and everything?

            yes we need to store at least html. for now I do not care about the iamges but it would be nice if your design could be extended to handle them later.

- What about dynamic content? Stuff that rendered client side

        good to ask about that. but lets set aside for now but if your design can be extended for it

- what is the main purpose of this crawler

        we are building a search engine. that is why I am mainly concerned just storing the text for now.

## DESIGN THE SYSTEM

- Basically webpages are vertices on a directed graph. and the links between them are edges of the graph. Fundamentally this is a graph traversal problem.

        right. what kind of traversal would you do here?

- the choces are bfs and dfs. well the number of links on any one page are finite so that represents bfs but the depth of the internet is pretty much infinite. so bfs is only trackable solution here.

- BFS works starting at some page, you go through every link on the page and kick off the processing of each link to some other process in the name of scalability and then each link on child nodes are processed working your way accross the graph from left to right. as opposed to dfs where we would follow one path all the way down to the end and then back up and follow the other path all the way down to the end and so on and so forth. the problem is that following any path all the way to the end would take pretty much forever on the internet. So `BFS` is usually the way to go, and this seems like no exception.

        now scale this to billions of web pages

- so we need to start with the list of the URL's to crawl. we have to start somewhere. now way back in the beginning of the web, web masters would submit their domains directly to search engines so they would be crawled and I would guess that is what seeded this along with the sidemaps on those sites. even today, people can submit sites via Google webmaster tools. Google Webmaster Tools (also known as Google Search Console), is a powerful platform that website owners can use to monitor how their site interacts with Google. So there are some process to directly add new URLs that have no inbound links at all into this list of URLs to crawl. `An inbound link` is a link coming from another site to your own website.

        That could be a pretty big list

- it is not going to fit into the memory on a single host or anything like that. we will probably need to hash each urls that comes in and dispatch it to a list on one of many servers to scale that up.

- then we will have another distributed system of some sort that actually downloads all of those urls and store their contents into some truly massive distributed storage solution. some sort of simple object store will do where the key is just the url and the value is the stuff that was downloaded. Something like google cloud storage should fit the bill. or amazon s3. Designing a distributed storage solution is another design problem. next we will extract all the links within that page and crawl them in turn BFS like. saying is easier. there needs to be some way of normalizing those urls. there is the whole `http` versus the `https`, relative links, trailing slashes. In the end, we need some canonical URL that we can resubmit to the crawler. there are also links that we might want to explicitly exclude like known malware sites or people hosting prohibited content and stuff like that. so some sort of filtering will probably also be needed. If a URL makes it all the way through this and it goes back into the distributed list of stuff that needs to be crawled. Specifically, that will be a first in first out queue sort of thing. A big distributed linked list would do fine.

        why linked list not an array

- these urls are strings and we dont really know ahead of time how much memory a certain number of URL's will take. Using arrays mean we have to pre allocate space but we cannot know how many elements will fit on a given server ahead of time.

        You could have array of pointers to strings, right

- it does not really help. you still have to know how many strings will fit into memory and you dont.

        So is this list really just in memory? What happens if one of your servers lost. do we just lose that part of the internet.

- arguablly that will be ok because next time you run the crawler, that will pick up. simplicity and lower costs might be a reasonable trade off to make.

        let say it is not. too many people will freak out if their webpages is not crawled quickly.

- we need some sort of distributed persistent list. in distributed storage or maybe you could have hot standbys for each server that handles the fiven bucket in your url hashing. as long as they are in different data centers, the risk should be low or you could do some hybrid thing between the two ideas.

        the problem of duplicate content? how would you avoid processing copies of the same page that are under different URLS.

- we could compute some sort of hash or check some or something on the content after it has been downloaded then we store every hash value that we have encountered somewhere. so before we move from the downloader to the url extractor, we see if that page's hash value has been seen before. if same hash values, we have to compare two pages character by character to ensure it is not just some random hash collision and really are identical. Also, we have to store the url that hash value came from so we can retrieve that if need be. If many pages are linked to the same url, we do not want to crawl that URL every time it is linked, only once we will do right. Lets also keep a distributed database of Urls that we alread processed. the URL filter will also check against that to ensure that we havent already submitted that URL to the crawler. or maybe we can do something clever in the URL queue to ensure that we dont queue the same URl twice that can include like a hash map in addition to the queue to let us check against the URL's that have been processed already. But that is also another big distributed system.

       how to avoid bringing sites down by crawling them too fast? a lot of web servers cannot keep with us if we just hit them with a request

- SOm sort of time delay has to be baked in between calls to any given site, right?

        right. how would you do that

- details of page downloader: Obvioulsy that is gonna be running on a huge fleet of servers, each running a bunch of threads to download pages and hash them and store them in parallel. so maybe we hash urls to download to individual servers like we did for a queue and we do this hashed on the domain names so that all the download requests for a given site end up on the same server. that server can maintain a thread for each site that runs in paralled with the other sites that is taken care of with a time delay between each hit on a given site.

        how would you extend your system to store images

- we could extract the images at the same time we do URL extraction, but really we could just treat them like another URL to be crawled. so page downloader will just knows how to recognize an image URL and how retrieve and store images as well as HTML.

        and client side rendering

- that would go into the URL extraction piece. SO instead of just scanning HTML for URLs, we actually render the HTML on a browser and see if any new URLs are created in the process. that means building out whole other fleet of page renderers and a way to queue them up.
