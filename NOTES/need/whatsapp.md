1- what is your user base: how big is the app.
2- last-seen feature or delivered or not
3- send/receive messages
4- supporting sending media messages
5- do we need to encrypt our messages. end to end encruption
5- do we need to call telephone service, audio call or video call
7- can user use phone number
8- push notifications when user not online
9 user should be able to recive to messages whne it comes to online
10- analytics and monitoring is essential of system design.
11- add web support for whatsapp

- Non functional Requireements
  - service should be highly available, fault tolerant
  - scalable
  - minimal latency
  - consistency.
  - durability. we should be able to see the messages after 2 months.

what is up uses client-server archtitecure. in peer-to-peer both nodes should be online in order to receive the message.

## APIS

- Register Account Api (apiKey, userInformation)
- Validate Account(Api Key, userId, validation code)

- Initiate Direct chat session (Api key, userId, userId2nd,handshakeInfo). this will return sessionId
  handshakeInfo is used for end-to-end encryption.
- sendMessage(apiKeys,sessionId,msgType,msg ) => returns messageId
  `msgType` could be data message or status message
- readNewMessages(ApiKey,sessionId,lastMessageId)

- initateGroupChatSession(apiKy, groupInfo)
- addUserToGroup(apiKey, userId, groupId) onlyAdmin can call both
- removeUserFromGroup(apiKey, userId, groupId)
- promoteUserToAdmin(APIKey,groupId,userId)

User will always to the `Routing Service` which is kinda gateway between microsevices. Whatsapp will create `websocket` connection between user and routing service. the same websocket connection will be used to make all those api calls.

## User Registration Service

LB connects to app servers which is connected to distributed cache (this is connected to db which is sharded by the userId) and `sms gateway`. when user first sends request to register, its information with the randomluy generated code will be saved to the db. then app server will send this code to the `sms gateway`. once the user gets this code, he will send that code to the `validate account` api. this api will come here and make a request to app server of this microservice. app server will see if the code is match or not. if code is valid during the validation time(it gets saved in db), `validate Account` service will call the `user` service to create an account there. If the `user service` detects that it is an existing user, that user will be updated with the new user token and new device.

## Groups Service

Database schema will store
Group(groupID) and Group Membeers(pk is groupID and sk is userId). both those tables will be sharded by the groupID. That means in one partiaon, we will have data for all the groupID and its members on another table in the same shard. Lookup is very fast.

## Sessions Service

1- Private Chat Sessions: sessions between two users

2- group chat sessions:

here db is sharded by the session Id not userId. In a group chat, if you have 10 people, you need to query all the dbs to find the userids if db was sharded by the userId

## Fanout Service

when message goes to sessions service it will pass the message to the `fanout` service. if message needs to be sent to one user, fanout will direct the message to the user. if the message is for gorup, `fanout` service first queries al those memebers and then sends the message to the Rotuing Service and then to the users. if one of the users is offline, routing service will return `user not found`. In this case `fanout` sends a push notification to the user using the push Notification service. when the offline user become online it will see the notification, then will connect to the Routing service which will communicate to session service which will visit the fanout service. it will get the all session id's after the last seen one. then since the offline user saw the saw and read the message, this will be sent to the routing service to sessions service which will update the db.
