- youtube has alot features like recommendations, channles,ads. what features should I focus on here?

        lets just focus on uploading videos and process. how efficiently vended back to the viewers around the world.

- so we are talking about users and videos in billions?

        that is what makes it challenging. video files are big, internett connections are spotty and handling that all around the world is the real problem here.

- seems like I need to cover how to upload videos and handling the video playback all at massive scale.

# Design the System

- starting with the watching feature. client makes a request and webservers return video url and video metadata to client. metadata is name, authors, ads etc. that implies there is a `video metadata db` populated when people create videos. this must be horizontally partitioned distributed database and it might be simple key-value store. this is just for entartainment so it does not need strict ACID compliance.

- so client gets the metadata along with the stream that client side video player will display. Where does that video come from? I assume you want to avoid buffering at all cost so you want to serve that video from as pysically close to the client as possible presumably using CDN of some sort. Now the `CDN` has to get its videos from somewhere so I imagine you have a master copy of every transacoded video stored in your own cloud as well. this needs to be something really scalable like cloud storage. all we need is simple object store where a video URL points to the streaming video data. you have to have more than one copy of that video for each video. client can choose different resolution and different compression format. It is not just bilion videos, it is billions of videos encoded many different ways and duplicated out to edge locations around the world on CDN.s

        CDN is not cheap. can we reduce the cost of the system? do we always need to use a CDN?

- If you are willing to trade-off user experience with the cost, you could choose what goes to the cdn and what gets served by your own servers. You probably have your own data centers around the world anyhow. perhaps for the videos are not super popular, you could return a video stream that is hosted from your own servers instead of to a CDN.

        Have you ever heard of LOng Tail?

        The long tail is a business strategy that enables companies to make significant profits. They do this by selling small quantities of difficult-to-find items to many customers, rather than simply selling large amounts of a small number of everyday objects.

- It means that a long tail of niche interests actually makes up a large portion of the things that are consumed. So that implies that alot of video views or to videos are not popular, strictly speaking. and we end up not using CDN too much. On the other hand, I bet the vast majority of videos currently stored arent wathced at all any longer so storing those in the CDN would just be a waste. so serve only popular videos on cdn

- Maybe it is not just popularity but timeliness that matters. we need a big maachine learnig model try to predict whether a video is likely to be viwed today and pushes it to the CDN

- also location is one of the features. you might publish a video to some CDN endpoints but not others. Maybe CDN regions would have worked better. like japanese language videos.

        what happnes when you upload a new video?

- when user upload the video, metadata is dumped into the metadata data store. it is some NOSQL distributed key/value store of some sort. BigTable or Dynamo db would be fine. at the same time user uploads their original MP4 or AVI. Assuming our resources for transcoding the video are finite

        Transcoding is taking encoded (or “compressed”) video or other digital content, decompressing it, and altering and re-compressing it. For example, a high-resolution video shot on a digital camera (HD, 4K, etc.) can be transcoded into a lower-resolution format for editing; in other words, smaller files that are faster and easier to manipulate in editing software. Or video for a live broadcast can be transcoded from its original format into differently formatted streams to be delivered out to the largest number of viewers on the widest range of devices. Transcoding is a digital-to-digital conversion of one type of encoded data (video or audio) to another, often because the target device that will be used to display the content requires a smaller file size. Think about watching a feature film on a smartphone and you’ll get the idea.

- we will probably want to message queuefor transcoding requests. as soon as the raw video finishes being uploaded into some temporary data storage, this cloud storage or some sort. a message gets queued with the location of that raw video. the `transcoding fleet` which I imagine the hundreds of servers that just transcode video in parallel, picks off the next request in the queue and removes it. `amazon sqs` or something would work well for that. Once it finishes transcoding into all the various formats and resolutions needed, those transcoded variants are stored in the same distributed object store.

        What happens if user navigates to a video that has not been trnascoded yet. there would be a quite big time between metadata being stored and the transcoding finishing.

- the metadata would have some sort of ready to watch flag or something. we would not surface it until we know transcoding was done. Or maybe there is another message queue that feeds it to your search and browse systems when it is done transcoding.
