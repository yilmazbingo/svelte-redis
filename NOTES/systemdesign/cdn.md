CDN's allow me to distribute the serving the some of this data globally, from local sources. So it is geographically distributed fleet of servers that are serving mostly static data from your website, usually.

We can host images, htmls at `edge locations` that are phycially located closer to the end user. the idea is if I have a user in Japan, I might have a set of CDN servers, edge locations in Japan, that would serve those static resources to them. and CDN handles all the complexity of keeping that copy out in Japan,synchronized with what ever my master copy is maybe in USA. It does not have to be just static content, sometimes they offer limited computation capabilities as well. there are edge devices out there that can do stuff, for example apply machine learnign models locally throughout a CDN.

- CDN is very expensive. designing cdn for Youtube will be very costly.
- Amazon has AWS cloudFront cdn service

- Indirect benefit is you see reduction in load of your main server. so users who are requesting to the main server will get response faster.
