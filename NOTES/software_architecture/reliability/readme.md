- RELIABILITY, AVAILABILITY, FAULT TOLERANCE

System is reliable even in the presence of partial failures. an airplane is reliable because if one engine fails, it can still fly. it is measured as the probability of a system working correctly in a given time interval. Availability extends the reliability. it goes down when we do maintenance `successful Requests / totalRequsts`, `uptime/uptime+downtime`

- 100 percent availbality is very hard. high availbality is costly. we need to upgrade our application so our app will be down.

## Create Fault tolerant design

1- we provide reduncany
2- build a system such a way that it can detect faults that are happening in automated fashion
3- then recoever from detected faults by using the reduncany that has been provided
**Reduncancy** it is about keeping redundant capacity (backup) within a system. Replication of critical components or functions of a system in order to increase its reliability. A secondary capacity is kept ready as a backup, over and above the primary capacity.

1- Active Reduncany (Hot SPare)
for a given component, we have two instances that are running simultaneously and we actually need only one of them. we cannot say wehich one is primary or secondary. both are primary. the load is distrubuted. if one of them goes down, the other one will take over. extremely quick and most ideal way of providing availbality. like engines in aeroplanes.

2- Passive Reduncancy (Warm Spare):
we hve primary and standby. if primary goes down then the load is diverted to the secondary capacity. quick way of diverting the load. it wont be as quick as active reduncany. it is like substitite players in soccer game

3- Cold Reduncany Spare(Backup):

It is not high availbality option. primary capacity serves the entire load. we do not even provision the secondary capacity. Only in the primary instance or primary capacity goes down, we make arrangements to provision the secondary capacity. there is significant time delay. it is low cost option. backup tyres in cars.

## reduncany for stateless components
