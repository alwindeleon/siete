$(document).ready(function(){
  var socket = io();
  var batch;


  //socket.on('connection',function(){    
  //  socket.emit('getAllQueues');
  //});
  
  socket.on('setStaffQueues',function(qList){
    //console.log("UPDATE ME");
    //console.log(queues);
    //if queue is empty

    
   
  });

  $('#next').click(function(){
    socket.emit('dequeueAdviser',batch,5);
  });


  $('.q-side-btn').click(function(){
    var q_name = $(this).find('span').text();
    //console.log(q_name);
    socket.emit('getQueue', q_name);
  });

  socket.on('setStaffQueue', function(qname, updatedQueue){
    $('#queue-title').text(qname);
    if(updatedQueue === 0) {
      $('#queue').empty();
      $('#numAdvisees').text("0");
      $('<li/>', {
          'id':'myDiv',
          'class':'collection-item batch1',
          'text':'Queue is empty',
      }).appendTo('#queue');
      //$('#numAdvisees').text('0');
      
    }else {
      var content = updatedQueue['Content']
      var len = Object.keys(content).length;
      $('#numAdvisees').text(String(len));
      $('#queue').empty();
      for(var i = 0; i < 10 && i < len; i++){
        $('<li/>', {
            'id':'myDiv',
            'class':'collection-item batch1',
            'text': content[i]['Number'] + " - " + content[i]['Name'],
        }).appendTo('#queue');
      }
    }
  });

});