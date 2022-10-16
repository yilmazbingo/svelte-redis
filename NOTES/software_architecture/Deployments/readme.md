## Deploy with virtual machines

we install our app in this virtual machine. Then we can take a complete of this machine. each virtual machine uses specified amount of hardware

- reliablility is the biggest improvemnt. we can copy entire system with configuration.
  there are two ways we can run virtual machines.

1- Hypervisor-1 : this is efficient. it is typically used in cloud environments. Hypervisor-1 is closer to bare metal. it actually runs on your physical machine. On top of that you can run a virtual image. In here, we do not have an underlying os between hypervisor and pysical machine.

2- Hypervisor-2 : we have bare machine: (Bare metal is a computer system without a base operating system (OS) or installed applications. It is a computer's hardware assembly) on top we have os. we can instlal virtualization software (vmware workstation or oracle Virtual Box). then you can install your application on top of that machine. In this system we have two os. image's os and your system's os.

## Containers

containers are lightweight virtual machines only.

- the first difference is the way we create images for virtual machines and for containers. virtual machine images are pretty heavy. Virtual machine image includes the os. In order to create a container image, we do not take a running host machine. Instead, we take instructions to create that image. here we do not need a host machine. Instead of os,we have system libraries for that particular os. they start fast because we do not need to bootup any os.

Let's say we bring an image to OS and we run it, it only needs to start the image which does not have any OS in this particular image. any system calls that the components in this particular container needs to make, they all go through container runtime. Let's say we created an image with LInux base image, means that entire container will run in a Linux environment as if it was running on Linux os. All the components of the container, whenever they make a system call, they will make LInux system calls with the library that is available to them, and this container runtime with convert it into the whole operating system system calls.

In computing, a system call is the programmatic way in which a computer program requests a service from the kernel of the operating system it is executed on. A system call is a way for programs to interact with the operating system. A computer program makes a system call when it makes a request to the operating system’s kernel. System call provides the services of the operating system to the user programs via Application Program Interface(API).

### Dockers

- docker enables version control.

- we want to deploy web app on 10 different nodes or 10 different host machines. we can use `Vagrant`. we write config in ruby.

### Kubernetes

- namins containers is better than ip address. cause, ip address might cahnge but name stays.
- We used the term “Rolling Upgrade” to describe a situation where we have multiple servers (usually load-balanced) and we needed to keep “the application” online, while deploying a new version of software.

### Rolling update

- used when it is ok to have both old version and new version simultaneously
- old version is incrementally replaced by a new version as the new version is incrementally rolled-out.
- new version nodes are added to load-balancer node-pool and old-version nodes are removed

### Canary deployment

Canary deployments are a pattern for rolling out releases to a subset of users or servers. The idea is to first deploy the change to a small subset of servers, test it, and then roll the change out to the rest of the servers. The canary deployment serves as an early warning indicator with less impact on downtime: if the canary deployment fails, the rest of the servers aren't impacted.

### Recreate Deployment

- Old and new version cannot run at the same time.

Users will experience some downtime because we need to stop the application before the new version is running. The application won't be available while the original version is shutting down and the new one is starting.

On the other hand, this strategy is easy to set up. We don’t have to manage two different versions of the application simultaneously. If we choose this approach, the updated application will be available for all users immediately. This has a drawback though, because the new version might introduce bugs to the application, and the users will see those as well.

### Blue Green Deployment

https://stackoverflow.com/questions/42358118/blue-green-deployments-vs-rolling-deployments

- it is used when we are deploying risky features. we cannot afford any downtime.
- it requries some extra hardware.
- old version and new version are deployed on different environments. user requests are redirected to the V2 environment. V1 is not serving any request but V2, that is why it requires hardware. if everything goes fine we bring down V1. Incase there is some problem with V2, requests are redirected to V1.

### A/B Testing

Similar to canary release.

A/B testing, also known as split testing, refers to a randomized experimentation process wherein two or more versions of a variable (web page, page element, etc.) are shown to different segments of website visitors at the same time to determine which version leaves the maximum impact and drives business metrics.
