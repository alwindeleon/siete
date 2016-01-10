$(document).ready(function(){
  var socket = io();
  console.log(socket);  
  socket.emit('login');
  socket.on('connection',function(data){
      alert("connected, ready for long polling!");
    });

  socket.on('queueUpdate', function(queue, queueName){
    var queueToUpdate = $('#'+queueName);
    queueToUpdate.empty();
    for(var i = 0; i < queue.length; i++){
      if(i < 5){
        $('<div/>', {
            'id':'myDiv',
            'class':'collection-item batch1 red lighten-1',
            'text':queue[i],
        }).appendTo('#'+queueName);
      }else{
        $('<div/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text':queue[i],
        }).appendTo('#'+queueName);
      }
        
    }
  })
});