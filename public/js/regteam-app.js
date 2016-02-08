$(document).ready(function(){
  var socket = io();

  var modalTrigger = $('.modal-trigger');
  modalTrigger.leanModal();
  modalTrigger.hide();

  $('select').material_select();

  var adviseBatch = $('#batchName');
  var adviseName = $('#adviseName');

  var enlistSubjects = $('#subjects');
  var enlistName = $('#enlistName');
  var enlistSections = $('#sections');
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
      document.getElementById("formStation").reset();

      //modal.fadeIn(500);
      modalTrigger.click();
  });

  $('button#enlist').click(function(){
    console.log(enlistSections.val())
      socket.emit('enqueueEnlistee', enlistName.val(), enlistSections.val());
      document.getElementById("formStation").reset(); 
      //modal.fadeIn(500);
      modalTrigger.click();
  });
});