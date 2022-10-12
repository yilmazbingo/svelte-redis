## Deploy with virtual machines

we install our app in this virtual machine. Then we can take a complete of this machine. each virtual machine uses specified amount of hardware

- reliablility is the biggest improvemnt. we can copy entire system with configuration.
  there are two ways we can run virtual machines.

1- Hypervisor-1 : this is efficient. it is typically used in cloud environments. Hypervisor-1 is closer to bare metal. it actually runs on your physical machine. On top of that you can run a virtual image. In here, we do not have an underlying os between hypervisor and pysical machine.

2- Hypervisor-2 : we have bare machine: (Bare metal is a computer system without a base operating system (OS) or installed applications. It is a computer's hardware assembly) on top we have os. we can instlal virtualization software (vmware workstation or oracle Virtual Box). then you can install your application on top of that machine. In this system we have two os. image's os and your system's os.
