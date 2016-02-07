$(document).ready(function(){
  var socket = io();
  var adviseBatch = $('#batchName');
  var adviseName = $('#adviseName');

  var enlistSubjects = $('#subjects');
  var enlistName = $('#enlistName');
  var cn = $('#CN');

  var modal = $('#modal1');
  socket.on('controlNumber',function(controlNumber){
    cn.text(controlNumber);
  });

  $('#close').click(function(){
    modal.hide();
    cn.text('loading. . .');
  });
  $('button#advise').click(function(){
      socket.emit('enqueueAdviser', adviseName.val(), adviseBatch.val());
      adviseName.val('');
      adviseBatch.val('');
      modal.fadeIn(500);
  });

  $('button#enlist').click(function(){
      socket.emit('enqueueEnlister', enlistName.val(), enlistSubjects.val());
      enlistName.val('');
      enlistSubjects.val(''); 
      alert('enlisted!');
  });
});