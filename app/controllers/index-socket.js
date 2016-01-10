module.exports = function (socket) {
  //You can declare all of your socket listeners in this file, but it's not required 
  socket.on('enqueueAdviser', function(name, queueName) {
   var cn = queues.adviseEnqueue(name, queueName );
   socket.broadcast.emit('queueUpdate',queues.advise[queueName],queueName);
   socket.emit('controlNumber',cn);
  });

  socket.on('enqueueEnlister', function(name, subjects) {
   console.log('logged in');
   console.log(queues);
  });

  socket.on('dequeueEnlister', function(queueName, number) {
   console.log('logged in');
   console.log(queues);
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

};