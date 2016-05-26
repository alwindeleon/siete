$(document).ready(function(){
  var socket = io();
  console.log(socket);  
  socket.emit('login');
  socket.on('connection',function(data){
      //alert("connected, ready for long polling!");
  });

  socket.on('queueUpdate', function(queue, queueName){
    var queueToUpdate = $('#'+queueName);
    queueToUpdate.empty();
    console.log(queueToUpdate);
    if(queue.length > 0 && queue.length < 15){
      for(var i = 0; i < queue.length ; i++){        
        $('<li/>', {
            'class':'collection-item batch1',
            'text': queue[i]['Number'] + " - " + queue[i]['Name'],
        }).appendTo('#'+queueName);
      }
    }else if(queue.length > 15){
      for(var i = 0; i < 15 ; i++){        
        $('<li/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text':queue[i],
        }).appendTo('#'+queueName);
      }
    }
  });

  socket.on('newdelQueue',function(){
    location.reload();
  });
  
});