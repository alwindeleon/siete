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
  socket.on('enqueueEnlistee', function(name, subjects) {
    console.log("inside socket:  enqueueEnlistee")
    queues.enlisteeEnqueue(name,subjects);
    console.log(queues.enlistees)
    console.log(queues.enlisters)
    socket.emit('controlNumber',queues.enlistees.length);
    for(var i =0; i < queues.enlisters.length; i++){
      for(var j = 0; j < subjects.length; j++ ){
        console.log()
        if(queues.enlisters[i][1].indexOf(subjects[j]) > -1 && queues.enlisters[i][2].length == 0){
          console.log("index at " + i);
          console.log("dequeue on : " + queues.enlisters[i][0] +  " at " + queues.enlisters[i][1] + " with " + queues.enlisters[i][2])
          console.log("dequeue at " + queues.enlisters[i][0])
          var curStudents = queues.enlisteeDequeue(queues.enlisters[i][0],queues.enlisters[i][1]);
          console.log("received " + curStudents);
          socket.emit('updateEnlisterQueue',curStudents);
          return;
        }
      }
    }
  });

  socket.on('dequeueEnlistee', function(nameOfProf) {
    console.log("inside socket:  enqueueEnlistee");
    for(var i = 0; i < queues.enlisters.length; i++){
      if(queues.enlisters[i][0] == nameOfProf){
        var curStudents = queues.enlisteeDequeue(nameOfProf,queues.enlisters[i][1]);
        socket.emit('updateEnlisterQueue',curStudents);
        socket.broadcast.emit('queueUpdate',nameOfProf,curStudents);
        break;
      }
      
    }

  });

  socket.on('error',function(err,data){
    console.log(err);
  })

  socket.on('enlisterConnected',function(prof, subjects){
    console.log(subjects);
    queues.createEnlister(prof,subjects);
    var curStudents = queues.enlisteeDequeue(prof,subjects);
    socket.emit('updateEnlisterQueue',curStudents);
    socket.broadcast.emit('createQueueEnlist',prof,curStudents);
    socket.broadcast.emit('newdelQueue');
  });

  socket.on('enlistQueueDC',function(prof){
    for(var i = 0; i < queues.enlisters.length; i++){
      if(queues.enlisters[i][0] == prof){
        queues.enlisters.splice(i,1);
        socket.broadcast.emit('newdelQueue');
      }
    }

  });

};