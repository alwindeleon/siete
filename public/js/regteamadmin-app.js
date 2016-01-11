$(document).ready(function(){
	$('.button-collapse').sideNav({
    //add options
    }
    );

	$("#createAdvising").click(function(){

		$('#displayMessage').text('Please wait...');
		var name = $('#queueName').val();
	    $.post("/regteamadmin/createqueue/",
	    {
	        queueName: name,
	    },
	    function(data, status){
	        console.log(status.code);
	        if(status === 'success'){
	        	var $data = $('<div>').html( data ); 
	 			var msg = $data.find('#message').val(); // this works now
	 			$('#displayMessage').text(name + ' ' + msg + '. Reload homepage to see new queue.');
	 			$('#queueName').val('');
	        }else{
	        	$('#displayMessage').text('Error in creating queue.');
	        }
	    });
	});

	$("#resetAll").click(function(){
	    $.post("#",
	    {
	        //queueName: $('#queueName').val(),
	    },
	    function(data, status){
	        console.log(data);
	        
	    });
	});
});