module.exports = function (socket) {

  //advisers' side
  socket.on('enqueueAdviser', function(name, queueName) {
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


  //enlisters side
  socket.on('enqueueEnlister', function(name, subjects) {
    queues.enlisteeEnqueue(name,subjects);
    console.log(queues.enlistees);
    subjectsArr = subjects.split(',');
    for(var i = 0; i < subjectsArr.length; i++){
      queues.enlisterEnqueue(name, subjectsArr[i]);
    }
     socket.broadcast.emit('updateEnlisterQueue',queues.enlisters[subjects])
  });

  socket.on('dequeueEnlister', function(name, number) {
    queues.enlisterDequeue(name);
    socket.emit('updateEnlisterQueue',queues.enlisters[name] );
    socket.broadcast.emit('queueUpdate',queues.enlisters[name],name);
  });

  socket.on('getEnlisterQueue',function(name){
    console.log("IN");
    queues.createEnlister(name);
    socket.emit('updateEnlisterQueue',queues.enlisters[name]);
    socket.emit('createQueueEnlist',queues.enlisters[name], name);
  });

  socket.on('enlistQueueDC',function(subjects){
    delete queues.enlisters[subjects];
    socket.emit('deleteEnlistmentQueue');
  });

};