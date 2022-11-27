Netflix operates in two clouds. AWS and Open Connect. Both clouds must work togethere seamlessly to deliver endless hours of video. Anything that does not involve video streaming is handled by AWS. Video streaming is handled by Open connect. Open connect is owned by netflix. The Open Connect network shares somecharacteristics with other CDNs, but also has some important differences

- Open Connect
- backend
- clienta: consoles, smart tv, almost everything

## ELB

It uses Amazon's elastic load balancer. Load is balanced across zone first and then load is balanced accross the instances: `Two Tiered Balancing Scheme`. First part consist of basic dns-based `round-robin` load balancing. round robin is the most widely deployed load balancing algorithm. Using this method, client requests are routed to available servers on a cyclical basis. Round robin server load balancing works best when servers have roughly identical computing capabilities and storage capacity. when request hits the LB, request will balance across Z1,Z2,Z3 zones using `round-robin`. Zone is kind of logical grouping of servers there could be 3 different zones in US. The second tiers is the array of load balancer instances which does round-robbin load balancing on the instances to distribute the requests on accross these instances.

## Videos

Creasing video requires alot of preprocessing, finding errors, converting the video into different resolution, different format. this process is called `transacoding`. each platform needs different video resolution. original videos are very large, 50 gb

Netflix also creates file optimized for different speed of internet. `adaptive bitrate streaming`. Netflix has to create multiple copies of the same movie in different resolutions. Netflix creates multiple replicas (approx 1100-1200) for the same movie with different resolutions. These replicas require a lot of transcoding and preprocessing. Netflix breaks the original video into different smaller chunks and using parallel workers in AWS it converts these chunks into different formats (like mp4, 3gp, etc) across different resolutions (like 4k, 1080p, and more). Those chunks will be placed into a queue, and these chunks will be picked up by different workers, Amazon EC2 workers. those workers will convert those chunks into different formats with different resolutions. Now we need to push those to the each Open Connect server.

authentication and list of videos are handled by AWS. once you hit the play button, application will figure out the best open connect server and Open connect server will start streaming the video to the client. Client also smart enought to check the best available OC server around to get the best video quality. Recommendations are done by AWS machine learnign algorithm.

## ZULU
