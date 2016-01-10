$(document).ready(function(){
  var socket = io();
  var batch;
  socket.on('connection',function(){
    batch = prompt('which batch are you going to handle?');
    $('#batch').text(batch);
    socket.emit('getAdviserQueue',batch,function(data){
      console.log("done cause: " + data);
    });
  });
  socket.on('updateAdviserQueue',function(updatedBatch){
    console.log("INSIDE");
    console.log(updatedBatch);
    //if queue is empty
    if(updatedBatch === 0) {
      $('#queue').empty();
      $('<div/>', {
          'id':'myDiv',
          'class':'collection-item batch1',
          'text':'QUEUE IS EMPTY HOORAY',
      }).appendTo('#queue');
      $('#numAdvisees').text('0');
      
    }else {
      $('#numAdvisees').text(String(updatedBatch.length));
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
    socket.emit('dequeueAdviser',batch,5);
  });

});