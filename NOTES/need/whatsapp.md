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

LB connects to app servers which is connected to distributed cache and `sms gateway`. when user first sends request to register, its information with the randomluy generated code will be saved to the db. then app server will send this code to the `sms gateway`. once the user gets this code, he will send that code to the `validate account` api. this api will come here and make a request to app server of this microservice. app server will see if the code is match or not. if code is valid, `validate Account` service will call the `user` service to create an account there. If the `user service` detects that it is an existing user, that user will be updated
