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
    
    if(queue.length > 0 && queue.length < 15){
      for(var i = 0; i < queue.length ; i++){        
        $('<li/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text':queue[i],
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
<<<<<<< HEAD
  })

  socket.on('deleteEnlistmentQueue',function(){
    location.reload();
  })
=======
      
  });
>>>>>>> 8144a275b4bff34fcfe63c18715fab0490587f62
});