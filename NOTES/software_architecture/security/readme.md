## SSL/TLS HTTP+SSL=HTTPS

htttps protocol initiates SSL protocol. When server gets a request, it will initiate a SSL protocol. Server will respond with the public key in a certifacate so that client can verifiy that public key belongs to that certificate. through certificates, servers can transfer its public key to any client.
Second step, client generates a symmetric key (secret key). client encrypts the symmetric key with the public key of the server. this step is part of the ssl protocol. this symmetric is transferred to the server and server uses its private key to decrypt the symmetric key. server sees that message was encrypted by its public key so secure communication channel opens.
We created a symmetric key because its algorithm is faster.
HASH CODE=DIGEST
MD-5 algorithm has collision vulnerability. now SHA3 getting popular

## Digital Signature/Certificate

we send message without encrypting it. BUt we take its hash and send it along the message. sender also sends its piblic key with the certificate. signature header also contains the algorithm type

## Digital Certificates

Digital Certificates are a way of providing that public key to our clients. We want to provide this public key in a trusted manner. Our client should be able to veirfy who the public key owner is.
Certificates are not a transportation mechanism, certificates will be carried by SSL/TLS. Digital Certificate has its owner's identifying information. It also has the digital signature of the Certificate Authority.
Certificate Authority signs the certicate and then send it to the requester.
certificate is hosted on a website. when client starts a secure connection, first thing, this certificate gets downloaded into the client machine. client gets the `Digital Signature of the Certificate Authority`, get its public key from OS and decrypts the signature so we get the hash of the `CA`. then we hash the decrypted CA independently and compare it with the hash.
for well known certifying authorities, root certifying authorities, we have their public keys preinstalled in our OS and browser can use.

## Chain Of Trust

Certificate is actually signed by tier1,tier2.. certifying authority.
we have `ROOT CA` company like "verisign". this root can authorize other set of companies to issue certificates. these are `Tier-2 CA`

## TLS/SSL Handshake

Client sends "Hello" request to tell server what encryption algorithms can the client support. Server sends the public key by the means of Digital certificate. Second thing, it lets client know what encryption algorithms it can support out of what client has requested. (Optionally server can ask the client to prove its certificate. But in web apps, this is done by tokens or cookies. If the client was a software not a user then client has to send the certifiacate)

- CLient verifies the certificate. It reads the public key and encrypts it with the public key that it has extracted from the certificate. This encrypted key is sent to the server and server extracts its public key by using its private key. Now they are ready to communicate.
- If we have 100 instances of server, we can drop the certificate on the load balaancer.

## Firewall

We do not want any external entity to access to our intranet. Firewall has two functions. Allow or Deny. There are 2 kind of cummunication: Incoming called `Ingress`, outgoing `egress`.
With Source Ip range we can block the countries

- Subnet is the range of IP addresses within our network So we create zones. So we can allow clients to some of the subnets. External services cannot access to "Services Subnet" or "Db subnet". We can even add a rule that only "Services Subnet" can access to "DB Subnet"
- Subnet 1 and 2 are called DMZ=Demilitarized Zones

## Authentication and Authorization

Authentication, who you are. Authorization is What can you do.

- **Credentials Transfer**
  1- HTML Forms. this is the only method that not for programmatic way. it is for user.
  2- HTTP Basic: Done by SSL/TLS. for programmatic and user authentication
  3- Digest Based: Similar to Basic. we hashed the password
  4- Certificate Based

## Credentials Storage

LDAP/directory server is a hierchical database, it is designed for reading, browsing,searching, organizing data. We can store user information in the tree format. `LDAP` is a protocol to access data from this kind of directory servers which store information in tree format. Directory servers are good when it comes to read load. This kind of data we do not modify regularly or it is very infrequently modified data. If we are in an enterprise environment where we have lots of users and lots of applications. Maybe you do not want your applications to have these users model separately in separate applications. These users they even have their workstations so for their regular work, they need to authenticate themselves. In those cases, it is a very good choice to have a directory server as a centralized server. It does not only provide authentication for the applicatons that you have in your system but when these users need any kind of access to any machine, they can again use this directory server. Windows Active Directory server is a very good example.
It can also access distributor databases. Let say we have a tree structure under an organization, we can have several departments and for each department we can have separete dieectories. Each department will have their own directory servers. for the entire organization, all these directory servers can be unified to present a single directory server.

- In stateful Authentication, we store the session object in session cache. this makes authentication centralized.
- In stateless auth, we use tokens. decentralized auth.

## OAuth2

It is not for authentication, it is for authorization. Google is the authorization server
Token types, Bearer,MAC. those tokens can be of two formats, JWT or SAML

- `Bearer tokens` are provided to clients by the authorization server. authorization server also sends a refresh token. if the bearer token expires, client get refersh token to get a new token. This token type is like a ticket which has no name or entity. anyone can buy this and anyone who holds this can access this. This the weakness of `Bearer` token. It is pretty simple to implement. Bearer token requires TLS otherwise man in the middle can actually take the token away and can use that token.
- `Mac Token(Holder-of-the-key)` is issued for the particular person. It is like air ticket. ticket has passendger name. These tokens can work without TLS. TLS is required only when client needs to get the access token. Then client safely connect with the server witout https or TLS. Even if the token is stolen by the man in the middle, it cannot use it because that token was issued to a particular client. Mac token response
  {
  " access_token " : " SIAV32hkKG " ,
  " token_type " : " mac " ,
  " expires_in " : 3600 ,
  " refresh_token " : " 8xLOXBtZp8 " ,
  <!-- this is the symmetric key. we dont want man in the middle capture this.  -->

  " mac_key " : " adijq39jdlaska 9asud " ,
  " mac_algorithm " : " hmac - sha - 256 "
  }

  since we do not want man in the middle gets the symemtric key, in the first step of communication is under the protection of TLS. in the next steps when client makes request, symmettic key gets hashed. Then client gets the token and make a request to Resource Sever(Maybe Stackoverflow) with the access_token. Symmetric key is alread embedded into auth access_token and since resource and auth server agree on a token encruption key, it knows how to decrypt it.

https://stackoverflow.com/questions/31209525/oauth-2-0-bearer-tokens-vs-mac-tokens-why-not-using-mac-tokens/73763229#73763229

- applications can track of the request by the api keys so if needed can block
- In outh, google sends auth CODE to browser, browser redirects it to stackoverflow and then stackoverflow makes another request to Google with the auth code to get the access token. The reason Google sends "auth code" is, everything google sends to the browser logged to the browser and auth code is very short lived even it is compromised through the log, we will be fine.

## Token Storage

when you close the browser session Storage is lost
Local Storage is accessible by the javascript code. Not safe.

- Browser cookies are safest place. The biggest vulnerability to tokens come from Javascript. If we can safeguard our tokens from Js, we can secure our tokens. We can declare cookies as HTTP only, which means that JS cannot access those cookies. Browser cookies are vulnerable to CSRF attack but it can be prevented.
- Mobile applications provide private locations where secret data can be kept safely.

## Securing Data at Rest (at database)

- hashed passwords
- Transparent Data encryption: this is the feature that most db vendors provide. Whatever content is written on harddrive is encrypted. User does not know that. All backups are protected. encryption key will be in different file in db. When db needs to access data, it uses this key. key is also encrypted and its key is outside db. Downside of this, admins can see all the data. In health system, we want only doctor and patient this

## SQL Injection

attacker sends code alongside the query. use precompiled prepared statements. Query is already prepared and it is precompiled.

## XSS Attack

User sends code to db saved and other users fetch it. code might me :window.location="attacker.com". always validate input.

## CSRF

Bank should return a CSRF token in the response. it can send it as a cookie similar way a login cookie was provided. logIN cookie is http-only but csrf cookie is not http-only means that it is accessible by javascript. any domain "bank.domain" can access to that cookie.
