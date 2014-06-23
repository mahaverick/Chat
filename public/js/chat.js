jQuery(function($) {
	// body...
	var socket = io.connect();

	var $nickForm = $('#userNick');
	var $nickError	= $('#nickError');
	var $nickName = $('#nickName');
	var	$name = $('#name');
	var $partnerForm = $('#partnerSelection');
	var $partnerError =$('#partnerSelectionError');
	var $partner = $('#partnerName');
	var $usersList = $('#usersList');
	var $messageForm = $('#sendMessage');
	var $message = $('#message');
	var $chat = $('#chat');

	$nickForm.submit(function(e) {
		e.preventDefault();
		socket.emit('newUser', $nickName.val(), function(data) {
			if(data) {
				$('#nickWrap').hide();
				$('#partnerSelectionWrap').show();
				$('#nicknameBoard').show();
				//$name.html($nickName.val());
			}
			else {
				$nickError.html('This Nickname already taken. Please Enter different nickname');
			}
		});
		$name.html('<b>'+$nickName.val()+ '</b>');
		$nickName.val('');
	});

	$partnerForm.submit(function(e) {
		e.preventDefault();
		socket.emit('partnerSelection', $partner.val(), function(data) {
			if(data) {
				$('#partnerSelectionWrap').hide();
				$('#contentWrap').show();
			}
			else {
				$partnerError.html('This user is not online now!');
			}
		});
		$partner.val('');
	});

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit('sendNewMessage', $message.val());
		$message.val('');
	});

	socket.on('receiveNewMessage', function(data) {
		$chat.append( '<b>' + data.nick + '</b>: ' + data.msg + '<br>' );
	});

	socket.on('usernames', function(data) {
		var html='';
		for(var i = 0; i < data.length; i++) {
			html+='<li>'+data[i]+'</li>';
		}
		$usersList.html(html);
	});

});