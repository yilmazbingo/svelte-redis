- Design a url shortening service. we are talking about bitly. So what kind of scale are we talking about here?

        millions of redirects every day. we dont want to make any design decisions that might limit us later. so assume million of urls as well.

- Any restrictions on the characters we use? Symbols might be a little too hard for people to remember or type

       It is good that you are talking about usability and the customer experience. Capitalization would be pain as well because user might mistake "I" with lower case "L" and "0" with capital "O". This base58.  Would that limit you too much. Does that give you enough characters to work with?

- How short is the url

        the shorther is better. how many characters do you figure you would need?

- lowercase chars and numbers are easy to remember but that makes 36 characters. Basically we have base 36. 36^6 about 2 bilion urls.

- How about vanity URL's. can people specify their own URL if it is available.

        That would be nice to have. Might be something only registered users or a paid user get

- Do we let them edit and delete short url's once they created?

        well if they have an account, sure. we dont want people editing or deleting other people's url.

- How long to these short urls last for?

        well forever. we do not want a bunch of dead links out there five years from now?

## DESIGN THE SYSTEM

we need to let people to add new url's to the system.

     longUrl + their Id to edit it later

- do you wnat me to login the user login system as well?

\nope

- what happens someoene else already shortened the same url earlier? Who owns the edit in this case?

  Do we even need a ownership?

- I suppose not. we could just generate another short url in that case and let multiple people have their own mapping to the same long url.

  it is goot time to talk about how does short url generated?

- just convert the original url to base36 encoding. so every long url gets some sequential ID number in our system and we conver that id number to base 36, so we could have same url with different ids and that works. this is better that using hashing functions since the same url would result in a hash collision.

  ok what is the data schema?

- we have an api to post a vanity url where the user specifies that it redirects to. thsi requires the user.id. it just returns a status with might fail if the vanity url thay want is already taken. then registered users can update the url for a redirect by just providing the previous long URL and the one they want to change the link to. they can also delete a given mapping. People might forget what their short url is, so we need an api to retrieve an existing one. you need to be registered user. finally main thing, the actual redirection: when people visit the shortened url, we will need to issue a redirect.

  tell me more about the data schema?

- id, shortUrl,longUrl userid

301 is permanent redirect, 302 is temporary redirect. which one do u want? the browser is allowed to cache the 301 but 302 means it has t hit our system every time. assuming that we want to minimize the load to our system, 301 is right decision.

if the user wants to edit their short urls, it might take more time than usual for browser to pick up the change because browser has the old one cached. Also, if you want to offer users metrics on how often their URL is getting hit, 301 would mean we would not necessarily see every hit from the client. So if you want analytics as a feature later on and a smooth user experience for editing urls, 302 is better choice.

- If your service generates 1000/s calculate how many years need to exhaust the combination of numbers. if you are doing more requests per second, then you need to increase the number of characters.
- database key=>value= tinyUrl => longUrl. generate the tiny url and check the database. If it does not exist, save it but if 2 users get same tinyUrl and this does not exist in db, they will both the get the same tinyUrl and this will be saved in db twice. To prevent this we use `putIfAbsent`. this works well with SQL dbs.
