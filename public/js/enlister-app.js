$(document).ready(function(){
  var socket = io();
  var enlisterName;
  socket.on('connection',function(){
    enlisterName = prompt('which subjects are you going to handle?');
    $('#enlisterName').text(enlisterName);
    socket.emit('getEnlisterQueue',enlisterName);
  });
  socket.on('updateEnlisterQueue',function(updatedBatch){
    console.log("INSIDE");
    console.log(updatedBatch);
    //if queue is empty
    if(updatedBatch == 0 ) {
      $('#queue').empty();
      $('<div/>', {
          'id':'myDiv',
          'class':'collection-item batch1',
          'text':'QUEUE IS EMPTY HOORAY',
      }).appendTo('#queue');
      $('#numEnlisters').text('0');
      
    }else {
      $('#numEnlisters').text(String(updatedBatch.length));
      $('#queue').empty();
      for(var i = 0; i < 5; i++){
        $('<div/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text':updatedBatch[i],
        }).appendTo('#queue');
      }
    }
   
  });

  $('#next').click(function(){
    socket.emit('dequeueEnlister',enlisterName,5);
  });
  $( window ).unload(function() {
    socket.emit('enlistQueueDC',enlisterName);
  });

});