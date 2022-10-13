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
