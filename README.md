# The BFX challenge

Your task is to create a simplified distributed exchange

* Each client will have its own instance of the orderbook.
* Clients submit orders to their own instance of orderbook. The order is distributed to other instances, too.
* If a client's order matches with another order, any remainer is added to the orderbook, too.

Requirement:
* Code in Javascript
* Use Grenache for communication between nodes
* Simple order matching engine
* You don't need to create a UI or HTTP API

You should not spend more time than 6-8 hours on the task. We know that its probably not possible to complete the task 100% in the given time.


If you don't get to the end, just write up what is missing for a complete implementation of the task. 
Also, if your implementation has limitation and issues, that's no big deal. 
Just write everything down and indicate how you could solve them, given there was more time.



### Approach:
- Create a RPC Client and Server,
- The Server is  listing for an event PROCESS_ORDER, It has a list Order
  If the server received a order and found a match between the buy and sell
  Should send the orderFound to the Client, 
- The client has the OrderBook and  it's going to take care of process the order
- On this Scenario,  there is already a preload buy order, when executing the start:demo:client, its going to sent a sell order that is going to make the match if the preload order 




Pending work:
 * Decouple rpc server, there is logic mix between the RPC Server config and the process order, should as the rpc-client that is class only with rpc client creation.
 * Add logic of to handle the remainer part of the order