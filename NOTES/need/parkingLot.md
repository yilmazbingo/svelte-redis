- if there are multiple entrances and exits, interviewers wants to see how good you are at concurrency design.
- this question is not designing distributed system

before you choose the requirements, thnk that how this system will benefit from those requriements.

## Requiremeents

- World largest parking lot is in canada more than 20k parking spots. range is 10k-30k
- this parking lots will have more entrances and exist. n our case 4 and 4
- cusomter collect tickets at the entrance and parking spot is signed on the ticket.
- parking spot for the new customer should be nearest to the entrance
- capacity should not exceed
- different types of parking spots. we have 4 tpyes. handicapped, compact, large car, motorcycle
- system should support hourly parking rate
- cash and credit cards
- should be moitoring system
- make the design reusable. this is the most important requirement. think that you are working for a company that installs different parkign lot systems. that is why when we create data structres we use inheritance

## Design Patterns

1- Creational Design Pattern
this deals how the objects are instantiated.
2- Structural Design Pattern
how different objects and classes are composed in order to form larger structure
3- Behavioral Design Patterns
It deals with the responsibilities of the objects and how they interact with each other

## Design Approaches

- Top-down Design:
  we first construct the high level object and then we identify these smaller sub components and then we design those sub components. then in each subcomponent we identify its subcomponents

- Bottom-up Design

  we first design the smallest component and then we use those smallest components to design a bigger component and so on. this is aligned with the OOB. we will use this.

## Design the system

we do not need Vehicle class. some teachers add but not needed. Because it does not add anything. vehicle parking class is different

- Parking Spot: we can have large, hadnicapped, compact, motorcyle parking spot. there are two ways to represents a parking spot. if you use `Enum` that means you are not an OOB designer. if you need to add another parking spot type, it requires changes at various places in the code would violate `open/close` design. this principe dictates that existing and well tested classes should not be modified. Open-closed Principle (OCP) states: Objects or entities should be open for extension but closed for modification. This means that a class should be extendable without modifying the class itself.

Second approach is deriving each parking spot from parent parking spot. Parent `Parking spot` class will have "id" and "reserved" property. with this design, if we add another parking spot, we will define another class which will inherit from `Parking spot` parent class. this parent class will be abstract class. that means we cannot instantiate.

- Parking Ticket:
  id
  parkingSpot Id
  parkingSpot Type
  Issue time

- Terminal: Entry Terminal and exit Terminal. so we will ahve a parent Terminal class which will have only id. Entry terminal will have `getTicket(parkingSpotType)` and exit terminal willhave `acceptTicket(TicketId)` methods.

- Parking Spot Strategy
  getParkingSpot(terminal)
  releaseParkingSpot(terminal)

  now we need to implement a strategy NearestParkingSpotEntranceStrategy. we have to assign the nearest parking spot to an entering customer from the entrance. this is the crucial part of this implementaion.

  how would you assign a parking spot if you have a single entrance vs multiple entrance is different. we use `min_heaps`. each entry teminal we will have min_heaps. if we have 4 entry terminal we will have 4. for each min-heap we have to keep track of "available" and "reserved parking spots".

  Min_heap operation takes LogN we have k minheaps so finding the closes spot will take `klog(N)`

  - Payment
    it uses Strategy Design Pattern. Strategy is a behavioral design pattern that lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable. Creadit Card Payment class and Cash Payment class. if in the future we add Apple Pay we can add another class.

  we need to calculate the cost of standing

  class Tariff Calculator
  calculateTariff(time, spotType)

- Monitoring system
  It uses observer design pattern. Observer pattern is used when there is one-to-many relationship between objects such as if one object is modified, its depenedent objects are to be notified automatically. Observer pattern falls under behavioral pattern category.

  Observer pattern uses three actor classes. Subject, Observer and Client. Subject is an object having methods to attach and detach observers to a client object. We have created an abstract class Observer and a concrete class Subject that is extending class Observer.

## Parking Lot System Design

It will be a singleton design pattern. this singleton object will be composed of different smaller objects. we will be using factory design pattern to instantiate all those objects

class Parking Lot System Design {}
