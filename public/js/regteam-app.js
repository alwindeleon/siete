$(document).ready(function(){
  var socket = io();

  var modalTrigger = $('.modal-trigger');
  modalTrigger.leanModal();
  modalTrigger.hide();

  $('select').material_select();

  var queueName = $('#queueName');
  var personName = $('#personName');

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
  $('button#enqueue').click(function(){
      socket.emit('enqueue', personName.val(), queueName.val());
      document.getElementById("formStation").reset();

      //modal.fadeIn(500);
      modalTrigger.click();
  });

  /**
  $('button#enlist').click(function(){
    console.log(enlistSections.val())
      socket.emit('enqueueEnlistee', enlistName.val(), enlistSections.val());
      document.getElementById("formStation").reset(); 
      //modal.fadeIn(500);
      modalTrigger.click();
  });
  **/
});