- A resilient app is one that continues to function despite failures of system components.

- how to handle if some of your servers go down.

- what if your database stop serving in entire region. maybe power surge will kill your entire system. what if hurricane hit your data center.

- your app might have more than one load balancer, each serves different continent. we can create georouting system. If the europe datacenter is down, load balancer will see that it is not responsing anymore and it will route to a different data center. it will be alittle more slower. so you need to make sure each data center has enough capacity to handle those extra traffic.
