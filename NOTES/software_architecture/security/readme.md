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
