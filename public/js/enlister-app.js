$(document).ready(function(){
  var socket = io();
  var enlisterName, enlisterSubjects;
  socket.on('connection',function(){
    enlisterName = prompt('Whats your name? :D');
    enlisterSubjects = prompt('which subjects are you going to handle?');
    $('#enlisterName').text(enlisterSubjects);
    socket.emit('enlisterConnected',enlisterName, enlisterSubjects.split(','));
  });
  socket.on('updateEnlisterQueue',function(updatedBatch){
    console.log("INSIDE");
    console.log(updatedBatch);
    //if queue is empty
    if(updatedBatch == 0 || updatedBatch.length == 0 ) {
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
      for(var i = 0; i < updatedBatch.length; i++){
        $('<div/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text':updatedBatch[i],
        }).appendTo('#queue');
      }
    }
   
  });

  $('#next').click(function(){
    socket.emit('dequeueEnlistee',enlisterSubjects);
  });
  $( window ).unload(function() {
    socket.emit('enlistQueueDC',enlisterName);
  });

});