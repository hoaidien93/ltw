$(function () {
    var socket = io.connect('/');
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var chatroom = $(".chatcontent");
    //set username
    $("#icon-chat").on('click',function () {
        socket.emit('change_username',{username: username.val()});
        console.log(username);
    })
    //send message
    send_message.on('click',function (){
        if (message.val().trim().length > 0) {
            chatroom.scrollTop(99999);
            socket.emit('send_message', {message: message.val()});
            message.val('');
        }
    });
    //receive message
    socket.on('send_message',(data)=>{
        var color = (username.val() === data.username)? 'red' : 'blue';
        chatroom.append("<p class='message-chat'><span style='color:"+color +"'>"+ data.username+"</span>: " + data.message + "</p>");
        chatroom.scrollTop(99999);

    });
});