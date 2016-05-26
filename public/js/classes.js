$(document).ready(function () {

    var socket = io();

    $('#update-btn').click(function(){
        socket.emit('updateClassesSlots');
    });
   
});