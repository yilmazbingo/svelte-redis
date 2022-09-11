## SSL/TLS    HTTP+SSL=HTTPS
htttps protocol initiates SSL protocol. When server gets a request, it will initiate a SSL protocol. Server will respond with the public key in a certifacate so that client can verifiy that public key belongs to that certificate. through certificates, servers can transfer its public key to any client. 
Second step, client generates a symmetric key (secret key). client encrypts the symmetric key with the public key of the server. this step is part of the ssl protocol. this symmetric is transferred to the server and server uses its private key to decrypt the symmetric key. server sees that message was encrypted by its public key so secure communication channel opens. 
We created a symmetric key because its algorithm is faster. 
HASH CODE=DIGEST
MD-5 algorithm has collision vulnerability. now SHA3 getting popular
## Digital Signature/Certificate
we send message without encrypting it. BUt we take its hash and send it along the message. sender also sends its piblic key with the certificate. signature header also contains the algorithm type