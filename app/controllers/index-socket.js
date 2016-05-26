module.exports = function (socket) {

  //advisers' side
  /**socket.on('enqueueAdviser', function(name, queueName) {
   var cn = queues.adviseEnqueue(name, queueName );
   socket.broadcast.emit('queueUpdate',queues.advise[queueName],queueName);
   socket.emit('controlNumber',cn);
  });

  socket.on('dequeueAdviser', function(queueName, number) {
    var updatedBatch = queues.adviseDequeue(queueName,number);
    socket.emit('updateAdviserQueue',updatedBatch);
    socket.broadcast.emit('queueUpdate',updatedBatch,queueName);
  });

  socket.on('getAdviserQueue',function(batch){
    console.log('INSIDEEEE');
    console.log(batch);
    socket.emit('updateAdviserQueue',queues.advise[batch]);
  });
  **/

  socket.on('getAllQueues', function(){
    //console.log(batch);
    var qList = queues.get_all_queues();
    //emit array of queues
    console.log('INSIDE get all queues ' + qList);
    socket.emit('setStaffQueues', qList);
  });

  socket.on('enqueue', function(name, queueName) {
   var cn = queues.add_to_queue(queueName, name );
   var q = queues.get_queue(queueName);
   socket.broadcast.emit('queueUpdate', q['Content'] ,queueName);
   socket.emit('controlNumber',cn);
  });

  socket.on('getQueue', function(qname){
    var queue = queues.get_queue(qname);
    console.log(Object.keys(queue))
    socket.emit('setStaffQueue', qname, queue );
  });

  socket.on('error',function(err,data){
    console.log(err);
  });


};